// This file is part of cgeo-cpak, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { decodeSign, encodeSign } from 'cpak';
import { State } from './Geometry';

@cgeo.mixin()
export class Point extends cgeo.Point {

	writeCpak(state: State) {
		// Convert to integer first, to ensure delta is encoded reversibly.
		const x = ~~(this.x * state.inverse);
		const y = ~~(this.y * state.inverse);

		state.writer.large(encodeSign(x - state.x));
		state.writer.large(encodeSign(y - state.y));

		state.x = x;
		state.y = y;
	}

	readCpak(state: State) {
		// Maintain unscaled integer coordinates in state to avoid rounding errors.
		state.x += decodeSign(state.reader.large());
		state.y += decodeSign(state.reader.large());

		this.x = state.x * state.precision;
		this.y = state.y * state.precision;
	}

}
