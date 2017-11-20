Charto
======

[![build status](https://travis-ci.org/charto/charto.svg?branch=master)](http://travis-ci.org/charto/charto)

This is an online JavaScript-based GIS platform under heavy development, with these goals:

<details><summary>Small, efficient and MIT-licensed.</summary>

  - No bloat. Keep entire `dependencies` hierarchy minimal.
  - Same applies to `devDependencies`.
  - Use suitable caching, compression, data structures and algorithms.</details>
<details><summary>Easy to use.</summary>

  - Targeting users who could handle desktop GIS software.
  - Convention over configuration. Allow, but don't require changing settings.</details>
<details><summary>No need to install, register or login.</summary>

  - Back-end is optional, anything serving static files over HTTP is enough.
  - Compute everything client-side when possible.
  - Support local file import and export.</details>
<details><summary>Easy to extend or use parts in other projects.</summary>

  - Aggressively split everything into general-purpose NPM packages.
  - Simplest possible monorepo structure allows heavy overall customization for specific projects.
  - Keep all parts small and documented.
  - Tooling choice criteria:
    1. Compatibility with other goals and tooling.
    2. Size and efficiency. Is the tool actually needed?
    3. Developer ease of use.
    4. Popularity.</details>

<details><summary>Latest and greatest technologies (as of Q4 2017).</summary>

  - ES6 syntax, statically typed using TypeScript.
  - [mobx-state-tree](https://github.com/mobxjs/mobx-state-tree) and [classy-mst](https://github.com/charto/classy-mst) for easy state management without boilerplate.
  - Leaflet maps with vector tiles and WebGL rendering.
  - [PhosphorJS](https://github.com/phosphorjs/phosphor) and [phosphor-float-area](https://github.com/charto/phosphor-float-area) for easy UI customization by end users.
  - [SystemJS](https://github.com/systemjs/systemjs) and [cbuild](https://github.com/charto/cbuild) for ES6 imports and bundling without backend requirements.
  - [dgrid](http://dgrid.io/) for one tree grid widget with all the bells and whistles, because there's still no suitably licensed alternative.
  - React for easy custom UI components.</details>

Click on the goals to see what they mean in practice.

This is a single repository containing several Charto packages. It follows the [alle](https://github.com/boennemann/alle)
model, with packages under `packages/node_modules`.
Most `devDependencies` are only in the top-level `package.json`.

Contents:

| Package | NPM | Description |
----------|-----|--------------
[cgeo](packages/node_modules/cgeo) | [![npm version](https://img.shields.io/npm/v/cgeo.svg)](https://www.npmjs.com/package/cgeo) | Geographic data types
[cgeo-calc](packages/node_modules/cgeo-calc) | [![npm version](https://img.shields.io/npm/v/cgeo-calc.svg)](https://www.npmjs.com/package/cgeo-calc) | computational geometry algorithms for cgeo types
[cgeo-cpak](packages/node_modules/cgeo-cpak) | [![npm version](https://img.shields.io/npm/v/cgeo-cpak.svg)](https://www.npmjs.com/package/cgeo-cpak) | cpak import/export for cgeo types
[cgeo-wkb](packages/node_modules/cgeo-wkb) | [![npm version](https://img.shields.io/npm/v/cgeo-wkb.svg)](https://www.npmjs.com/package/cgeo-wkb) | WKB import/export for cgeo types
[cgeo-wkt](packages/node_modules/cgeo-wkt) | [![npm version](https://img.shields.io/npm/v/cgeo-wkt.svg)](https://www.npmjs.com/package/cgeo-wkt) | WKT export for cgeo types
[charto-3d](packages/node_modules/charto-3d) | [![npm version](https://img.shields.io/npm/v/charto-3d.svg)](https://www.npmjs.com/package/charto-3d) | Small WebGL helper library
[charto-leaflet](packages/node_modules/charto-leaflet) | [![npm version](https://img.shields.io/npm/v/charto-leaflet.svg)](https://www.npmjs.com/package/charto-leaflet) | Useful classes for Leaflet
[charto-model](packages/node_modules/charto-model) | [![npm version](https://img.shields.io/npm/v/charto-model.svg)](https://www.npmjs.com/package/charto-model) | Geodata model using mobx-state-tree
[charto-render](packages/node_modules/charto-render) | [![npm version](https://img.shields.io/npm/v/charto-render.svg)](https://www.npmjs.com/package/charto-render) | Geodata renderer
[geotree](packages/node_modules/geotree) | [![npm version](https://img.shields.io/npm/v/geotree.svg)](https://www.npmjs.com/package/geotree) | Geodata storage
[mst-dstore](packages/node_modules/mst-dstore) | [![npm version](https://img.shields.io/npm/v/mst-dstore.svg)](https://www.npmjs.com/package/mst-dstore) | dstore implementation backed by mobx-state-tree
[phosphor-dgrid](packages/node_modules/phosphor-dgrid) | [![npm version](https://img.shields.io/npm/v/phosphor-dgrid.svg)](https://www.npmjs.com/package/phosphor-dgrid) | Full-featured Dojo-based grid widget for PhosphorJS
[phosphor-leaflet](packages/node_modules/phosphor-leaflet) | [![npm version](https://img.shields.io/npm/v/phosphor-leaflet.svg)](https://www.npmjs.com/package/phosphor-leaflet) | Leaflet widget for PhosphorJS

Getting started
---------------

```bash
git clone https://github.com/charto/charto.git
cd charto
npm install
npm run build
npm start
```

Then navigate to: [http://localhost:8080/](http://localhost:8080/)

The frontend uses [SystemJS](https://github.com/systemjs/systemjs).
It works directly from the public directory of any HTTP server.
With an IDE that supports `compileOnSave`
(eg. [`atom-typescript`](https://atom.io/packages/atom-typescript) or
[TypeScript for VS Code](https://github.com/mrcrowl/vscode/releases/tag/13.10.8))
the frontend page always stays up to date while editing TypeScript source code.

Contributing
------------

### Adding new files

Source code file extensions should always be `.ts` or `.tsx` or the compiler
may ignore the code, breaking references to it from elsewhere.

Files containing classes or types intended as part of the public API, should
be referenced in the package's `index.ts` like this:

```TypeScript
export { MyClass } from './MyClass';
```

The corresponding file may be named `MyClass.ts` or `MyClass.tsx`.

### Adding new external NPM packages

According to [alle](https://github.com/boennemann/alle#define-dependencies-globally),
packages are installed in the repository top-level `node_modules` directory.

Since the project uses TypeScript, usually you also want to install typings. For example:

```bash
npm install --save react-leaflet
npm install --save @types/react-leaflet
```

Next, you should use the package. Easiest way is to add somewhere:

```TypeScript
export * from 'react-leaflet';
```

Exporting the package contents causes it to be used in transpiled JSON.
If you use a TypeScript IDE, saving the file will already have transpiled it.
Otherwise re-build the frontend from the command line:

```bash
npm run build:frontend
```

Now, `config-npm.js` needs updating so SystemJS can find files in the new
package. Creating a production bundle updates it automatically. Run the commands:

```bash
cd bundler
npm install
cd ..
npm run bundle
```

Now that the bundler is installed, next time the first 3 commands
(`cd` and `npm install`) are not needed.

It's important that the new package is somehow used in the code, or the bundler
will still ignore it and not update the necessary config paths.

This also bundles the software for production, meaning that reloading the page
in a browser will load the bundle instead of any more recent changes.
To fix that, delete or rename `dist/bundle.js`.

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/charto/master/LICENSE)

Copyright (c) 2017 BusFaster Ltd
