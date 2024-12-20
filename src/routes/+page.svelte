<script lang="ts">
	import { dev } from "$app/environment"
	import { useFullscreen } from "$lib/actions/fullscreen"
	import Game from "$lib/components/Game.svelte"

	const { action: fullscreen, enter } = useFullscreen()
</script>

<main use:fullscreen>
	<Game id="game" />
	{#if !dev}
		<section id="need-fullscreen">
			<p>Need fullscreen</p>
			<button onclick={enter}>Go fullscreen</button>
		</section>
	{/if}
</main>

<style>
	main {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}

	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5rem;
		background-color: white;
	}

	p {
		font-size: 1.5rem;
		text-align: center;
	}

	button {
		background: black;
		color: white;
		font-weight: bold;
		text-transform: uppercase;
		padding: 0.5rem 1rem;
		transition: background-color 150ms ease-in-out;

		&:hover,
		&:focus {
			background: #222;
		}
	}

	#need-fullscreen,
	main > :global(#game) {
		grid-area: 1 / 1 / -1 / -1;
	}

	@media (display-mode: fullscreen) {
		#need-fullscreen {
			display: none;
		}
	}
</style>
