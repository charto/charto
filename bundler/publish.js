const path = require('path');
const cbuild = require('cbuild');
const System = require('systemjs');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const resolveAsync = Promise.promisify(require('browser-resolve'));

const libPath = path.resolve('.', process.argv[2]);
const basePath = path.resolve(__dirname, '..');

System.config({ baseURL: 'npm:/' });

eval(fs.readFileSync('../config.js', { encoding: 'utf-8' }));

/** Recursively walk a directory tree.
  * @param dir Path to root of tree to explore.
  * @param before Function called with contents of each directory, before
  * entering subdirectories. Directories have an enterDir flag set and
  * clearing it prevents recursing inside.
  * @param after Function called for each directory after exploring
  * subdirectories. Return value should contain a list of dependencies.
  * @param name Name of the current npm package.
  * @param depth Current recursion depth in directory tree.
  * @return List of strings returned by the "after" callback, without any
  * empty strings or name of the current NPM package. */

function walk(dir, before, after, name = null, depth = 0) {
	const listed = fs.readdirAsync(
		dir
	).then((list) => Promise.map(list, (item) => {
		const child = path.resolve(dir, item);

		const result = fs.statAsync(
			child
		).then((stat) => ({
			path: child,
			name: item,
			isFile: stat.isFile(),
			enterDir: stat.isDirectory()
		}));

		return(result);
	}));

	const result = listed.then(
		(items) => before(items, depth)
	).then(() => Promise.map(
		listed.value(),
		(item) => item.enterDir && walk(item.path, before, after, item.name, depth + 1)
	)).then(
		(children) => after(listed.value(), children)
	).then((dependencyList) => {
		if(depth == 1) {
			console.log(name);
			console.log('\t' + dependencyList.filter((dependency) => dependency && dependency != name).join('\n\t') + '\n');
		}

		return(dependencyList);
	});

	return(result);
}

/** Detect NPM package root directories by presence of a package.json file.
  * Only enter a subdirectory called "src".
  * Usable as a "before" callback for the walk function.
  * @return Filtered list of directory contents. */

function filterChildren(children, depth) {
	if(depth == 1) {
		let found = false;

		for(let item of children) {
			if(item.name == 'package.json') found = true;
			if(item.name != 'src') item.enterDir = false;
		}

		if(!found) return([]);
	}

	return(children);
}

/** Parse all ES6 import statements in .ts files inside a single directory.
  * Use SystemJS to resolve them, look for "node_modules" in their paths and
  * output subsequent package names found.
  * Usable as an "after" callback for the walk function. */

function collectImports(items, children) {
	const result = Promise.map(items, (item) => {
		const name = item.name;
		const parent = cbuild.path2url(item.path);
		const pos = name.indexOf('.') + 1;
		const ext = name.substr(pos);

		if(!item.isFile || !pos || ext != 'ts') return(null);

		const result = fs.readFileAsync(
			item.path,
			{ encoding: 'utf-8' }
		).then((source) => {
			const importList = [];

			for(let line of source.split(/[;\n]+\s*/)) {
				const match = line.match(/^import[ \t]+([ \t$*,-.0-9A-Z_a-z{}]+[ \t]+from[ \t+])?['"]([^'"]+)['"]/);

				if(match) importList.push(match[2]);
			}

			const result = Promise.map(importList, (relative, resolved) =>
				Promise.try(
					() => System.normalize(relative, parent, parent)
				).then((result) => {
					let ready;

					result = result.replace(/\!.*/, '');

					if(result.substr(0, 5) == 'npm:/') {
						resolved = path.resolve(basePath, result.substr(5));

						ready = fs.statAsync(
							resolved
						).catch((err) => {
							resolved += '.js';
							return(fs.statAsync(resolved));
						}).catch((err) => {
							resolved = result;
							return(cbuild.findPackage(result.substr(5), parent, '/'));
						});
					} else {
						resolved = cbuild.url2path(result);

						ready = fs.statAsync(
							resolved
						).catch((err) => {
							resolved += '.ts';
							return(fs.statAsync(resolved));
						});
					}

					return(ready);
				}).then((result) => {
					if(resolved.substr(0, 5) == 'npm:/') resolved = result;

					let isModule = false;
					let name = '';

					for(let part of resolved.replace(/\!.*/, '').split('/')) {
						if(part.toLowerCase() == 'node_modules') {
							// New deepest node_modules directory was found.
							// Start looking for name of NPM package
							// actually containing this file.
							isModule = true;
							name = '';
						} else if(isModule) {
							if(part.charAt(0) == '@') {
								// Handle scoped packages:
								// After scope name the package name still follows.
								name = part + '/';
							} else {
								// Get package name and stop appending to it.
								name += part;
								isModule = false;
							}
						}
					}

					return(name);
				}).catch((err) => {
					console.log(err);
				})
			);

			return(result);
		});

		return(result);
	}).then((parsedImportList) => {
		const nameTbl = {};

		// Dependencies of source files in this directory.

		for(let dependencyList of parsedImportList) {
			for(let dependency of dependencyList || []) {
				nameTbl[dependency] = true;
			}
		}

		// Dependencies of files in subdirectories.

		for(let dependencyList of children) {
			for(let dependency of dependencyList || []) {
				nameTbl[dependency] = true;
			}
		}

		return(Object.keys(nameTbl).sort());
	});

	return(result);
}

walk(libPath, filterChildren, collectImports).then(() => {
	console.log('ALL DONE');
});
