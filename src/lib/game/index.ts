import { dev } from "$app/environment"
import { createGrid } from "$lib/game/dev"
import { Application, Assets, Point, Sprite, Spritesheet } from "pixi.js"
import { bundles, manifest } from "$assets/manifest"
import { createCamera } from "$lib/game/camera"

export function startGame(container: HTMLElement) {
	const app = new Application()

	console.log("Starting game...")
	init(app, container).then(() => console.log("Game started"))

	return () => {
		console.log("Destroying game...")
		app.destroy({ removeView: true }, { children: true })
		Assets.reset()
		console.log("Game destroyed")
	}
}

async function init(app: Application, container: HTMLElement) {
	await app.init({
		autoDensity: true,
		resizeTo: container,
		resolution: (devicePixelRatio ?? 1) * 2,
		clearBeforeRender: true,
		background: 0xf5f5f5,
		hello: dev,
	})
	container.appendChild(app.canvas)

	const { screen, stage } = app
	stage.position.set(screen.width / 2, screen.height / 2)

	Assets.init({ manifest })
	await Assets.loadBundle([bundles.terrain])

	const dummy = new Point()
	const camera = createCamera({ stage, screen, follow: dummy })
	stage.addChild(camera.container)

	app.ticker.add(() => {
		camera.update()
	})

	if (dev) {
		const grid = createGrid()
		stage.addChild(grid)
	}

	const sheet = Assets.get<Spritesheet>("terrain.sheet")
	sheet.textureSource.scaleMode = "nearest"

	for (let x = -5; x < 5; x++) {
		for (let y = -5; y < 5; y++) {
			const grassBlock = new Sprite(sheet.textures["grass_carpet"])
			grassBlock.position.set((x + y) * 16, (x - y) * 8)
			grassBlock.anchor.set(0, 0.75)
			grassBlock.zIndex = x - y
			stage.addChild(grassBlock)
		}
	}
}
