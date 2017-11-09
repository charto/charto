// This file is part of cgeo-wkt, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class Point extends cgeo.Point {

	writeWKT(state: State) {
		let pt: string;

		if(state.flipXY) {
			pt = this.y + ' ' + this.x;
		} else {
			pt = this.x + ' ' + this.y;
		}

		if(state.hasZ) pt += ' ' + (this.z || 0);
		if(state.hasM) pt += ' ' + (this.m || 0);

		return(pt);
	}

}
