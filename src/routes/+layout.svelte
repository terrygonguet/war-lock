<slot />

<style global>
	* {
		scrollbar-width: thin;
	}

	body {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		display: grid;
	}

	body > #app {
		display: grid;
		grid-template-areas: "main";
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}

	body > #app > main {
		grid-area: main;
	}
</style>
