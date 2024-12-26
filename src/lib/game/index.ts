import { dev } from "$app/environment"
import { createGrid } from "$lib/game/dev"
import {
	Application,
	Assets,
	Container,
	Sprite,
	Spritesheet,
	type ApplicationOptions,
	type SpritesheetData,
} from "pixi.js"
import { createCamera } from "$lib/game/camera"
import { MapLoader } from "$lib/game/tmxMapLoader"

export async function init(
	app: Application,
	container: HTMLElement,
	options?: Partial<ApplicationOptions>,
) {
	await app.init({
		autoDensity: true,
		resizeTo: container,
		resolution: (devicePixelRatio ?? 1) * 2,
		clearBeforeRender: true,
		background: 0xf5f5f5,
		antialias: false,
		...options,
	})
	container.appendChild(app.canvas)

	const { screen, stage, ticker } = app
	stage.position.set(screen.width / 2, screen.height / 2)

	Assets.loader.parsers.push(new MapLoader())

	Assets.init({
		manifest: {
			bundles: [
				{
					name: "terrain",
					assets: [
						{
							alias: "terrain.sheet",
							src: "/sprites/terrain.sheet.json",
						},
					],
				},
				{
					name: "maps",
					assets: [
						{
							alias: "test-island",
							src: "/maps/test-island.tmx",
						},
					],
				},
			],
		},
	})
	await Assets.loadBundle(["maps"])

	const dummy = new Container()
	stage.addChild(dummy)

	const camera = createCamera({ stage, screen, follow: dummy })
	stage.addChild(camera.container)
	ticker.add(camera.update)

	if (dev) {
		const grid = createGrid()
		stage.addChild(grid)
		ticker.start()
	}

	const mapData = Assets.get<MapData>("test-island")
	const sheetData = mapData.spritesheets["Terrain"]
	const sheet = await sheetData2SpriteSheet(sheetData)

	const terrain = new Container()
	stage.addChild(terrain)

	for (let i = 0; i < mapData.tiles.length; i++) {
		const z = Math.floor(i / (mapData.dimensions.x * mapData.dimensions.y))
		const y = Math.floor(i / mapData.dimensions.x) - z * mapData.dimensions.y
		const x = i % mapData.dimensions.x
		const tileId = mapData.tiles[i]
		if (tileId <= 0) continue
		const texture = sheet.textures[tileId]
		const sprite = new Sprite(texture)

		sprite.position.set(
			(x + mapData.origin.x - y - mapData.origin.y) * 16,
			(x + mapData.origin.x + y + mapData.origin.y) * 8 - (z + mapData.origin.z) * 16,
		)

		sprite.anchor.set(0, 0.75)
		sprite.zIndex = z * 1000 + x + y
		terrain.addChild(sprite)
	}

	// for (let z = 0; z < mapData.dimensions.z; z++) {
	// 	for (let y = 0; y < mapData.dimensions.y; y++) {
	// 		for (let x = 0; x < mapData.dimensions.x; x++) {
	// 			const idx = z * mapData.dimensions.x * mapData.dimensions.y + y * mapData.dimensions.x + x
	// 			const tileId = mapData.tiles[idx]
	// 			if (tileId <= 0) continue
	// 			const texture = sheet.textures[tileId]
	// 			const sprite = new Sprite(texture)

	// 			sprite.position.set(
	// 				(x + mapData.origin.x - y - mapData.origin.y) * 16,
	// 				(x + mapData.origin.x + y + mapData.origin.y) * 8 - (z + mapData.origin.z) * 16,
	// 			)

	// 			sprite.anchor.set(0, 0.75)
	// 			sprite.zIndex = z * 1000 + x + y
	// 			terrain.addChild(sprite)
	// 		}
	// 	}
	// }
}

async function sheetData2SpriteSheet(data: SpritesheetData): Promise<Spritesheet> {
	const texture = Assets.get(data.meta.image!)
	const sheet = new Spritesheet(texture, data)
	sheet.textureSource.scaleMode = "nearest"
	await sheet.parse()
	return sheet
}
