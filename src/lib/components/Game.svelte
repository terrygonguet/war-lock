<script lang="ts">
	import { dev } from "$app/environment"
	import { init } from "$lib/game"
	import { smoothed } from "$lib/utils/reactive.svelte"
	import { noop } from "@terrygonguet/utils"
	import { Application } from "pixi.js"

	interface Props {
		id: string
	}

	let { id }: Props = $props()
	let container = $state<HTMLElement>()
	let fps = smoothed(0)
	let tps = smoothed(0)
	let renderTime = smoothed(0)

	$effect(() => {
		if (!container) return

		const app = new Application()

		let destroyGame: () => void = noop
		init(app, container, { hello: dev }).then(({ graphicsTicker, physicsTicker, destroy }) => {
			destroyGame = destroy
			if (dev) {
				graphicsTicker.add(({ FPS }) => {
					fps.$ = FPS
					const before = performance.now()
					app.render()
					renderTime.$ = performance.now() - before
				})
				physicsTicker.add(({ FPS }) => {
					tps.$ = FPS
				})
			} else graphicsTicker.add(app.render)
		})

		return () => destroyGame()
	})
</script>

<section {id} bind:this={container}>
	{#if dev}
		<div id="metrics">
			<span>{fps.$.toFixed(1)} FPS</span>
			<span>{tps.$.toFixed(1)} TPS</span>
			<span>{renderTime.$.toFixed(2) + "  MS"}</span>
		</div>
	{/if}
</section>

<style>
	section {
		min-height: 0;
		min-width: 0;
		overflow: hidden;
		position: relative;
	}

	#metrics {
		position: absolute;
		top: 0;
		right: 0;
		background: black;
		color: white;
		font-family: "Press Start 2P";
		font-size: 1.2rem;
		display: flex;
		flex-direction: column;
		align-items: end;
		padding: 0.5rem;
		width: 10ch;
		white-space: pre;
	}
</style>
