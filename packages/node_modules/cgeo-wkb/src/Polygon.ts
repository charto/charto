// This file is part of cgeo-wkb, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class Polygon extends cgeo.Polygon {

	measureWKB(state: State) {
		let size = 9;

		for(let child of this.childList) {
			if(child) size += child.measureWKB(state) - 5;
		}

		return(size);
	}

	writeWKB(state: State) {
		let count = 0;

		for(let child of this.childList) {
			if(child) ++count;
		}

		state.writer.u32(count);

		for(let child of this.childList) {
			if(child) child.writeWKB(state);
		}
	}

	readWKB(state: State) {
		const count = state.reader.u32();

		for(let num = 0; num < count; ++num) {
			const child = new cgeo.LineString();
			child.readWKB(state);
			this.addChild(child);
		}
	}

}
