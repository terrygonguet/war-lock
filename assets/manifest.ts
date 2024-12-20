import type { AssetsManifest } from "pixi.js"
import terrainSheetSrc from "$assets/terrain.json?url"
import terrainImageSrc from "$assets/terrain.sheet.png"

console.log({ terrainImageSrc, terrainSheetSrc })

export const bundles = {
	terrain: "terrain",
} as const

export const allBundles = Object.values(bundles)

export const manifest: AssetsManifest = {
	bundles: [
		{
			name: bundles.terrain,
			assets: [
				{
					alias: "terrain.sheet",
					src: terrainSheetSrc,
					data: { imageFilename: "terrain.sheet.png" },
				},
			],
		},
	],
}
