// This file is part of cgeo-cpak, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { Reader, Writer } from 'cpak';

export interface OptionsCpak {
	precision?: number;
	/** Reciprocal of precision (1 / precision). */
	inverse?: number;
}

export class State implements OptionsCpak {

	constructor(options: OptionsCpak = {}, geom?: Geometry & cgeo.Geometry) {
		this.precision = options.precision || 1;
		this.inverse = options.inverse || 1 / this.precision;
	}

	precision: number;
	/** Reciprocal of precision (1 / precision). */
	inverse: number;

	x = 0;
	y = 0;
	z = 0;
	m = 0;

	reader: Reader;
	writer: Writer;

}

export type This = Geometry & cgeo.Geometry;

@cgeo.mixin(cgeo.Geometry as any as { new(): cgeo.Geometry })
export class Geometry {

	readCpak(this: This, state: State) {}

	writeCpak(this: This, state: State) {}

	writeFullCpak(this: This, state: State) {
		state.writer.small(this.kind);

		this.writeCpak(state);
	}

	toCpak(this: This, options?: OptionsCpak) {
		const state = new State(options, this);

		state.writer = new Writer();
		this.writeFullCpak(state);

		return(state.writer.data);
	}

	static readCpak(state: State): cgeo.Geometry {
		const tag = state.reader.small();
		const Type = cgeo.Geometry.typeList[tag];

		if(!Type) throw(new Error('Unknown cpak geometry type ' + tag));

		const geom = new Type();

		geom.readCpak(state);

		return(geom);
	}

	static fromCpak(data: string, options?: OptionsCpak): cgeo.Geometry {
		const state = new State(options);

		state.reader = new Reader(data);

		return(Geometry.readCpak(state));
	}

}
