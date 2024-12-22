export function smoothed(value: number, { windowSize = 100 } = {}) {
	const values = $state(Array.from<number>({ length: windowSize }).fill(value))
	let smoothed = $derived(values.reduce((a, b) => a + b) / values.length)
	let curIndex = 0

	return {
		get $() {
			return smoothed
		},
		set $(newValue: number) {
			values[curIndex] = newValue
			curIndex = (curIndex + 1) % values.length
		},
	}
}
