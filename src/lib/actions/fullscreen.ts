import type { Action } from "svelte/action"
import { on } from "svelte/events"
import { readonly, writable, type Readable } from "svelte/store"

export class FullscreenNotSupportedError extends Error {
	name = "FullscreenNotSupportedError"
	constructor() {
		super("Fullscreen is not supported on this device")
	}
}

export interface UseFullscreenFunctions {
	action: Action
	enter(): Promise<void>
	exit(): Promise<void>
	toggle(): Promise<void>
	isFullscreen: Readable<boolean>
}

export function useFullscreen(options?: FullscreenOptions): UseFullscreenFunctions {
	if (!document.fullscreenEnabled) throw new FullscreenNotSupportedError()

	let element: HTMLElement
	const isFullscreen = writable(!!document.fullscreenElement)

	function enter() {
		return element?.requestFullscreen(options) ?? Promise.resolve()
	}
	function exit() {
		return document.fullscreenElement ? document.exitFullscreen() : Promise.resolve()
	}
	function toggle() {
		return document.fullscreenElement ? exit() : enter()
	}

	return {
		action(el: HTMLElement) {
			element = el
			const off = on(element, "fullscreenchange", () =>
				isFullscreen.set(!!document.fullscreenElement),
			)
			return {
				destroy: () => {
					exit()
					off()
				},
			}
		},
		enter,
		exit,
		toggle,
		isFullscreen: readonly(isFullscreen),
	}
}
