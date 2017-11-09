// This file is part of cgeo-cpak, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { State, Geometry } from './Geometry';

@cgeo.mixin()
export class GeometryCollection<Member extends cgeo.Geometry = cgeo.Geometry> extends cgeo.GeometryCollection {

	writeCpak(state: State) {
		let count = 0;

		for(let child of this.childList) {
			if(child) ++count;
		}

		state.writer.small(count);

		for(let child of this.childList) {
			if(child) child.writeFullCpak(state);
		}
	}

	readCpak(state: State) {
		const count = state.reader.small();

		for(let num = 0; num < count; ++num) {
			this.addChild(Geometry.readCpak(state) as Member);
		}
	}

}
