import { clamp } from "@terrygonguet/utils"
import { Container, Rectangle } from "pixi.js"

export interface CreateCameraOptions {
	stage: Container
	screen: Rectangle
	follow: Container
	min?: number
	max?: number
	delta?: number
}

export interface Camera {
	zoomIn(): void
	zoomOut(): void
	container: Container
	update(): void
}

export function createCamera({
	stage,
	screen,
	follow,
	min = 0.6,
	max = 4,
	delta = 0.2,
}: CreateCameraOptions): Camera {
	const container = new Container()
	container.renderable = false

	window.addEventListener("wheel", onWheel)
	container.on("destroyed", () => {
		window.removeEventListener("wheel", onWheel)
	})

	function onWheel(evt: WheelEvent) {
		evt.deltaY > 0 ? zoomOut() : zoomIn()
	}

	let scale = 1
	function zoomIn() {
		scale = clamp(scale * (1 + delta), min, max)
		stage.scale.set(scale)
	}
	function zoomOut() {
		scale = clamp(scale * (1 - delta), min, max)
		stage.scale.set(scale)
	}

	return {
		zoomIn,
		zoomOut,
		container,
		update() {
			container.scale = scale
			container.position.copyFrom(follow.position)
			stage.position.set(screen.width / 2 - follow.x, screen.height / 2 - follow.y)
		},
	}
}
