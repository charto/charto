// This file is part of cgeo, copyright (c) 2017 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

export { Geometry, GeometryKind } from './Geometry';
export { Point, PointSpec, PointListSpec } from './Point';
export { LineString } from './LineString';
export { Polygon } from './Polygon';
export { MultiPoint } from './MultiPoint';
export { MultiLineString } from './MultiLineString';
export { MultiPolygon } from './MultiPolygon';
export { GeometryCollection } from './GeometryCollection';
export { CircularString } from './CircularString';
export { CompoundCurve } from './CompoundCurve';
export { CurvePolygon } from './CurvePolygon';
export { MultiCurve } from './MultiCurve';
export { MultiSurface } from './MultiSurface';
export { Curve, CurveSpec } from './Curve';
export { Surface } from './Surface';

export type Constructor<Type> = new(...args: any[]) => Type;

/** Decorator for mixing class prototype into superclass. */

export function mixin<Super>(Super?: Constructor<Super>) {
	function inner<Class>(Class: Constructor<Class>) {
		Super = Super || Object.getPrototypeOf(Class) as Constructor<Super>;

		// Mix in prototype members.
		for(let key of Object.keys(Class.prototype)) {
			Super.prototype[key] = Class.prototype[key];
		}

		// Mix in static members.
		for(let key of Object.keys(Class)) {
			(Super as { [ key: string ]: any })[key] = (Class as { [ key: string ]: any })[key];
		}
	}

	return(inner);
}

/** Transform superclass in extends class to allow safely calling super(). */

export function mix<Super>(Super: Constructor<Super>) {
	return(Object.getPrototypeOf(Super) as Constructor<Super>);
}

/** Decorator for defining a prototype property. */

export function proto(value: any) {
	function inner(Class: { [ key: string ]: any }, key: string) {
		Class[key] = value;
	}

	return(inner);
}
