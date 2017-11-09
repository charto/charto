import { Point, LineString } from 'cgeo';

import { QuadTile, QuadPos } from './QuadTile';

export interface LineStringRef {
	line: LineString;
	/** Index of starting point along the line string. */
	first: number;
	/** Index of end point along the line string. */
	last: number;
}

export class GeoTile extends QuadTile {

	addPoint(pt: Point) {
		this.pointList.push(pt);
		++this.pointCount;
	}

	addLine(line: LineString, first = 0, last = line.x.length - 1) {
		this.lineList.push({ line, first, last });
		this.pointCount += last - first + 1;
	}

	split() {
		super.split();

		const swChild = this.childList![QuadPos.SW]!;
		const ns = swChild.n;
		const ew = swChild.e;

		let pos: QuadPos;

		for(let pt of this.pointList) {
			pos = QuadPos.SW;
			if(pt.x >= ns) pos += (QuadPos.NW - QuadPos.SW);
			if(pt.y >= ew) pos += (QuadPos.SE - QuadPos.SW);

			this.childList![pos]!.addPoint(pt);
		}

		if(this.pointCount) {
			this.pointCount = 0;
			this.pointList = [];
			this.lineList = [];
		}
	}

	/** Total number of points and line string waypoints. */
	pointCount = 0;
	pointList: Point[] = [];
	/** Weight of each point, useful for clustering. */
	pointWeightList?: number[];

	lineList: LineStringRef[] = [];

}
