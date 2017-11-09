// This file is part of cgeo-wkb, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Reader } from 'cbin';

import { Geometry as GeometryWKB, OptionsWKB } from './Geometry';
import './Geometry';
import './Point';
import './LineString';
import './Polygon';
import './GeometryCollection';
import './CircularString';
import './CompoundCurve';
import './CurvePolygon';

export { Endian } from 'cbin';

declare module 'cgeo/dist/Geometry' {

	interface Geometry extends GeometryWKB {}

	namespace Geometry {
		export function fromWKB(data: Uint8Array, options?: OptionsWKB): Geometry;
	}

}
