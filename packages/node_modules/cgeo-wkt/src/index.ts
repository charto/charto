// This file is part of cgeo-wkt, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry as GeometryWKT, OptionsWKT } from './Geometry';
import './Geometry';
import './Point';
import './LineString';
import './Polygon';
import './MultiPoint';
import './GeometryCollection';
import './CircularString';
import './CompoundCurve';
import './CurvePolygon';
import './MultiCurve';
import './MultiSurface';

declare module 'cgeo/dist/Geometry' {

	interface Geometry extends GeometryWKT {}

}
