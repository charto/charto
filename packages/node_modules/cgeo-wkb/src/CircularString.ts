// This file is part of cgeo-wkb, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class CircularString extends cgeo.CircularString {

	measureWKB(state: State) {
		return(cgeo.LineString.prototype.measureWKB.call(this, state));
	}

	writeWKB(state: State) {
		return(cgeo.LineString.prototype.writeWKB.call(this, state));
	}

	readWKB(state: State) {
		return(cgeo.LineString.prototype.readWKB.call(this, state));
	}

}
