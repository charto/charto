// This file is part of mst-dstore, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as Store from 'dstore/Store';
import * as Trackable from 'dstore/Trackable';
import * as Promised from 'dstore/Promised';
import * as SimpleQuery from 'dstore/SimpleQuery';
import { IObservableArray } from 'mobx';
import { IStateTreeNode } from 'mobx-state-tree';
import { types as T, getPathParts, onSnapshot, onPatch } from 'mobx-state-tree';
import * as Deferred from 'dojo/Deferred';
import * as declare from 'dojo/_base/declare';

export type Item = any;

function wrapArray(data: any[], totalLength = data.length) {
	const Result: { new(): dstore.FetchArray<Item> } = function() {} as any;

	Result.prototype = data;

	const result = new Result();
	result.totalLength = totalLength;

	return(result);
}

const MstoreClass = declare([ Store, Promised, SimpleQuery ], {

	constructor: function(tree: IStateTreeNode) {
		this.tree = tree;
	},

	data: null as any as any[],
	tree: null as any as IStateTreeNode,
	index: {} as { [id: string]: IStateTreeNode },

	setData: function() {},

	fetchSync: function(): dstore.FetchArray<Item> {
		const list = this.tree as IObservableArray<any>;
		return(wrapArray(list));
	},

	fetchRangeSync: function({ start, end }: { start: number, end: number }): dstore.FetchArray<Item> {
		const list = this.tree as IObservableArray<any>;
		return(wrapArray(list.slice(start, end), list.length));
	},

	addSync: function() {},

	putSync: function(object: Item, options?: {}) {
console.trace('putSync');
console.log(object);
console.log(options);
	},

	getSync: function(id: any) {
console.log('getSync');
console.log(id);
		return(this.index[id]);
	},

	removeSync: function(id: any) { return(true); },

	getIdentity: function(item: Item) {
		let id = item.id;

		if(!id && id !== 0) {
			const parts = getPathParts(item);
			let node = this.tree;

			for(let depth = 0; depth < parts.length; ++depth) {
				node = (node as { [key: string]: any })[parts[depth]];
				id = (node as any).id;
				if(id || id === 0) parts[depth] = '' + id;
			}

			id = parts.join('/');
		}

		this.index[id] = item;

// console.log('getIdentity');
// console.log(id);

		return(id)
	},

	getRootCollection: function() {
		return(this);
	},

	mayHaveChildren: function(item: IStateTreeNode) {
		return(!!(item as any).children);
	},

	getChildren: function(item: IStateTreeNode) {
console.log('getChildren');
		return(new Mstore((item as any).children));
	}

}).createSubclass([ Trackable ]);

export const Mstore = MstoreClass;
