/** Index of each sub-quad in the QuadTile childList. */
export const enum QuadPos { SW = 0, SE, NW, NE }

/** Flag for each sub-quad to use in sub-quad existence bit masks. */
export const enum QuadPosFlag {
	SW = 1 << QuadPos.SW,
	SE = 1 << QuadPos.SE,
	NW = 1 << QuadPos.NW,
	NE = 1 << QuadPos.NE
}

/** List of quadtree child nodes, indexed using QuadPos. */
export type QuadList<Tile extends QuadTile = QuadTile> = [
	Tile | null,
	Tile | null,
	Tile | null,
	Tile | null
];

export interface TileClass<Tile extends QuadTile = QuadTile> {
	new(s: number, w: number, n: number, e: number, path?: string): Tile
}

export class QuadTile {

	constructor(
		public s: number,
		public w: number,
		public n: number,
		public e: number,
		public path = ''
	) {}

	split(childPosFlags = 0b1111) {
		const s = this.s;
		const w = this.w;
		const n = this.n;
		const e = this.e;
		const ns = s + (n - s) / 2;
		const ew = w + (e - w) / 2;

		this.childList = [
			childPosFlags & QuadPosFlag.SW ? this.makeChild(s, w, ns, ew, QuadPos.SW) : null,
			childPosFlags & QuadPosFlag.SE ? this.makeChild(s, ew, ns, e, QuadPos.SE) : null,
			childPosFlags & QuadPosFlag.NW ? this.makeChild(ns, w, n, ew, QuadPos.NW) : null,
			childPosFlags & QuadPosFlag.NE ? this.makeChild(ns, ew, n, e, QuadPos.NE) : null
		];
	}

	makeChild(
		s: number,
		w: number,
		n: number,
		e: number,
		pos: QuadPos
	) {
		const Tile: TileClass<this> = this.constructor as any;
		return(new Tile(s, w, n, e, this.path + pos));
	}

	childList: QuadList<this> | undefined;

}
