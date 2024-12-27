import { dev } from "$app/environment"
import { createGrid } from "$lib/game/dev"
import { Application, Assets, Ticker, type ApplicationOptions } from "pixi.js"
import { createCamera } from "$lib/game/camera"
import { MapLoader } from "$lib/game/tmxMapLoader"
import { createPlayer } from "$lib/game/player"
import { buildLevel } from "$lib/utils/maps"
import { createKeyboardControls } from "$lib/game/controls"

interface GameInitResult {
	graphicsTicker: Ticker
	physicsTicker: Ticker
	destroy(): void
}

export async function init(
	app: Application,
	container: HTMLElement,
	options?: Partial<ApplicationOptions>,
): Promise<GameInitResult> {
	console.log("Starting game...")
	await app.init({
		autoDensity: true,
		autoStart: false,
		resizeTo: container,
		resolution: (devicePixelRatio ?? 1) * 2,
		clearBeforeRender: true,
		background: 0xf5f5f5,
		antialias: false,
		...options,
	})
	container.appendChild(app.canvas)

	const { screen, stage } = app
	stage.position.set(screen.width / 2, screen.height / 2)

	MapLoader.register(Assets.loader)

	Assets.init({
		manifest: {
			bundles: [
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

	const controls = createKeyboardControls({
		// logKeypresses: dev,
		keymap: {
			KeyW: "up",
			KeyS: "down",
			KeyA: "left",
			KeyD: "right",
			Space: "jump",
		},
	})

	const player = createPlayer({ speed: 10, controls })
	const camera = createCamera({ stage, screen, follow: player.container, controls })

	const graphicsTicker = new Ticker()
	graphicsTicker.start()
	const physicsTicker = new Ticker()
	physicsTicker.maxFPS = 59.3
	physicsTicker.minFPS = 60
	physicsTicker.start()

	graphicsTicker.add(() => {
		player.graphicsUpdate(graphicsTicker)
		camera.graphicsUpdate(graphicsTicker)
	})

	physicsTicker.add(() => {
		player.physicsUpdate(physicsTicker)
	})

	if (dev) {
		const grid = createGrid()
		stage.addChild(grid)
	}

	const mapData = Assets.get<MapData>("test-island")
	const { container: terrain } = buildLevel(mapData)
	terrain.addChild(player.container)
	stage.addChild(terrain)

	console.log("Game started")
	return {
		graphicsTicker,
		physicsTicker,
		destroy() {
			if (!app.stage) return
			console.log("Destroying game...")
			controls.destroy()
			graphicsTicker.destroy()
			physicsTicker.destroy()
			app.destroy(true, true)
			Assets.reset()
			console.log("Game destroyed")
		},
	}
}
