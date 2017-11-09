System.config({
	transpiler: false,

	map: {
		dojoLoader: 'bundler/dojo.js',
		undefined: 'bundler/undefined.js',
		dstore: 'node_modules/dojo-dstore',
		crypto: '@empty',
		dojoRequire: 'bundler/require.js',
		css: 'node_modules/systemjs-plugin-css/css.js'
	},

	meta: {
		'dist/bundle.js': {
			format: 'system'
		}
	},

	packages: {
		'node_modules/dojo/': {
			defaultExtension: 'js',
			meta: {
				'*.js': { loader: 'dojoLoader' }
			}
		},
		'node_modules/dojo-dstore/': {
			defaultExtension: 'js',
			meta: {
				'*.js': { loader: 'dojoLoader' }
			}
		},
		'node_modules/dgrid/': {
			defaultExtension: 'js',
			meta: {
				'*.js': { loader: 'dojoLoader' }
			}
		},
		'node_modules/phosphor-dgrid/node_modules/dojo/': {
			defaultExtension: 'js',
			meta: {
				'*.js': { loader: 'dojoLoader' }
			}
		},
		'node_modules/phosphor-dgrid/node_modules/dojo-dstore/': {
			defaultExtension: 'js',
			meta: {
				'*.js': { loader: 'dojoLoader' }
			}
		},
		'node_modules/phosphor-dgrid/node_modules/dgrid/': {
			defaultExtension: 'js',
			meta: {
				'*.js': { loader: 'dojoLoader' }
			}
		},
		'packages/node_modules/frontend/dist/': {
			defaultExtension: 'js',
			meta: {
				'*.css': { loader: 'css' }
			}
		},
		'dist/': {
			defaultExtension: 'js',
			meta: {
				'*.css': { loader: 'css' }
			}
		}
	}
});
