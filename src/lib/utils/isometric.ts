import { Point } from "pixi.js"

export function vec3ToPixi({ x, y, z }: Vec3, pixiPos?: Point) {
	return xyzToPixi(x, y, z, pixiPos)
}

export function vec3ToZIndex({ x, y, z }: Vec3): number {
	return xyzToZIndex(x, y, z)
}

export function xyzToPixi(x: number, y: number, z: number, pixiPos?: Point) {
	if (!pixiPos) pixiPos = new Point()
	return pixiPos.set((x - y) * 16, (x + y) * 8 - z * 16)
}

export function xyzToZIndex(x: number, y: number, z: number): number {
	return z * 100_000 + x + y
}
