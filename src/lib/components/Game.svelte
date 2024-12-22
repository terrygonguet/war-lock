<script lang="ts">
	import { dev } from "$app/environment"
	import { init } from "$lib/game"
	import { smoothed } from "$lib/utils/reactive.svelte"
	import { Application, Assets } from "pixi.js"

	interface Props {
		id: string
	}

	let { id }: Props = $props()
	let container = $state<HTMLElement>()
	let fps = $state(0)
	let renderTime = smoothed(0)

	$effect(() => {
		if (!container) return

		console.log("Starting game...")
		const app = new Application()

		const started = init(app, container, { autoStart: !dev, hello: dev })
		started.then(() => console.log("Game started"))

		if (dev) {
			started.then(() =>
				app.ticker.add(({ FPS }) => {
					fps = FPS
					const before = performance.now()
					app.render()
					renderTime.$ = performance.now() - before
				}),
			)
		}

		return () => {
			if (!app.stage) return
			console.log("Destroying game...")
			app.destroy(true, true)
			Assets.reset()
			console.log("Game destroyed")
		}
	})
</script>

<section {id} bind:this={container}>
	{#if dev}
		<div id="metrics">
			<span>{fps.toFixed(1)} FPS</span>
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
		white-space: pre;
	}
</style>
