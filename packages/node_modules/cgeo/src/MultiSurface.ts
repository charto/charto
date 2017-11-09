// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import { GeometryKind, registerType } from './Geometry';
import { GeometryCollection } from './GeometryCollection';
import { Surface } from './Surface';

export class MultiSurface<Member extends Surface = Surface> extends GeometryCollection<Member> {}

registerType(MultiSurface, GeometryKind.multiSurface);
