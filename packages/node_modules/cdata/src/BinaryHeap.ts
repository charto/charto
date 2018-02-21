// This file is part of cdata, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

export interface HeapConfig<Item> {
	getPos?: (item: Item) => number,
	setPos?: (item: Item, pos: number) => void
}

export class BinaryHeap<Item> {

	/** @param compare Compare two items, as used with Array.sort. */

	constructor(
		private compare: (a: Item, b: Item) => number,
		{ getPos, setPos }: HeapConfig<Item> = {}
	) {
		this.getPos = getPos;
		this.setPos = setPos || ((item: Item, pos: number) => {});
	}

	/** Erase all contents of the heap. */

	clear() {
		this.heap = [];
		this.last = 0;
	}

	isEmpty() { return(!this.last); }

	/** Insert a new item in the heap.
	  * @return Index of the inserted item in the heap's internal array. */

	insert(item: Item) {
		return(this.bubble(item, this.last++));
	}

	/** Update the position of an item in the heap. */

	update(item: Item) {
		const getPos = this.getPos;

		if(!getPos) throw(new Error('Cannot get index of item in the heap'));

		const pos = getPos(item);
		const posParent = (pos - 1) >>> 1;
		const delta = this.compare(this.heap[posParent], item);

		if(delta > 0) this.bubble(item, pos);
		else if(delta < 0) this.sink(item, pos);

		return(item);
	};

	/** Get the top item of the heap without removing it. */

	peekTop() {
		return(!this.last ? null : this.heap[0]);
	}

	/** Remove and return the top item of the heap. */

	extractTop() {
		if(!this.last) return(null);

		const top = this.heap[0];

		this.sink(this.heap[--this.last], 0);

		return(top);
	}

	/** Move an item upwards in the heap, to its correct position.
	  * @param item Item to move.
	  * @param pos Index of the item in the heap's internal array. */

	bubble(item: Item, pos: number) {
		const heap = this.heap;
		const compare = this.compare;
		const setPos = this.setPos;

		let posParent: number;
		let parent: Item;

		while(pos > 0) {
			posParent = (pos - 1) >>> 1;
			parent = heap[posParent];
			if(compare(parent, item) <= 0) break;

			heap[pos] = parent;
			setPos(parent, pos);
			pos = posParent;
		}

		heap[pos] = item;
		setPos(item, pos);
	}

	/** Move an item downwards in the heap, to its correct position.
	  * @param item Item to move.
	  * @param pos Index of the item in the heap's internal array. */

	sink(item: Item, pos: number) {
		const heap = this.heap;
		const last = this.last;
		const compare = this.compare;
		const setPos = this.setPos;

		let posLeft: number;
		let posRight: number;
		let posNext: number;
		let left: Item;
		let right: Item;

		while(1) {
			posLeft = pos * 2 + 1;
			posRight = pos * 2 + 2;

			if(posRight < last) {
				left = heap[posLeft];
				right = heap[posRight];

				if(compare(left, right) < 0) {
					if(compare(left, item) < 0) posNext = posLeft;
					else break;
				} else {
					if(compare(right, item) < 0) posNext = posRight;
					else break;
				}
			} else {
				if(posLeft < last && compare(heap[posLeft], item) < 0) posNext = posLeft;
				else break;
			}

			heap[pos] = heap[posNext];
			setPos(heap[pos], pos);
			pos = posNext;
		}

		heap[pos] = item;
		setPos(item, pos);
	}

	private getPos?: (item: Item) => number;
	private setPos: (item: Item, pos: number) => void;

	heap: Item[] = [];
	last = 0;
};
