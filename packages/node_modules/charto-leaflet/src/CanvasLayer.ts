import * as L from 'leaflet';

import { BBox, Layer, LayerFeatures, LayerFeaturesPromise } from 'charto-model';
import { CanvasRenderer } from 'charto-render';

export interface PointZ extends L.Point {
	z: number;
}

export class CanvasLayer extends L.GridLayer {

	constructor(public layer: Layer, public renderer: CanvasRenderer) {
		super();
	}

	createTile(xyz: PointZ, cb: (err: any, canvas: HTMLCanvasElement) => void) {
		const canvas = L.DomUtil.create('canvas', 'leaflet-tile leaflet-tile-loaded') as HTMLCanvasElement;
		const size = this.getTileSize();
		const pixelRatio = window.devicePixelRatio;

		canvas.width = size.x * pixelRatio;
		canvas.height = size.y * pixelRatio;
		canvas.style.width = size.x + 'px';
		canvas.style.height = size.y + 'px';

		const map: L.Map = (this as any)._map;
		const margin = 8;

		const x = xyz.x * size.x;
		const y = xyz.y * size.y;
		const zoom = xyz.z;

		const sw = map.unproject(new L.Point(x, y + size.y), zoom);
		const ne = map.unproject(new L.Point(x + size.x, y), zoom);
		const swBuffer = map.unproject(new L.Point(x - margin, y + size.y + margin), zoom);
		const neBuffer = map.unproject(new L.Point(x + size.x + margin, y - margin), zoom);

		new Promise((resolve: (layerFeatures: LayerFeaturesPromise) => void) => {
			// Get bounding box in world coordinates for the tile,
			// surrounded by a margin measured in pixels to handle symbols
			// overlapping this tile but centered within neighbor tile edges.
			const bbox = new BBox(swBuffer.lat, swBuffer.lng, neBuffer.lat, neBuffer.lng);

			// Fetch features inside the bounding box from the model layer.
			resolve(this.layer.getLayerFeatures(bbox, ne.lat - sw.lat, ne.lng - sw.lng, size.x, size.y))
		}).then((features: LayerFeatures) => {
			// Get tile bounding box in world coordinates.
			const bbox = new BBox(sw.lat, sw.lng, ne.lat, ne.lng);

			return(this.renderer.render({
				canvas,
				features,
				bbox,
				pixelWidth: size.x * pixelRatio,
				pixelHeight: size.y * pixelRatio,
				pixelRatio,
				zoom
			}));
		}).catch(
			// Ignore errors in tile rendering for now.
			// TODO: Maybe draw a warning watermark?
			() => {}
		).then(() =>
			cb(null, canvas)
		);

		return(canvas);
	}

}
