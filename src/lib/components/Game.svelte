<script lang="ts">
	import { startGame } from "$lib/game/index"

	interface Props {
		id: string
	}

	let { id }: Props = $props()
	let container = $state<HTMLElement>()!

	$effect(() => {
		let destroy = startGame(container)
		return () => destroy()
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
