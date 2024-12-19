import { dev } from "$app/environment"
import { createContainer } from "$lib/game/caster"
import { Application } from "pixi.js"

export function startGame(container: HTMLElement) {
	const app = new Application()

	console.log("Starting game...")
	init(app, container).then(() => console.log("Game started"))

	return () => {
		console.log("Destroying game...")
		app.destroy({ removeView: true })
		console.log("Game destroyed")
	}
}

async function init(app: Application, container: HTMLElement) {
	await app.init({
		autoDensity: true,
		resizeTo: container,
		resolution: (devicePixelRatio ?? 1) * 2,
		clearBeforeRender: true,
		hello: dev,
	})
	container.appendChild(app.canvas)

	const caster = createContainer(app)
	app.stage.addChild(caster)
}
