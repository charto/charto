mst-dstore
==========

This is a Dojo [dstore](http://dstorejs.io/)-compatible store backed by
[mobx-state-tree](https://github.com/mobxjs/mobx-state-tree).
It allows visualizing the data in a [dgrid](http://dgrid.io/)
editable tree grid widget with drag & drop support.

Usage
-----

The store wraps a single MobX State Tree node as the root of the sub-tree
exposed to Dojo. Pass it to the store constructor.

```TypeScript
import { types as T } from 'mobx-state-tree';
import { Mstore } from 'mst-dstore';

export const Model = T.model({
	id: '',
	children: T.late(() => T.maybe(T.array(Model)))
});

export const node = Model.create({
	id: 'Animalia',
	children: [
		{ id: 'Arthropoda' },
		{
			id: 'Chordata',
			children: [
				{ id: 'Aves' },
				{ id: 'Mammalia' },
				{ id: 'Reptilia' }
			]
		}
	]
});

const store = new Mstore(node);

// Use with a dgrid:
// dgrid.set('collection', store.getRootCollection());
```

Nodes should have an `id` property with an arbitrary string or number, and
nodes with children should have a `children` property containing an array
of their immediate child nodes.

To allow moving nodes, they must also implement a `detach` method calling
the `detach` function from `mobx-state-tree`.

License
=======

[The MIT License](https://raw.githubusercontent.com/charto/charto/master/LICENSE)

Copyright (c) 2017-2018 BusFaster Ltd
