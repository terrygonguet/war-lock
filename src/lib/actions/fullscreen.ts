export function useFullscreen(options?: FullscreenOptions) {
	let element: HTMLElement
	return {
		fullscreen(el: HTMLElement) {
			element = el
			return {
				destroy() {
					if (document.fullscreenElement) document.exitFullscreen()
				},
			}
		},
		enter() {
			if (document.fullscreenEnabled && element) return element.requestFullscreen(options)
			else return Promise.resolve()
		},
		exit() {
			if (document.fullscreenElement) return document.exitFullscreen()
			else return Promise.resolve()
		},
		toggle() {
			if (!document.fullscreenEnabled) return Promise.resolve()
			if (document.fullscreenElement && element) return element.requestFullscreen(options)
			else return document.exitFullscreen()
		},
	}
}
