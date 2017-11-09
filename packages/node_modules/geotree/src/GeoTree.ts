import { QuadTree } from './QuadTree';
import { TileClass } from './QuadTile';
import { GeoTile } from './GeoTile';

export class GeoTree<Tile extends GeoTile = GeoTile> extends QuadTree<Tile> {

	constructor(
		s: number,
		w: number,
		n: number,
		e: number,
		Tile = GeoTile as TileClass<Tile>
	) {
		super(s, w, n, e, Tile);
	}

}
