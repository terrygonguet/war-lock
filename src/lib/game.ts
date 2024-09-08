import { Application, Assets, Sprite } from "pixi.js"

export function runGame(container: HTMLElement) {
	const app = new Application()

	init(app, container)

	return () => {
		app.destroy({ removeView: true })
	}
}

async function init(app: Application, container: HTMLElement) {
	await app.init({
		autoDensity: true,
		resizeTo: container,
		resolution: 2,
		clearBeforeRender: true,
		hello: true,
	})
	container.appendChild(app.canvas)

	const texture = await Assets.load("https://pixijs.com/assets/bunny.png")
	const bunny = new Sprite(texture)

	app.stage.addChild(bunny)

	bunny.anchor.set(0.5)

	bunny.x = app.screen.width / 2
	bunny.y = app.screen.height / 2

	app.ticker.add((time) => {
		bunny.rotation += 0.1 * time.deltaTime
	})
}
