<script lang="ts">
	import { canvasContext } from "$lib/actions/canvasContext"

	const TAU = Math.PI * 2

	export let density = 1

	let w: number
	let h: number
	let path: number[] = []
	let finger: [number, number] | undefined = undefined

	$: width = Math.ceil(w) * density
	$: height = Math.ceil(h) * density
	$: quarterWidth = width / 4.5
	$: halfWidth = width / 2
	$: eigthHeight = height / 8
	$: quarterHeight = height / 4
	$: nodeSize = 0.075 * width

	$: nodes = [
		[quarterWidth, quarterHeight],
		[quarterWidth, quarterHeight * 2],
		[quarterWidth, quarterHeight * 3],
		[halfWidth, eigthHeight],
		[halfWidth, eigthHeight * 3],
		[halfWidth, eigthHeight * 5],
		[halfWidth, eigthHeight * 7],
		[width - quarterWidth, quarterHeight],
		[width - quarterWidth, quarterHeight * 2],
		[width - quarterWidth, quarterHeight * 3],
	] as [number, number][]

	let rafId: number
	function draw(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, width, height)

		ctx.fillStyle = "black"
		ctx.strokeStyle = "black"
		ctx.lineWidth = 1
		drawNodes("small")
		drawNodes("big")
		ctx.strokeStyle = "red"
		ctx.fillStyle = "red"
		ctx.lineWidth = width * 0.01
		drawPath()

		rafId = requestAnimationFrame(() => draw(ctx))

		function drawNodes(size: "small" | "big") {
			ctx.beginPath()
			const radius = size == "small" ? width * 0.01 : nodeSize
			for (const [x, y] of nodes) {
				ctx.moveTo(x + radius, y)
				ctx.arc(x, y, radius, 0, TAU)
			}
			size == "small" ? ctx.fill() : ctx.stroke()
		}

		function drawPath() {
			ctx.beginPath()
			if (path.length == 0) return
			const [start, ...rest] = path
			ctx.moveTo(...nodes[start])
			for (const i of rest) {
				const [x, y] = nodes[i]
				ctx.lineTo(x, y)
			}
			if (finger) ctx.lineTo(...finger)
			ctx.stroke()

			ctx.beginPath()
			ctx.moveTo(...nodes[start])
			ctx.arc(...nodes[start], ctx.lineWidth, 0, TAU)
			for (const i of rest) {
				ctx.moveTo(...nodes[i])
				ctx.arc(...nodes[i], ctx.lineWidth, 0, TAU)
			}
			if (finger) {
				ctx.moveTo(...finger)
				ctx.arc(...finger, ctx.lineWidth, 0, TAU)
			}
			ctx.fill()
		}
	}

	function cleanup() {
		cancelAnimationFrame(rafId)
	}

	function pointerDown(e: PointerEvent) {
		path = []
		finger = [e.offsetX * density, e.offsetY * density]
	}
	function pointerUp(e: PointerEvent) {
		finger = undefined
	}
	function pointerMove(e: PointerEvent) {
		finger ??= [0, 0]
		finger[0] = e.offsetX * density
		finger[1] = e.offsetY * density
		for (let i = 0; i < nodes.length; i++) {
			if (path.includes(i)) continue
			const [x, y] = nodes[i]
			if (Math.hypot(x - finger[0], y - finger[1]) < nodeSize) {
				path.push(i)
				break
			}
		}
	}
</script>

<canvas
	id="focus"
	bind:clientWidth={w}
	bind:clientHeight={h}
	{width}
	{height}
	style:width={w + "px"}
	style:height={h + "px"}
	use:canvasContext={{ contextId: "2d", callback: draw, onDestroy: cleanup }}
	on:pointerdown={pointerDown}
	on:pointermove={pointerMove}
	on:pointerup={pointerUp}
/>

<style>
	#focus {
		aspect-ratio: 1;
		border-top: 1px solid black;
	}
</style>
