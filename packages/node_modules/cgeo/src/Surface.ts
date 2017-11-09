// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry, GeometryKind } from './Geometry';

export abstract class Surface extends Geometry {}

Surface.prototype.kind = GeometryKind.surface;
