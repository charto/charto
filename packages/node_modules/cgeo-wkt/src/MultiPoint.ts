// This file is part of cgeo-wkt, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State } from './Geometry';

@cgeo.mixin()
export class MultiPoint extends cgeo.MultiPoint {

	writeWKT(state: State) {
		const content: string[] = [];

		for(let child of this.childList) {
			content.push(child!.writeWKT(state));
		}

		return(content.join(','));
	}

}
