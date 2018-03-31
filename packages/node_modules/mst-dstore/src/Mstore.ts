// This file is part of mst-dstore, copyright (c) 2017-2018 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as Store from 'dstore/Store';
import * as Trackable from 'dstore/Trackable';
import * as Promised from 'dstore/Promised';
import * as SimpleQuery from 'dstore/SimpleQuery';
import { IObservableArray } from 'mobx';
import {
	types as T,
	IStateTreeNode,
	getSnapshot,
	getPath,
	getPathParts,
	getParent,
	hasParent,
	isAlive,
	isStateTreeNode,
	joinJsonPath,
	applyPatch
} from 'mobx-state-tree';
import * as Deferred from 'dojo/Deferred';
import * as declare from 'dojo/_base/declare';

/** A MobX state tree node with properties required for wrapping it
  * in a hierarchical Dojo store. */

export interface MstoreNode extends IStateTreeNode {
	children?: MstoreNode[];
	id: string | number;
}

/** Add totalLength property (required by Dojo)
  * to a MobX state tree node instance. */

function wrapArray(data: any, totalLength = data.length) {
	data.totalLength = totalLength;
	return(data);

	// Modifying data can be avoided by creating another tree node instance
	// inheriting the old one.
	/*
	const Result: { new(): dstore.FetchArray<MstoreNode> } = function() {} as any;

	Result.prototype = data;

	const result = new Result();
	result.totalLength = totalLength;

	return(result);
	*/
}

const MstoreClass = declare([ Store, Promised, SimpleQuery ], {

	/** Wrap a MobX state tree node that allows children and track changes
	  * to inform Dojo and MobX about changes made by the other.
	  * Dojo considers this a store (an elaborate array) of a tree node's
	  * immediate children.
	  * @param branchRoot Node to track: a MobX state sub-tree root.
	  * @param storeIndex Map Dojo IDs of wrapped nodes to instances of this class.
	  * @param treeRoot Root node of the entire tree seen by Dojo. */

	constructor: function(
		branchRoot: MstoreNode,
		storeIndex?: { [id: string]: any },
		treeRoot = branchRoot
	) {
		this.branchRoot = branchRoot;
		this.treeRoot = treeRoot;

		if(storeIndex) this.storeIndex = storeIndex;

		this.storeIndex[this.getIdentity(branchRoot)] = this;
	},

	/** Called by Dojo to get all child nodes. */

	fetchSync: function() {
		const list = (this.branchRoot.children || []) as IObservableArray<any>;
		return(wrapArray(list));
	},

	/** Called by Dojo to get a range of child nodes. */

	fetchRangeSync: function({ start, end }: { start: number, end: number }) {
		const list = (this.branchRoot.children || []) as IObservableArray<any>;
		return(wrapArray(list.slice(start, end), list.length));
	},

	// Unimplemented API calls:
	// setData: function() {},
	// addSync: function() {},

	/** Called by Dojo to request this store to save a changed or moved item.
	  *
	  * Modify the MobX state tree and emit a dojo event to inform dijits
	  * about changes made (also to the previous store containing the item,
	  * if it differs from this one).
	  *
	  * Dojo events can only be sent about immediate children, so they may
	  * need to be emitted through other stores.
	  *
	  * @param item MobX state tree node with changes requested by Dojo.
	  * @param options Item metadata, mainly its position among siblings. */

	putSync: function(item: MstoreNode, options?: any) {
		/** State tree parent node of the item before the changes. */
		const parentBefore = getParent(item, 2);
		/** State tree parent node of the item after the changes. */
		let parentAfter = parentBefore;
		/** ID of the following sibling reported by Dojo if the item was moved
		  * (will get emitted back to Dojo). */
		let beforeId: string | null | undefined | { id: string, DnD: any } = options && options.beforeId;

		// Check if the item was moved.
		if(beforeId !== void 0) {
			let dstPath: string;
			let DnD: any;

			if(typeof(beforeId) != 'string') {
				// Get ID of dropped item and drag & drop handler,
				// if both were monkey-patched into the ID field.

				DnD = beforeId && beforeId.DnD;
				beforeId = beforeId && beforeId.id;
			}

			if(beforeId) {
				let node = this.index[beforeId];

				// Disallow moving an item next to its own descendant.
				while(hasParent(node)) {
					node = getParent(node);
					if(node == item) return;
				}
			}

			// Detach MobX state tree node, before adding it back elsewhere.
			// Must be done before resolving the path where to add it,
			// which may change due to the item disappearing.
			parentBefore.detach(item);

			if(beforeId) {
				// Get the item's new next sibling, parent node and path.
				const destination = this.index[beforeId];
				parentAfter = getParent(destination, 2);
				dstPath = getPath(destination);

				// Dojo must be patched to ignore whether the item was dropped
				// before or after an existing item, or it fails to report the
				// correct location when the item is dropped after the last
				// child of a sub-tree.

				// Handle the flag for items dropped after others here instead.

				if(DnD && !DnD.before) {
					if(destination.children) {
						// If destination can contain children, the inserted item
						// becomes its new first child.

						parentAfter = destination;
						dstPath += '/children/0';

						// The next sibling is the previous first child, if any.
						beforeId = (
							!destination.children.length ? null :
							this.getIdentity(destination.children[0])
						);
					} else {
						// Get the index and state tree path of the next sibling.
						let next = 0;

						dstPath = dstPath.replace(/[0-9]+$/, (index: string) => {
							next = +index + 1;
							return('' + next);
						});

						if(next < parentAfter.children.length) {
							// Get the next sibling's ID for reporting to Dojo.
							beforeId = this.getIdentity(parentAfter.children[next]);
						} else {
							// Dojo uses ID null in events to indicate insertion
							// after the last child.
							beforeId = null;
						}
					}
				}
			} else {
				// The item was dropped in the empty space after other tree
				// items. Append it to the root node's children.
				parentAfter = this.treeRoot;
				dstPath = getPath(parentAfter) + '/children/' + parentAfter.children.length;
			}

			// Save changes to the item's position in the MobX state tree.

			applyPatch(this.branchRoot, {
				op: 'add',
				path: dstPath,
				value: item
			});
		}

		let action = 'update';

		if(parentAfter != parentBefore) {
			// If the item was moved from another store (state subtree),
			// any Dojo dijits observing it must be informed.
			// Look up the store wrapping the previous parent node,
			// and emit a delete event from it.

			this.storeIndex[
				this.getIdentity(parentBefore)
			].emit(
				'delete', {
					id: this.getIdentity(item),
					target: item
				}
			);

			// Inform the new store about an item added, not updated.
			action = 'add';
		}

		// Inform Dojo dijits observing the item's new parent store about
		// changes made, by emitting an event from it.
		// Note that the store this putSync method was called on, may be the
		// root of the entire tree regardless of the item's position.

		this.storeIndex[
			this.getIdentity(parentAfter)
		].emit(
			action, {
				beforeId,
				target: item
			}
		);
	},

	/** Called by Dojo to get an item by its ID.
	  * We look it up from a cache of all IDs passed to Dojo earlier.
	  * It must be cached, or Dojo would not have the ID. */

	getSync: function(id: string) {
		return(this.index[id]);
	},

	removeSync: function(id: string) {
		const item = this.index[id];

		let parent = getParent(item) as IObservableArray<MstoreNode>;
		let pos = parent.indexOf(item);

		parent.splice(pos, 1);

		this.storeIndex[
			this.getIdentity(getParent(parent))
		].emit('delete', { id });

		return(true);
	},

	/** Get an ID string for an MST node.
	  * @param item Node or snapshot.
	  * Item can also be wrapped inside an object with an item field.
	  * Then an id field will be added, and the same object is returned.
	  * @param parts Optional JSON path to item, split into separate strings.
	  * Mandatory if item is a snapshot, forbidden if item is wrapped. */

	getIdentity: function(item: MstoreNode | { item: MstoreNode, id?: string }, parts?: string[]): any {
		let wrapper: { item: MstoreNode, id?: string } | undefined;

		if(isStateTreeNode(item)) {
			if(!isAlive(item)) {
				if(!parts) parts = getPathParts(item);
				item = getSnapshot(item);
			}
		} else if(!parts) {
			wrapper = item;
			item = wrapper.item;
		}

		if(!item) return(null);

		let id: string | number | null | undefined = item.id;

		if(!id && id !== 0) {
			if(!parts) parts = getPathParts(item);
			let node = this.treeRoot;

			for(let depth = 0; depth < parts.length; ++depth) {
				node = (node as any as { [key: string]: MstoreNode })[parts[depth]];

				if(!node) {
					node = item as MstoreNode;
				} else if(!isAlive(node)) {
					node = getSnapshot(node);
				}

				id = node.id;
				if(id || id === 0) parts[depth] = '' + id;
			}

			id = joinJsonPath(parts);
		} else {
			id = '' + id;
		}

		this.index[id] = item as MstoreNode;

		if(wrapper) {
			wrapper.id = id;
			return(wrapper);
		}

		return(id)
	},

	getRootCollection: function() {
		return(this);
	},

	/** Called by Dojo to check if a child node can have grandchildren. */

	mayHaveChildren: function(item: MstoreNode) {
		return(!!item.children);
	},

	/** Called by Dojo to get a child node wrapped in Mstore,
	  * for accessing the grandchildren inside. */

	getChildren: function(item: MstoreNode) {
		return(new Mstore(item, this.storeIndex, this.treeRoot));
	},

	/** Node to track: a MobX state sub-tree root. */
	branchRoot: null as any as MstoreNode,

	/** Root node of the entire tree seen by Dojo. */
	treeRoot: null as any as MstoreNode,

	/** Map Dojo IDs to MobX tree nodes. */
	index: {} as { [id: string]: MstoreNode },

	/** Map Dojo IDs of wrapped nodes to instances of this class. */
	storeIndex: {} as { [id: string]: any }

}).createSubclass([ Trackable ]);

export const Mstore = MstoreClass;
