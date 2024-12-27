import "pixi.js/math-extras"
import { EventEmitter, Point } from "pixi.js"

export type ActionName = "up" | "down" | "left" | "right" | "jump"

export interface ControlsEvents {
	press: [ActionName, Controls]
	unpress: [ActionName, Controls]
	zoom: [number, Controls]
}

export interface Controls {
	pressed: Record<ActionName, boolean>
	on: AddEventListener<ControlsEvents>
	movement(out?: Point): Point
}

type AddEventListener<Events extends ControlsEvents> = <Type extends keyof Events, Ctx = any>(
	type: Type,
	// @ts-ignore
	cb: (this: Ctx, ...args: Events[Type]) => void,
	context?: Ctx,
) => void

/**
 * ===== Keyboard =====
 */

export interface KeyboardControlsEvents extends ControlsEvents {
	keydown: [ActionName, KeyboardControls, KeyboardEvent]
	keyup: [ActionName, KeyboardControls, KeyboardEvent]
	scroll: [KeyboardControls, WheelEvent]
}

export interface KeyboardControlsOptions {
	keymap: { [code: string]: ActionName }
	logKeypresses?: boolean
}

export interface KeyboardControls extends Controls {
	on: AddEventListener<KeyboardControlsEvents>
	destroy(): void
}

export function createKeyboardControls({
	keymap,
	logKeypresses = false,
}: KeyboardControlsOptions): KeyboardControls {
	const emitter = new EventEmitter<KeyboardControlsEvents>()
	const ctrls: KeyboardControls = {
		pressed: {
			up: false,
			down: false,
			left: false,
			right: false,
			jump: false,
		},
		on: emitter.on.bind(emitter),
		movement(out = Point.shared) {
			// @ts-ignore
			let dx = ctrls.pressed.right - ctrls.pressed.left
			// @ts-ignore
			let dy = ctrls.pressed.up - ctrls.pressed.down
			if (dx && dy) {
				dx *= Math.SQRT2
				dy *= Math.SQRT2
			}
			return out.set(dx, dy)
		},
		destroy() {
			globalThis.removeEventListener("keydown", onKeydown)
			globalThis.removeEventListener("keyup", onKeyup)
			globalThis.removeEventListener("wheel", onWheel)
			globalThis.removeEventListener("keydown", debug)
			globalThis.removeEventListener("keyup", debug)
			emitter.removeAllListeners()
		},
	}

	globalThis.addEventListener("keydown", onKeydown)
	globalThis.addEventListener("keyup", onKeyup)
	globalThis.addEventListener("wheel", onWheel)
	if (logKeypresses) {
		globalThis.addEventListener("keydown", debug)
		globalThis.addEventListener("keyup", debug)
	}

	function onKeydown(evt: KeyboardEvent) {
		const action = keymap[evt.code]
		if (action) {
			ctrls.pressed[action] = true
			emitter.emit("press", action, ctrls as any)
			emitter.emit("keydown", action, ctrls, evt)
		}
	}

	function onKeyup(evt: KeyboardEvent) {
		const action = keymap[evt.code]
		if (action) {
			ctrls.pressed[action] = false
			emitter.emit("unpress", action, ctrls as any)
			emitter.emit("keyup", action, ctrls, evt)
		}
	}

	function onWheel(evt: WheelEvent) {
		emitter.emit("zoom", evt.deltaY, ctrls as any)
		emitter.emit("scroll", ctrls, evt)
	}

	function debug(evt: KeyboardEvent) {
		let str = "Event: " + evt.type + " / Code: " + evt.code + " / Key: " + evt.key
		const modifiers: string[] = []
		if (evt.ctrlKey) modifiers.push("ctrl")
		if (evt.altKey) modifiers.push("alt")
		if (evt.shiftKey) modifiers.push("shift")
		if (evt.metaKey) modifiers.push("meta")
		if (modifiers.length) str += " (" + modifiers.join("+") + ")"
		console.log(str)
	}

	return ctrls
}
