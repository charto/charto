import * as cgeo from 'cgeo';
import 'cgeo-wkt';
import '..';
import { Endian } from '..';

const pts2: cgeo.CurveSpec = [ { x: 12, y: 34 }, { x: 56, y: 78 } ];

const point = new cgeo.Point( { x: 12, y: 34, z: 0, m: 0 } );
const line = new cgeo.LineString(pts2);
const circle = new cgeo.CircularString({ x: [ 56, 90, 12 ], y: [ 78, 90, 34 ] });
const ring1 = [ { x: 12, y: 34 }, { x: 56, y: 78 }, { x: 90, y: 90 }, { x: 12, y: 34 } ];
const ring2 = { x: [ 87, 43, 0, 87 ], y: [65, 21, 0, 65] };
const polygon = new cgeo.Polygon([ ring1, ring2 ]);
const compound = new cgeo.CompoundCurve([ line, circle ]);
const curvePolygon = new cgeo.CurvePolygon([ compound, ring1 ]);

const set = new cgeo.GeometryCollection([ point, line, polygon ] as cgeo.Geometry[]);

set.addChild(new cgeo.MultiPoint(pts2));
set.addChild(new cgeo.MultiLineString([ pts2, { x: [ 87, 43 ], y: [ 65, 21 ] } ]));
set.addChild(new cgeo.MultiPolygon([ polygon ]));
set.addChild(new cgeo.MultiCurve([ line, compound ]));
set.addChild(new cgeo.MultiSurface([ polygon, curvePolygon ]));

function dump(data: Uint8Array) {
	console.log(
		"SELECT ST_AsText(ST_GeomFromWKB('\\x" +
		Buffer.from(data).toString('hex') +
		"'));"
	);
}

const big = set.toWKB({ endian: Endian.big });
const little = set.toWKB({ endian: Endian.little });
const wkt = set.toWKT();

dump(big);
dump(little);

if(cgeo.Geometry.fromWKB(big).toWKT() != wkt || cgeo.Geometry.fromWKB(little).toWKT() != wkt) {
	console.error('WKT output mismatch');
}
