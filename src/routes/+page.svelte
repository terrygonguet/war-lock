<script lang="ts">
	import { useFullscreen } from "$lib/actions/fullscreen"
	import Focus from "$lib/components/Focus.svelte"

	const { fullscreen, enter } = useFullscreen()
</script>

<svelte:head>
	<title>WIP</title>
	<meta name="description" value="WIP" />
</svelte:head>

<main on:fullscreenchange={console.log} use:fullscreen on:click={enter}>
	<Focus />
</main>

<style>
	main {
		display: flex;
		justify-content: flex-end;
		flex-direction: column;
		background-color: white;
	}
</style>
