import {
	Assets,
	DOMAdapter,
	ExtensionType,
	Loader,
	LoaderParserPriority,
	type LoaderParser,
	type ResolvedAsset,
	type SpritesheetData,
} from "pixi.js"

export class LoadError extends Error {
	static name = "LoadError"

	constructor(message: string, publicassetUrl: string) {
		super(message)
	}
}

export class MapLoader implements LoaderParser<MapData> {
	static name = "loadTmxMap"

	static register(loader: Loader) {
		if (!loader.parsers.find((parser) => parser.name == MapLoader.name))
			loader.parsers.push(new MapLoader())
	}

	name = MapLoader.name
	extension = {
		type: ExtensionType.LoadParser,
		priority: LoaderParserPriority.High,
	}

	test(url: string, resolvedAsset?: ResolvedAsset) {
		return url.endsWith(".tmx") || resolvedAsset?.format == "tmx"
	}

	async load(url: string, resolvedAsset?: ResolvedAsset, loader?: Loader) {
		const res = await DOMAdapter.get().fetch(url)
		const xml = await res.text()
		const dom = DOMAdapter.get().parseXML(xml)

		const map = dom.querySelector("map")
		if (!map) throw new LoadError("Asset is not a TMX file: missing <map>", url)

		const layers = Array.from(dom.querySelectorAll("layer"))
		if (layers.length == 0) throw new LoadError("Asset is not a TMX file: no <layer>", url)

		const mapData: MapData = {
			dimensions: { x: 0, y: 0, z: 0 },
			origin: { x: 0, y: 0, z: 0 },
			tiles: [],
			spritesheets: {},
		}

		if (loader) {
			const tilesets = Array.from(dom.querySelectorAll("tileset"))
			if (tilesets.length > 1)
				throw new LoadError("Cannot parse TMX file: multiple tilesets are not supported", url)
			else if (tilesets.length == 1) {
				const tileset = tilesets[0]
				const sheet = tileset2spritesheet(tileset)
				if (sheet) {
					const assetURL = new URL(sheet.meta.image!, url)
					await Assets.load({ alias: sheet.meta.image, src: assetURL.toString() })
					mapData.spritesheets[sheet.name] = sheet
				}
			}
		}

		for (const prop of dom.querySelectorAll("properties > property")) {
			const name = prop.getAttribute("name")
			const type = prop.getAttribute("type")
			const value = prop.getAttribute("value")
			if (!name || !type || !value) continue
			if (name == "origin_x" && type == "int") {
				mapData.origin.x = parseInt(value)
			} else if (name == "origin_y" && type == "int") {
				mapData.origin.y = parseInt(value)
			} else if (name == "origin_z" && type == "int") {
				mapData.origin.z = parseInt(value)
			}
		}

		const infinite = map.getAttribute("infinite")
		if (infinite == "1")
			throw new LoadError("Cannot parse TMX file: infinite map are not supported", url)

		const width = map.getAttribute("width")
		const height = map.getAttribute("height")
		if (!width || !height) throw new LoadError("Cannot parse TMX file: missing dimensions", url)

		mapData.dimensions.x = parseInt(width)
		mapData.dimensions.y = parseInt(height)
		mapData.dimensions.z =
			1 + layers.reduce((maxZ, layer) => Math.max(maxZ, parseInt(layer.getAttribute("name")!)), 0)

		const layerSize = mapData.dimensions.x * mapData.dimensions.y
		const mapSize = layerSize * mapData.dimensions.z
		mapData.tiles = Array.from<number>({ length: mapSize }).fill(0)

		for (let z = 0; z <= mapData.dimensions.z; z++) {
			const data = dom.querySelector(`layer[name="${z}"] > data`)
			if (!data) continue
			const csv = data.textContent
			if (!csv) continue

			let y = 0
			for (const line of csv.split("\r\n")) {
				if (line.length == 0) continue
				let x = 0
				for (const tileId of line.split(",")) {
					if (tileId.length == 0) continue
					const idx = z * layerSize + (y + z) * mapData.dimensions.x + x + z
					if (idx >= mapData.tiles.length) continue
					mapData.tiles[idx] = parseInt(tileId)
					x++
				}
				y++
			}
		}

		return mapData
	}
}

function tileset2spritesheet(tileset: Element): (SpritesheetData & { name: string }) | undefined {
	const name = tileset.getAttribute("name")
	const firstgid = parseInt(tileset.getAttribute("firstgid")!)
	const tilewidth = parseInt(tileset.getAttribute("tilewidth")!)
	const tileheight = parseInt(tileset.getAttribute("tileheight")!)
	const tilecount = parseInt(tileset.getAttribute("tilecount")!)
	const columns = parseInt(tileset.getAttribute("columns")!)
	const image = tileset.querySelector("image")
	if (!name || !firstgid || !tilewidth || !tileheight || !tilecount || !columns || !image) return

	const source = image.getAttribute("source")
	const width = parseInt(image.getAttribute("width")!)
	const height = parseInt(image.getAttribute("height")!)
	if (!source || !width || !height) return

	return {
		name,
		frames: Object.fromEntries(
			Array.from({ length: tilecount }).map((_, i) => [
				(firstgid + i).toString(),
				{
					frame: {
						x: (i % columns) * tilewidth,
						y: Math.floor(i / columns) * tileheight,
						w: tilewidth,
						h: tileheight,
					},
					spriteSourceSize: { x: 0, y: 0, w: tilewidth, h: tileheight },
					sourceSize: { w: tilewidth, h: tileheight },
				},
			]),
		),
		meta: {
			image: source,
			size: { w: width, h: height },
			scale: 1,
		},
	}
}
