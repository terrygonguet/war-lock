interface UseContext2DOptions {
	contextId: "2d"
	options?: CanvasRenderingContext2DSettings
	callback(context: CanvasRenderingContext2D): void
}

interface UseContextWebGLOptions {
	contextId: "webgl"
	options?: WebGLContextAttributes
	callback(context: WebGLRenderingContext): void
}

interface UseContextWebGL2Options {
	contextId: "webgl2"
	options?: WebGLContextAttributes
	callback(context: WebGL2RenderingContext): void
}

type UseContextOptions = (
	| UseContext2DOptions
	| UseContextWebGLOptions
	| UseContextWebGL2Options
) & { onDestroy?: () => void }

export function canvasContext(
	canvas: HTMLCanvasElement,
	{ contextId, options, callback, onDestroy }: UseContextOptions,
) {
	const ctx = canvas.getContext(contextId, options)
	if (!ctx) throw new Error(`Cannot acquire "${contextId}" context`)
	callback(ctx as any)
	return { destroy: onDestroy }
}
