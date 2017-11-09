// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

export function registerType(Type: { new(): Geometry }, kind: GeometryKind) {
	Type.prototype.kind = kind;
	Geometry.typeList[kind] = Type;
}

export enum GeometryKind {
	geometry = 0,
	point = 1,
	lineString = 2,
	polygon = 3,
	multiPoint = 4,
	multiLineString = 5,
	multiPolygon = 6,
	geometryCollection = 7,
	circularString = 8,
	compoundCurve = 9,
	curvePolygon = 10,
	multiCurve = 11,
	multiSurface = 12,
	curve = 13,
	surface = 14
}

export abstract class Geometry {

	hasZ() { return(false); }
	hasM() { return(false); }

	kind: GeometryKind;
	static typeList: ({ new(): Geometry } | null)[] = [];

}

Geometry.prototype.kind = GeometryKind.geometry;
