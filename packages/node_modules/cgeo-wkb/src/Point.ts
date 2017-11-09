// This file is part of cgeo-wkb, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class Point extends cgeo.Point {

	measureWKB(state: State) {
		let size = 21;

		if(state.hasZ) size += 8;
		if(state.hasM) size += 8;

		return(size);
	}

	writeWKB(state: State) {
		const writer = state.writer;

		if(state.flipXY) {
			writer.f64(this.y);
			writer.f64(this.x);
		} else {
			writer.f64(this.x);
			writer.f64(this.y);
		}

		if(state.hasZ) writer.f64(this.z || 0);
		if(state.hasM) writer.f64(this.m || 0);
	}

	readWKB(state: State) {
		const reader = state.reader;

		if(state.flipXY) {
			this.y = reader.f64();
			this.x = reader.f64();
		} else {
			this.x = reader.f64();
			this.y = reader.f64();
		}

		if(state.hasZ) this.z = reader.f64();
		if(state.hasM) this.m = reader.f64();
	}

}
