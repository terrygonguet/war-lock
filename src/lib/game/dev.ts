import { Graphics } from "pixi.js"

export function createGrid({ stayTopmost = false } = {}): Graphics {
	const graphics = new Graphics()
	graphics.zIndex = stayTopmost ? 99999 : -99999

	const x = Math.cos(Math.PI / 6.8)
	const y = Math.sin(Math.PI / 6.8)
	graphics
		.moveTo(x * 10_000, y * 10_000)
		.lineTo(-x * 10_000, -y * 10_000)
		.moveTo(x * 10_000, -y * 10_000)
		.lineTo(-x * 10_000, y * 10_000)
		.stroke(0x555555)

	for (let i = -100; i < 100; i++) {
		graphics
			.setTransform(1, 0, 0, 1, 32 * i, 0)
			.moveTo(x * 10_000, y * 10_000)
			.lineTo(-x * 10_000, -y * 10_000)
			.moveTo(x * 10_000, -y * 10_000)
			.lineTo(-x * 10_000, y * 10_000)
	}
	graphics.stroke({ color: 0xaaaaaa, pixelLine: true })

	return graphics
}
