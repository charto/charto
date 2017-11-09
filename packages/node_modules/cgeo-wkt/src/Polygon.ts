// This file is part of cgeo-wkt, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class Polygon extends cgeo.Polygon {

	writeWKT(state: State) {
		return(cgeo.MultiLineString.prototype.writeWKT.call(this, state));
	}

	@cgeo.proto(cgeo.GeometryKind.lineString)
	defaultWKT: cgeo.GeometryKind;

}
