<script lang="ts">
	import { runGame } from "$lib/game"

	interface Props {
		id: string
	}

	let { id }: Props = $props()
	let container = $state<HTMLElement>()!
	$effect(() => {
		let cleanup = runGame(container)
		console.log("started")
		return () => {
			cleanup()
			console.log("destroyed")
		}
	})
</script>

<section {id} bind:this={container}></section>

<style>
	section {
		min-height: 0;
		min-width: 0;
		overflow: hidden;
	}
</style>
