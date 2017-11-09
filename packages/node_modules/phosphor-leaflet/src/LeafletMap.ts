// This file is part of phosphor-leaflet, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import 'leaflet/dist/leaflet.css!';
import * as L from 'leaflet';

import { Widget } from '@phosphor/widgets';

export class LeafletMap extends Widget {

	constructor(mapOptions: L.MapOptions) {
		super({ node: LeafletMap.createNode() });

		this.addClass('charto-LeafletMap');

		this.l = L.map(this.node, mapOptions);
	}

	static createNode(): HTMLElement {
		const node = document.createElement('div');
		return(node);
	}

	onResize(msg: Widget.ResizeMessage) {
		this.l.invalidateSize(false);
	}

	l: L.Map;

}
