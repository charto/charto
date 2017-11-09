// This file is part of cgeo-wkt, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import * as cgeo from 'cgeo';

@cgeo.mixin()
export class MultiSurface extends cgeo.MultiSurface {

	@cgeo.proto(cgeo.GeometryKind.polygon)
	defaultWKT: cgeo.GeometryKind;

}
