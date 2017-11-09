// This file is part of cgeo-wkb, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class CurvePolygon extends cgeo.CurvePolygon {

	measureWKB(state: State) {
		return(cgeo.MultiCurve.prototype.measureWKB.call(this, state));
	}

	writeWKB(state: State) {
		return(cgeo.MultiCurve.prototype.writeWKB.call(this, state));
	}

	readWKB(state: State) {
		return(cgeo.MultiCurve.prototype.readWKB.call(this, state));
	}

}
