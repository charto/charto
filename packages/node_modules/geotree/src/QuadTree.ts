import { QuadTile, TileClass, QuadPos, QuadPosFlag, QuadList } from './QuadTile';

export class QuadTree<Tile extends QuadTile = QuadTile> {

	constructor(
		public s: number,
		public w: number,
		public n: number,
		public e: number,
		public Tile = QuadTile as TileClass<Tile>
	) {
		this.root = new Tile(s, w, n, e);
	}

	/** @param before Called before entering child tiles, for pre-order traversal.
	  * @param after Called after entering child tiles, for post-order traversal.
	  * @param s Bounding box south edge. Any tiles outside are not reported.
	  * @param w Bounding box west edge.
	  * @param n Bounding box north edge.
	  * @param e Bounding box east edge. */

	iterate(
		before?: ((tile: Tile) => void | boolean | Promise<boolean>) | null,
		after?: ((tile: Tile) => void | boolean | Promise<boolean>) | null,
		s = this.s,
		w = this.w,
		n = this.n,
		e = this.e,
		root = this.root
	) {
		function rec(tile: Tile) {
			let result: { then: (fn: (flag?: void | boolean | null) => any) => Promise<void | boolean | null> } | void | boolean | null = before && before(tile);
			let isPromise = true;

			if(!result || typeof(result) != 'object' || typeof(result.then) != 'function') {
				const flag = result as void | boolean | null;
				result = { then: ((fn: (flag?: void | boolean | null) => any) => fn(flag) as Promise<void | boolean | null>) };
				isPromise = false;
			}

			const ready = result.then((flag?: void | boolean | null): void | boolean | Promise<void | boolean> | null => {
				if(flag === false || tile.s > n || tile.n < s || tile.w > e || tile.e < w) return;

				const childList = tile.childList;
				if(!childList) return(after && after(tile));

				const readyList: any[] = [];

				const centerNS = tile.s + (tile.n - tile.s) / 2;
				const centerEW = tile.w + (tile.e - tile.w) / 2;
				let child: Tile | null;

				if(s < centerNS) {
					child = childList[QuadPos.SW];
					if(w < centerEW && child) readyList.push(rec(child));
					child = childList[QuadPos.SE];
					if(e >= centerEW && child) readyList.push(rec(child));
				}

				if(n >= centerNS) {
					child = childList[QuadPos.NW];
					if(w < centerEW && child) readyList.push(rec(child));
					child = childList[QuadPos.NE];
					if(e >= centerEW && child) readyList.push(rec(child));
				}

				if(isPromise) {
					return(Promise.all(readyList).then(() => after && after(tile) as any));
				} else if(after) after(tile);
			});

			return(ready);
		}

		return(rec(root));
	}

	/** @param tileNS Tile minimum size in north-south direction. Parent tile is reported instead of any smaller children.
	  * @param tileEW Tile minimum size in east-west direction. */

	findTiles(s?: number, w?: number, n?: number, e?: number, tileNS?: number, tileEW?: number) {
		const result: Tile[] = [];

		this.iterate((tile: Tile) => {
			const childNS = (tile.n - tile.s) / 2;
			const childEW = (tile.e - tile.w) / 2;

			// if(!tile.childList) result.push(tile)
			if(!tile.childList || (tileNS && childNS < tileNS) || (tileEW && childEW < tileEW)) {
				result.push(tile);
				return(false);
			}
		}, null, s, w, n, e);

		return(result);
	}

	/** Return up to 4 tiles of roughly similar size overlapping the query box,
	  * at least one overlapping by at least a quarter of the tile's size.
	  * Split tiles as needed. */

	splitBy(s: number, w: number, n: number, e: number) {
		const result: Tile[] = [];

		this.iterate((tile: Tile) => {
			if(tile.childList) return;

			// Calculate tile overlap with query box along both axes.
			const nsCoverage = Math.min(tile.n, n) - Math.max(tile.s, s);
			const ewCoverage = Math.min(tile.e, e) - Math.max(tile.w, w);

			if(nsCoverage > 0 && ewCoverage > 0) {
				const nsTile = tile.n - tile.s;
				const ewTile = tile.e - tile.w;

				if(
					// If the overlap is less than a quarter of the tile...
					nsCoverage * 2 < nsTile &&
					ewCoverage * 2 < ewTile &&
					// ...and the tile is more than a quarter of the query box...
					nsTile * 2 > n - s &&
					ewTile * 2 > e - w
				) {
					// ...then split the tile.
					tile.split();
				} else {
					result.push(tile);
				}
			}
		}, null, s, w, n, e);

		return(result);
	}

	importStructure(spec: number[]) {
		const Tile = this.Tile;
		let pos = 0;
		let tile = this.root;

		function rec(tile: Tile) {
			tile.split(spec[pos++]);

			const branchPosFlags = spec[pos++];
			let posFlag = QuadPosFlag.SW;

			for(let pos = QuadPos.SW; pos < 4; ++pos) {
				if(branchPosFlags & posFlag) rec(tile.childList![pos]!);
				posFlag <<= 1;
			}
		}

		rec(this.root);

		return(this);
	}

	exportStructure() {
		const spec: number[] = [];

		function rec(childList: QuadList<Tile> | undefined) {
			if(!childList) return;

			let childPosFlags = 0b0000;
			let branchPosFlags = 0b0000;
			let posFlag = QuadPosFlag.SW;

			for(let child of childList) {
				if(child) {
					childPosFlags |= posFlag;
					if(child.childList) branchPosFlags |= posFlag;
				}
				posFlag <<= 1;
			}

			spec.push(childPosFlags);
			spec.push(branchPosFlags);

			for(let child of childList) {
				if(child) rec(child.childList);
			}
		}

		rec(this.root.childList);

		return(spec);
	}

	root: Tile;

}
