import { dev } from "$app/environment"
import { createGrid } from "$lib/game/dev"
import {
	Application,
	Assets,
	BitmapText,
	Container,
	Sprite,
	Spritesheet,
	type ApplicationOptions,
} from "pixi.js"
import { createCamera } from "$lib/game/camera"
import { make_randi, seeded } from "@terrygonguet/utils/random"

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
		...options,
	})
	container.appendChild(app.canvas)

	const { screen, stage, ticker } = app
	stage.position.set(screen.width / 2, screen.height / 2)

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
			],
		},
	})
	await Assets.loadBundle(["terrain"])

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

	const sheet = Assets.get<Spritesheet>("terrain.sheet")
	sheet.textureSource.scaleMode = "nearest"

	const terrain = new Container()
	stage.addChild(terrain)

	const randi = make_randi(dev ? seeded(51618698) : Math.random)
	const textures = ["grass_carpet", "grass_slab", "grass_block"]
	for (let x = -25; x < 25; x++) {
		for (let y = -25; y < 25; y++) {
			const grassBlock = new Sprite(sheet.textures[textures[randi(3)]])
			grassBlock.position.set((x + y) * 16, (x - y) * 8)
			grassBlock.anchor.set(0, 0.75)
			grassBlock.zIndex = x - y
			stage.addChild(grassBlock)
		}
	}
}
