import type { Controls } from "$lib/game/controls"
import { clamp } from "@terrygonguet/utils"
import "pixi.js/math-extras"
import { Container, Rectangle, Ticker } from "pixi.js"

export interface CreateCameraOptions {
	stage: Container
	screen: Rectangle
	follow: Container
	controls: Controls
	min?: number
	max?: number
	delta?: number
}

export interface Camera {
	zoomIn(): void
	zoomOut(): void
	graphicsUpdate(ticker: Ticker): void
}

export function createCamera({
	stage,
	screen,
	follow,
	controls,
	min = 0.6,
	max = 4,
	delta = 0.2,
}: CreateCameraOptions): Camera {
	const container = new Container()
	container.renderable = false

	controls.on("zoom", (deltaY) => (deltaY > 0 ? zoomOut() : zoomIn()))

	let scale = 1
	function zoomIn() {
		scale = clamp(scale * (1 + delta), min, max)
	}
	function zoomOut() {
		scale = clamp(scale * (1 - delta), min, max)
	}

	return {
		zoomIn,
		zoomOut,
		graphicsUpdate() {
			container.scale = scale
			container.position.copyFrom(follow.position)
			stage.updateTransform({
				scaleX: scale,
				scaleY: scale,
				x: screen.width / 2 - follow.x * scale,
				y: screen.height / 2 - follow.y * scale,
			})
		},
	}
}
