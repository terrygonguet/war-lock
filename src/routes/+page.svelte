<script lang="ts">
	import { useFullscreen } from "$lib/actions/fullscreen"
	import Game from "$lib/components/Game.svelte"

	const { action: fullscreen, enter } = useFullscreen()
</script>

<main use:fullscreen>
	<Game id="game" />
	<section id="need-fullscreen">
		<p>Need fullscreen</p>
		<button onclick={enter}>Go fullscreen</button>
	</section>
	<section id="need-phone">
		<p>For now this game only functions on touch devices in portrait mode, ie phones.</p>
	</section>
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
	#need-phone,
	main > :global(#game) {
		grid-area: 1 / 1 / -1 / -1;
	}

	@media (orientation: portrait) and (any-pointer: coarse) {
		#need-phone {
			display: none;
		}
	}

	@media (display-mode: fullscreen) {
		#need-fullscreen {
			display: none;
		}
	}
</style>
