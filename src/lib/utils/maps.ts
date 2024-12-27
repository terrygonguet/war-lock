import { xyzToPixi, xyzToZIndex } from "$lib/utils/isometric"
import { Assets, Container, Sprite, Spritesheet } from "pixi.js"

export function buildLevel(mapData: MapData): { container: Container; loaded: Promise<void> } {
	const container = new Container()
	const [sheetData] = Object.values(mapData.spritesheets)
	const texture = Assets.get(sheetData.meta.image!)
	const sheet = new Spritesheet(texture, sheetData)
	sheet.textureSource.scaleMode = "nearest"

	const promise = sheet.parse().then(() => {
		for (let i = 0; i < mapData.tiles.length; i++) {
			const tileId = mapData.tiles[i]
			if (tileId <= 0) continue
			const texture = sheet.textures[tileId]
			const sprite = new Sprite(texture)

			const z = Math.floor(i / (mapData.dimensions.x * mapData.dimensions.y)) + mapData.origin.z
			const y = Math.floor(i / mapData.dimensions.x) - z * mapData.dimensions.y + mapData.origin.y
			const x = (i % mapData.dimensions.x) + mapData.origin.x
			xyzToPixi(x, y, z, sprite.position)
			sprite.zIndex = xyzToZIndex(x, y, z)
			sprite.anchor.set(0, 0.75)
			container.addChild(sprite)
		}
	})

	return { container, loaded: promise }
}
