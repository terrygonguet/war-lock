<script lang="ts">
	import "../reset.css"

	let { children } = $props()
</script>

{@render children()}

<style>
	:global(body) {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			"header"
			"main"
			"footer";
	}

	:global(body > div > header) {
		grid-area: header;
	}
	:global(body > div > main) {
		grid-area: main;
	}
	:global(body > div > footer) {
		grid-area: footer;
	}
</style>
