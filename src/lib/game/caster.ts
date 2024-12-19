import { Application, Circle, Container, Graphics, GraphicsContext, Rectangle } from "pixi.js"

type Path = number[]

export class Caster {
	constructor(app: Application) {}
}

export function createContainer(app: Application): Container {
	const container = new Container({
		y: app.screen.height - app.screen.width,
		eventMode: "dynamic",
		hitArea: new Rectangle(0, 0, app.screen.width, app.screen.width),
	})

	const nubs: Graphics[] = []
	const offset = (1 / 5) * app.screen.width
	const step = 0.3 * app.screen.width
	const nubsGraphics = new GraphicsContext()
	nubsGraphics
		.circle(0, 0, step / 20)
		.fill(0xffffff)
		.circle(0, 0, step / 4)
		.stroke(0xffffff)
	for (let i = 0; i < 9; i++) {
		const x = i % 3
		const y = Math.floor(i / 3)
		const graphics = new Graphics({
			context: nubsGraphics,
			eventMode: "dynamic",
			x: offset + x * step,
			y: offset + y * step,
			hitArea: new Circle(0, 0, step / 4),
		})
		nubs.push(graphics)
		container.addChild(graphics)
	}

	const path = new Graphics({ eventMode: "none" })
	container.addChild(path)

	let curPath: Path = []
	for (const [i, nub] of nubs.entries()) {
		nub.on("pointerenter", () => {
			if (!curPath.includes(i)) {
				curPath.push(i)
				nub.tint = 0xff0000
			}
		})
	}
	container.on("pointerup", () => {
		console.log("rune:", curPath)
		curPath = []
		path.clear()
		nubs.forEach((nub) => (nub.tint = 0xffffff))
	})
	container.on("pointermove", (evt) => {
		if (curPath.length == 0) return
		const pos = container.toLocal(evt.global)
		path
			.clear()
			.moveTo(offset + (curPath[0] % 3) * step, offset + Math.floor(curPath[0] / 3) * step)
		for (const i of curPath) {
			const x = i % 3
			const y = Math.floor(i / 3)
			path.lineTo(offset + x * step, offset + y * step)
		}
		path.lineTo(pos.x, pos.y).stroke({ width: 5, color: 0xff0000, cap: "round" })
	})

	return container
}
