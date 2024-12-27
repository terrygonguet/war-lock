interface MapData {
	dimensions: { x: number; y: number; z: number }
	origin: { x: number; y: number; z: number }
	tiles: number[]
	spritesheets: Record<string, import("pixi.js").SpritesheetData & { name: string }>
}

interface Vec3 {
	x: number
	y: number
	z: number
}
