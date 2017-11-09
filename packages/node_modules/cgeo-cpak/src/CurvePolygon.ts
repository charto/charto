// This file is part of cgeo-cpak, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class CurvePolygon extends cgeo.CurvePolygon {

	writeCpak(state: State) {
		return(cgeo.MultiCurve.prototype.writeCpak.call(this, state));
	}

	readCpak(state: State) {
		return(cgeo.MultiCurve.prototype.readCpak.call(this, state));
	}

}
