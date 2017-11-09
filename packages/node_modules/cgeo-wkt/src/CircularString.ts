// This file is part of cgeo-wkt, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class CircularString extends cgeo.CircularString {

	// TODO: Ensure number of points is divisible by 2 when exporting.
	writeWKT(state: State) {
		return(cgeo.LineString.prototype.writeWKT.call(this, state));
	}

}
