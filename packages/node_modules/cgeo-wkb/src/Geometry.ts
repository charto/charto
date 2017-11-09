// This file is part of cgeo-wkb, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';
import { Reader, Writer, Endian } from 'cbin';

export interface OptionsWKB {
	endian?: Endian;
	flipXY?: boolean;
}

export class State implements OptionsWKB {

	constructor(options: OptionsWKB = {}, geom?: Geometry & cgeo.Geometry) {
		this.endian = options.endian || Endian.little;
		this.flipXY = options.flipXY || false;

		if(geom) {
			if(geom.hasZ()) { this.hasZ = true; this.kindOffset += 1000; }
			if(geom.hasM()) { this.hasM = true; this.kindOffset += 2000; }
		}
	}

	endian: Endian;
	flipXY: boolean;
	hasZ: boolean;
	hasM: boolean;
	kindOffset = 0;

	reader: Reader;
	writer: Writer;

}

export type This = Geometry & cgeo.Geometry;

@cgeo.mixin(cgeo.Geometry as any as { new(): cgeo.Geometry })
export class Geometry {

	measureWKB(this: This, state: State) { return(0); }

	readWKB(this: This, state: State) {}

	writeWKB(this: This, state: State) {}

	writeFullWKB(this: This, state: State) {
		const writer = state.writer;

		writer.data[writer.pos++] = writer.endian;
		writer.u32(this.kind + state.kindOffset);

		this.writeWKB(state);
	}

	toWKB(this: This, options?: OptionsWKB) {
		const state = new State(options, this);
		const writer = new Writer(new Uint8Array(this.measureWKB(state)));

		writer.endian = state.endian;
		state.writer = writer;

		this.writeFullWKB(state);

		return(writer.data);
	}

	static readWKB(state: State): cgeo.Geometry {
		const reader = state.reader;

		reader.endian = reader.data[reader.pos++];

		const tag = reader.u32();
		const kind = tag % 1000;
		const Type = cgeo.Geometry.typeList[kind];

		if(!Type) throw(new Error('Unknown WKB geometry type ' + tag));

		const geom = new Type();
		const zm = (tag - kind) / 1000;

		state.hasZ = !!(zm & 1);
		state.hasM = !!(zm & 2);

		geom.readWKB(state);

		return(geom);
	}

	static fromWKB(data: Uint8Array, options?: OptionsWKB): cgeo.Geometry {
		const state = new State(options);

		state.reader = new Reader(data);

		return(Geometry.readWKB(state));
	}

}
