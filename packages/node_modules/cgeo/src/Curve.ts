// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { Geometry, GeometryKind } from './Geometry';
import { PointSpec, PointListSpec } from './Point';

export type CurveSpec = Array<PointSpec> | PointListSpec;

export abstract class Curve extends Geometry {}

Curve.prototype.kind = GeometryKind.curve;
