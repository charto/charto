// This file is part of cgeo-cpak, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class CircularString extends cgeo.CircularString {

	writeCpak(state: State) {
		return(cgeo.LineString.prototype.writeCpak.call(this, state));
	}

	readCpak(state: State) {
		return(cgeo.LineString.prototype.readCpak.call(this, state));
	}

}
