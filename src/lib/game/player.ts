import type { Controls } from "$lib/game/controls"
import { vec3ToPixi, vec3ToZIndex } from "$lib/utils/isometric"
import { Graphics, Point, Ticker, type Container } from "pixi.js"

export interface PlayerOptions {
	speed: number
	controls: Controls
	gravity?: number
}

export interface Player {
	position: Vec3
	container: Container
	graphicsUpdate(ticker: Ticker): void
	physicsUpdate(ticker: Ticker): void
}

export function createPlayer({ speed, controls, gravity = -0.2 }: PlayerOptions): Player {
	const graphics = new Graphics()
	const position = { x: 0, y: 0, z: 0 }

	graphics.roundRect(-10, -40, 20, 40).fill(0x5555ff).stroke(0)

	let dz = 0

	return {
		position,
		container: graphics,
		graphicsUpdate() {
			vec3ToPixi(position, graphics.position)
			graphics.zIndex = vec3ToZIndex(position)
		},
		physicsUpdate(ticker) {
			const mvmt = controls.movement()

			let dx = mvmt.x - mvmt.y
			let dy = -mvmt.x - mvmt.y
			const delta = Point.shared.set(dx, dy)
			if (dx || dy) delta.normalize(delta)

			const dt = (speed * ticker.deltaMS) / 1000
			delta.multiplyScalar(dt, delta)
			position.x += delta.x
			position.y += delta.y

			dz += gravity * dt
			position.z = Math.max(0, position.z + dz)
			if (position.z == 0) dz = 0
			if (controls.pressed.jump && dz == 0) dz = 0.3
		},
	}
}
