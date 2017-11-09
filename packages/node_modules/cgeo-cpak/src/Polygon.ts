// This file is part of cgeo-cpak, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class Polygon extends cgeo.Polygon {

	writeCpak(state: State) {
		let count = 0;

		for(let child of this.childList) {
			if(child) ++count;
		}

		state.writer.small(count);

		for(let child of this.childList) {
			if(child) child.writeCpak(state);
		}
	}

	readCpak(state: State) {
		const count = state.reader.small();

		for(let num = 0; num < count; ++num) {
			const child = new cgeo.LineString();
			child.readCpak(state);
			this.addChild(child);
		}
	}

}
