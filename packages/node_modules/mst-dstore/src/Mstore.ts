// This file is part of mst-dstore, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as Store from 'dstore/Store';
import * as Trackable from 'dstore/Trackable';
import * as Promised from 'dstore/Promised';
import * as SimpleQuery from 'dstore/SimpleQuery';
import { IObservableArray } from 'mobx';
import { IStateTreeNode } from 'mobx-state-tree';
import { types as T, getPath, getPathParts, getParent, getRoot, getSnapshot, applyPatch, onSnapshot, onPatch } from 'mobx-state-tree';
import * as Deferred from 'dojo/Deferred';
import * as declare from 'dojo/_base/declare';

export type Item = any;

function wrapArray(data: any, totalLength = data.length) {
	const Result: { new(): dstore.FetchArray<Item> } = function() {} as any;

	Result.prototype = data;

	const result = new Result();
	result.totalLength = totalLength;

	return(result);
}

const MstoreClass = declare([ Store, Promised, SimpleQuery ], {

	constructor: function(tree: IStateTreeNode, storeIndex: any) {
		this.tree = tree;

		if(storeIndex) this.storeIndex = storeIndex;

		this.storeIndex[this.getIdentity(tree)] = this;
	},

	data: null as any as any[],
	tree: null as any as IStateTreeNode,
	index: {} as { [id: string]: IStateTreeNode },
	storeIndex: {} as any,

	setData: function() {},

	fetchSync: function(): dstore.FetchArray<Item> {
		const list = (this.tree as any).children as IObservableArray<any>;
		return(wrapArray(list));
	},

	fetchRangeSync: function({ start, end }: { start: number, end: number }): dstore.FetchArray<Item> {
		const list = (this.tree as any).children as IObservableArray<any>;
		return(wrapArray(list.slice(start, end), list.length));
	},

	addSync: function() {},

	putSync: function(item: Item, options?: any) {
		const id = options.beforeId;

		let parentItem = getParent(getParent(item));

		parentItem.detach(item);

		this.storeIndex[
			this.getIdentity(parentItem)
		].emit(
			'delete', {
				target: item
			}
		);

		let target: any;
		let path: string;

		if(id) {
			target = this.index[id];
			path = getPath(target);
		} else {
			target = item;
			path = '/children/' + getRoot(this.tree).children.length;
		}

		applyPatch(this.tree, {
			op: 'add',
			path,
			value: item
		});

		parentItem = getParent(getParent(target));

		this.storeIndex[
			this.getIdentity(parentItem)
		].emit(
			'add', {
				beforeId: options.beforeId,
				target: item
			}
		);

		// TODO: emit update event if item was not moved.
	},

	getSync: function(id: any) {
		return(this.index[id]);
	},

	removeSync: function(id: any) {
		const item: Item = this.index[id];

		let parent = getParent(item) as IObservableArray<Item>;
		let pos = parent.indexOf(item);

		parent.splice(pos, 1);

		return(true);
	},

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

		return(id)
	},

	getRootCollection: function() {
		return(this);
	},

	mayHaveChildren: function(item: IStateTreeNode) {
		return(!!(item as any).children);
	},

	getChildren: function(item: IStateTreeNode) {
		return(new Mstore(item as any, this.storeIndex));
	}

}).createSubclass([ Trackable ]);

export const Mstore = MstoreClass;
