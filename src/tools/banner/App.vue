<script>
/**
 * Tool/Banner
 *
 * This code was created based on mcw/calc.
 * Originally created by Minecraft Wiki.
 * https://github.com/mc-wiki/mcw-calc
 *
 * Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported  (CC BY-NC-SA 3.0)
 *
 * Licensed under
 * Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 */
console.log("[MJW Tools] Loaded component: banner")
const {
	ref,
	defineComponent,
	watch,
	useTemplateRef,
	onMounted,
} = require("vue")
const {
	CdxToggleButtonGroup,
	CdxSelect,
	CdxTable,
	CdxIcon,
	CdxButton,
	CdxTextInput,
	CdxField,
	CdxTooltip,
} = require("@wikimedia/codex")
const {
	cdxIconTableAddRowAfter,
	cdxIconAlert,
	cdxIconError,
	cdxIconTrash,
	cdxIconDownTriangle,
	cdxIconUpTriangle,
	cdxIconHelpNotice,
	cdxIconLink,
} = require("../icons.json")
const ToolFieldBase = require("./FieldBase.vue")
const BannerPopup = require("./BannerPopup.vue")
const Messages = require("./i18n.json")
const api = new mw.Api()
const loadedImageUrls = {}
const loadedImages = {
	"File:Banner_base_(texture)_JE1_BE1.png":
		"https://static.wikitide.net/minecraftjapanwiki/7/70/Banner_base_%28texture%29_JE1_BE1.png",
	"File:Shield_base_(texture)_JE2_BE1.png":
		"https://static.wikitide.net/minecraftjapanwiki/1/10/Shield_base_%28texture%29_JE2_BE1.png",
}

const lang = mw.config.get("wgUserLanguage") || "ja"
if (lang !== "ja" && lang in Messages) {
	mw.messages.set(Messages[lang])
} else {
	mw.messages.set(Messages.ja)
}

const patternId = [
	"stripe_bottom",
	"stripe_top",
	"stripe_left",
	"stripe_right",
	"stripe_center",
	"stripe_middle",
	"stripe_downright",
	"stripe_downleft",
	"small_stripes",
	"cross",
	"straight_cross",
	"diagonal_left",
	"diagonal_right",
	"diagonal_up_left",
	"diagonal_up_right",
	"half_vertical",
	"half_vertical_right",
	"half_horizontal",
	"half_horizontal_bottom",
	"square_bottom_left",
	"square_bottom_right",
	"square_top_left",
	"square_top_right",
	"triangle_bottom",
	"triangle_top",
	"triangles_bottom",
	"triangles_top",
	"circle",
	"rhombus",
	"border",
	"curly_border",
	"bricks",
	"gradient",
	"gradient_up",
	"creeper",
	"skull",
	"flower",
	"mojang",
	"globe",
	"piglin",
	"flow",
	"guster",
]
const patternName = {
	stripe_bottom: "Base",
	stripe_top: "Chief",
	stripe_left: "Pale Dexter",
	stripe_right: "Pale Sinister",
	stripe_center: "Pale",
	stripe_middle: "Fess",
	stripe_downright: "Bend",
	stripe_downleft: "Bend Sinister",
	small_stripes: "Paly",
	cross: "Saltire",
	straight_cross: "Cross",
	diagonal_left: "Per Bend Sinister",
	diagonal_right: "Per Bend",
	diagonal_up_left: "Per Bend Inverted",
	diagonal_up_right: "Per Bend Sinister Inverted",
	half_vertical: "Per Pale",
	half_vertical_right: "Per Pale Inverted",
	half_horizontal: "Per Fess",
	half_horizontal_bottom: "Per Fess Inverted",
	square_bottom_left: "Base Dexter Canton",
	square_bottom_right: "Base Sinister Canton",
	square_top_left: "Chief Dexter Canton",
	square_top_right: "Chief Sinister Canton",
	triangle_bottom: "Chevron",
	triangle_top: "Inverted Chevron",
	triangles_bottom: "Base Indented",
	triangles_top: "Chief Indented",
	circle: "Roundel",
	rhombus: "Lozenge",
	border: "Bordure",
	curly_border: "Bordure Indented",
	bricks: "Field Masoned",
	gradient: "Gradient",
	gradient_up: "Base Gradient",
	creeper: "Creeper Charge",
	skull: "Skull Charge",
	flower: "Flower Charge",
	mojang: "Thing",
	globe: "Globe",
	piglin: "Snout",
	flow: "Flow",
	guster: "Guster",
}
const patternItemRequired = [
	"flower",
	"creeper",
	"skull",
	"mojang",
	"globe",
	"piglin",
	"flow",
	"guster",
	"bricks",
	"curly_border",
]
const ColorsJavaMap = {
	white: 0xf9fffe,
	lightGray: 0x9d9d97,
	gray: 0x474f52,
	black: 0x1d1d21,
	brown: 0x835432,
	red: 0xb02e26,
	orange: 0xf9801d,
	yellow: 0xfed83d,
	lime: 0x80c71f,
	green: 0x5e7c16,
	cyan: 0x169c9c,
	lightBlue: 0x3ab3da,
	blue: 0x3c44aa,
	purple: 0x8932b8,
	magenta: 0xc74ebd,
	pink: 0xf38baa,
}

function separateRgb(rgb) {
	return [
		(rgb & 0xff0000) >> 16,
		(rgb & 0x00ff00) >> 8,
		(rgb & 0x0000ff) >> 0,
	]
}

async function promiseAllObject(obj) {
	const values = await Promise.all(Object.values(obj))
	const keys = Object.keys(obj)

	let res = {}
	for (let i = 0; i < keys.length; i++) {
		res[keys[i]] = values[i]
	}
	return res
}

function imageToImageData(image, width, height) {
	const context = Object.assign(document.createElement("canvas"), {
		width,
		height,
	}).getContext("2d")
	if (!context) throw new Error("Could not create canvas context")
	context.imageSmoothingEnabled = false
	context.drawImage(image, 1, 1, width, height, 0, 0, width, height)
	return context.getImageData(0, 0, width, height)
}

function getTemplateWikitext(title, args) {
	if (!title) return ""
	const keys = Object.keys(args)
	let ret = `{{${title}`

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i]
		ret += `|${key}=${args[key]}`
	}

	ret += "}}"
	return ret
}

async function expandTemplate(title, args) {
	const p = await api.get({
		action: "expandtemplates",
		text: getTemplateWikitext(title, args),
		prop: "wikitext",
	})

	if (p.expandtemplates && typeof p.expandtemplates.wikitext === "string") {
		return p.expandtemplates.wikitext
	}
}

function copyToClipboard(text) {
	navigator.clipboard.writeText(text)
}

module.exports = defineComponent({
	components: {
		CdxToggleButtonGroup,
		CdxSelect,
		CdxTable,
		CdxIcon,
		CdxButton,
		CdxTextInput,
		CdxField,
		ToolFieldBase,
		BannerPopup,
	},
	directives: {
		tooltip: CdxTooltip,
	},
	props: {
		icon: {
			type: String,
		},
	},
	setup(props) {
		const type = ref(props.icon || "banner")
		const baseColor = ref("white")
		const javaCommand = ref("")
		const canvasRef = useTemplateRef("canvasRef")
		const inputJavaCommandRef = useTemplateRef("inputJavaCommandRef")

		const activePatterns = ref([
			{
				id: 0,
				name: "mojang",
				color: "black",
			},
		])

		function updatePattern(index, pattern) {
			const workingPatterns = activePatterns.value.slice()
			workingPatterns[index].name = pattern
			activePatterns.value = workingPatterns.filter((v) => v !== null)

			activePatterns.value = activePatterns.value.map(
				(pattern, index) => ({
					id: index,
					name: pattern.name,
					color: pattern.color,
				}),
			)
		}
		function deletePattern(index) {
			if (activePatterns.value.length <= 1) {
				activePatterns.value = [
					{
						id: 0,
						name: "mojang",
						color: "black",
					},
				]
			} else {
				activePatterns.value = activePatterns.value
					.filter((_, i) => i !== index)
					.map((pattern, index) => ({
						id: index,
						name: pattern.name,
						color: pattern.color,
					}))
			}
		}

		function swapPattern(from, to) {
			const workingPatterns = activePatterns.value.slice()
			if (
				from < 0 ||
				from >= workingPatterns.length ||
				to < 0 ||
				to >= workingPatterns.length
			) {
				return
			}
			const temp = workingPatterns[from]
			workingPatterns[from] = workingPatterns[to]
			workingPatterns[to] = temp

			activePatterns.value = workingPatterns.map((pattern, index) => ({
				id: index,
				name: pattern.name,
				color: pattern.color,
			}))
		}

		function newLayer() {
			if (activePatterns.value.length === 0) {
				activePatterns.value.push({
					id: 0,
					name: "mojang",
					color: "black",
				})
			} else {
				const pattern =
					activePatterns.value[activePatterns.value.length - 1]
				activePatterns.value.push({
					id: activePatterns.value.length,
					name: pattern.name,
					color: pattern.color,
				})
			}

			activePatterns.value = activePatterns.value.filter(
				(v) => v !== null,
			)
		}

		function updateColor(index, color) {
			activePatterns.value[index].color = color
		}

		const patternMenuItems = ref(
			patternId.map((pattern) => ({
				value: pattern,
				label: mw.message(`mjw-tools-banner-pattern-${pattern}`).text(),
				thumbnail: {
					html: "",
				},
				bannerPattern: {
					html: "",
				},
			})),
		)

		const colorMenuItems = Object.keys(ColorsJavaMap).map((color) => ({
			value: color,
			label: mw.message(`mjw-tools-color-${color}`).text(),
			icon: `<rect width="20" height="20" fill="#${ColorsJavaMap[color].toString(16)}" stroke="${"#000000"}" stroke-width="2" />`,
		}))

		function getJavaCommand() {
			const camelToSnake = (str) =>
				str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
			return type.value === "shield"
				? `/give @s minecraft:shield` +
						`[minecraft:banner_patterns=[${activePatterns.value
							.map(
								(pattern) =>
									`{color: "${camelToSnake(pattern.color)}", pattern: "${pattern.name}"}`,
							)
							.join(
								",",
							)}], minecraft:base_color="${camelToSnake(baseColor.value)}"]`
				: `/give @s minecraft:${camelToSnake(baseColor.value)}_banner` +
						`[minecraft:banner_patterns=[${activePatterns.value
							.map(
								(pattern) =>
									`{color: "${camelToSnake(pattern.color)}", pattern: "${pattern.name}"}`,
							)
							.join(",")}]]`
		}

		function copyJavaCommand() {
			copyToClipboard(getJavaCommand())
		}

		function copyShareUrl() {
			const url = new URL(
				"https://minecraftjapan.miraheze.org/wiki/Project:ツール/旗",
			)
			const searchParams = new URLSearchParams()
			searchParams.set(
				"activePatterns",
				JSON.stringify(activePatterns.value),
			)
			searchParams.set("baseColor", baseColor.value)
			url.hash = `?${searchParams.toString()}`
			copyToClipboard(url.href)
		}

		function selectJavaCommand() {
			inputJavaCommandRef.value.$refs.input.select()
		}

		async function getFileUrl(filename) {
			const normalized = `File:${filename
				.replace(/^(File|ファイル):/, "")
				.replace(/ /g, "_")}`

			if (loadedImageUrls[normalized])
				return Promise.resolve(loadedImageUrls[normalized])
			return await api
				.get({
					action: "query",
					prop: "imageinfo",
					iiprop: "url",
					titles: normalized,
					indexpageids: true,
				})
				.then((res) => {
					const pageid = res.query.pageids[0]
					if (pageid < 0) {
						return ""
					}
					if (res.query.pages[pageid]) {
						return res.query.pages[pageid].imageinfo[0].url
					} else if (res.query.pages[0]) {
						return res.query.pages[0].imageinfo[0].url
					}
				})
				.then((p) => {
					loadedImageUrls[normalized] = p
					return p
				})
		}

		async function loadImage(filename) {
			const src = await getFileUrl(filename)
			if (!src) return Promise.resolve()
			if (loadedImages[src]) return Promise.resolve(loadedImages[src])
			return new Promise((resolve, reject) => {
				const img = new Image()
				img.crossOrigin = "anonymous"
				img.addEventListener("load", () => {
					loadedImages[src] = img
					resolve(img)
				})
				img.addEventListener("error", reject)
				img.src = src
			})
		}

		async function getImages() {
			const imagePromises = {
				base:
					type.value === "banner"
						? loadImage("Banner_base_(texture)_JE1_BE1.png")
						: loadImage("Shield_base_(texture)_JE2_BE1.png"),
			}
			for (let i = 0; i < patternId.length; i++) {
				const pattern = patternId[i]
				imagePromises[pattern] = loadImage(
					`${type.value === "banner" ? "Banner" : "Shield"}_${pattern}_(texture)_JE1_BE1.png`,
				)
			}

			return await promiseAllObject(imagePromises)
		}

		onMounted(() => {
			const url = document.location
			const params = new URLSearchParams(url.hash.slice(2))
			const activePatternsParam = params.get("activePatterns")
			if (activePatternsParam) {
				activePatterns.value = JSON.parse(activePatternsParam)
			}
			const baseColorParam = params.get("baseColor")
			if (baseColorParam) {
				baseColor.value = baseColorParam
			}

			// slot sprite
			async function setPatternMenuItems() {
				let slotSpritePromises = {}
				let itemSpritePromises = {}
				for (let i = 0; i < patternMenuItems.value.length; i++) {
					const v = patternMenuItems.value[i]

					slotSpritePromises[v.value] = expandTemplate("SlotSprite", {
						1: patternName[v.value].replace("_", " "),
					}).catch(() => {
						return ""
					})

					if (patternItemRequired.includes(v.value)) {
						itemSpritePromises[v.value] = expandTemplate(
							"ItemSprite",
							{
								1: `${v.value.replace("_", "-")}-banner-pattern`,
								scale: "2",
							},
						).catch(() => {
							return ""
						})
					}
				}
				const slotSprites = await promiseAllObject(slotSpritePromises)
				const itemSprites = await promiseAllObject(itemSpritePromises)

				for (let i = 0; i < patternMenuItems.value.length; i++) {
					const v = patternMenuItems.value[i]
					patternMenuItems.value[i].thumbnail.html =
						slotSprites[v.value]

					if (itemSprites[v.value] !== undefined) {
						patternMenuItems.value[i].bannerPattern.html =
							itemSprites[v.value]
					}
				}
			}
			setPatternMenuItems().then(() => {
				mw.hook("renderSprites").fire()
			})

			// item sprite
			async function setItemSprite() {
				let promises = {}
				for (let i = 0; i < patternMenuItems.value.length; i++) {
					const v = patternMenuItems.value[i]
					promises[v.value] = expandTemplate("SlotSprite", {
						1: patternName[v.value].replace("_", " "),
					}).catch(() => {
						return ""
					})
				}
				const sprites = await promiseAllObject(promises)

				for (let i = 0; i < patternMenuItems.value.length; i++) {
					const v = patternMenuItems.value[i]
					patternMenuItems.value[i].thumbnail.html = sprites[v.value]
				}
			}
			setItemSprite()
		})

		watch(
			[activePatterns, baseColor, type, canvasRef],
			async ([patterns, color, type, canvas]) => {
				javaCommand.value = getJavaCommand()

				const baseColor = separateRgb(ColorsJavaMap[color])
				if (!canvas) return
				const ctx = canvas.getContext("2d", {
					willReadFrequently: true,
				})
				if (!ctx) return

				ctx.clearRect(0, 0, canvas.width, canvas.height)

				// images
				const images = await getImages()
				if (!images.base) return

				if (type === "banner")
					ctx.drawImage(images.base, 1, 1, 20, 40, 0, 0, 20, 40)
				else ctx.drawImage(images.base, 1, 1, 12, 22, 0, 0, 12, 22)
				const imageData = ctx.getImageData(
					0,
					0,
					canvas.width,
					canvas.height,
				)
				const data = imageData.data
				for (let i = 0; i < data.length; i += 4) {
					if (type === "shield") {
						// skip at first and last row and column
						if (
							i <= 12 * 4 ||
							i >= 12 * 21 * 4 ||
							i % (12 * 4) === 0 ||
							i % (12 * 4) === 12 * 4 - 4
						) {
							continue
						}
					}
					data[i] = (data[i] * baseColor[0]) / 255
					data[i + 1] = (data[i + 1] * baseColor[1]) / 255
					data[i + 2] = (data[i + 2] * baseColor[2]) / 255
				}

				for (const pattern of patterns) {
					const patternImage = images[pattern.name]
					if (patternImage) {
						const patternData =
							type === "banner"
								? imageToImageData(patternImage, 20, 40)
								: imageToImageData(patternImage, 12, 22)
						const patternColor = separateRgb(
							ColorsJavaMap[pattern.color],
						)
						const patternDataArray = patternData.data
						for (let i = 0; i < patternDataArray.length; i += 4) {
							const red2 =
								(patternColor[0] / 255) *
								(patternDataArray[i] / 255)
							const green2 =
								(patternColor[1] / 255) *
								(patternDataArray[i + 1] / 255)
							const blue2 =
								(patternColor[2] / 255) *
								(patternDataArray[i + 2] / 255)
							const alpha2 = patternDataArray[i + 3] / 255

							data[i] =
								(red2 * alpha2 +
									(data[i] / 255) * (1 - alpha2)) *
								255
							data[i + 1] =
								(green2 * alpha2 +
									(data[i + 1] / 255) * (1 - alpha2)) *
								255
							data[i + 2] =
								(blue2 * alpha2 +
									(data[i + 2] / 255) * (1 - alpha2)) *
								255
						}
					}
				}

				ctx.putImageData(imageData, 0, 0)
			},
			{
				deep: true,
			},
		)

		return {
			type,
			activePatterns,
			patternItemRequired,
			patternName,
			updatePattern,
			deletePattern,
			swapPattern,
			newLayer,
			patternMenuItems,
			colorMenuItems,
			updateColor,
			baseColor,
			canvasRef,
			copyShareUrl,
			copyJavaCommand,
			javaCommand,
			selectJavaCommand,
			inputJavaCommandRef,
			cdxIconTableAddRowAfter,
			cdxIconAlert,
			cdxIconError,
			cdxIconTrash,
			cdxIconDownTriangle,
			cdxIconUpTriangle,
			cdxIconHelpNotice,
			cdxIconLink,
			getImages,
		}
	},
})
</script>

<template>
	<tool-field-base class="mjw-tools-banner">
		<template #heading> {{ $i18n('mjw-tools-banner-title') }} </template>
		<div class="mjw-tools-banner-outer">
			<div class="mjw-tools-banner-canvas">
				<cdx-select
					v-model:selected="baseColor"
					:menu-items="colorMenuItems"
					class="mjw-tools-banner-base-color-select"
				></cdx-select>
				<canvas
					ref="canvasRef"
					:width="type === 'banner' ? 20 : 12"
					:height="type === 'banner' ? 40 : 22"
					class="pixel-image"
				></canvas>
				<cdx-toggle-button-group
					v-model="type"
					class="mjw-tools-banner-canvas--type-buttons"
					:buttons="[
                    { value: 'banner', label: $i18n('mjw-tools-banner-type-banner') },
                    { value: 'shield', label: $i18n('mjw-tools-banner-type-shield') },
                ]"
				></cdx-toggle-button-group>
			</div>

			<div class="mjw-tools-banner-list">
				<div class="mjw-tools-banner-list-inner">
					<cdx-table
						class="min-h-full"
						:caption="$i18n('mjw-tools-banner-list-title')"
						:use-row-headers="true"
						:data="activePatterns"
						:columns="activePatterns.length === 0 ? [] : [
                            { id: 'id', label: $i18n('mjw-tools-banner-layer'), textAlign: 'number' },
                            { id: 'name', label: $i18n('mjw-tools-banner-pattern') },
                            { id: 'color', label: $i18n('mjw-tools-banner-color') },
                            { id: 'actions', label: $i18n('mjw-tools-banner-actions') },
                        ]
                            "
					>
						<template #header>
							<cdx-button @click="newLayer">
								<cdx-icon
									:icon="cdxIconTableAddRowAfter"
								></cdx-icon>
								{{ $i18n('mjw-tools-banner-add-layer') }}
							</cdx-button>
						</template>

						<template #item-id="{ item }">
							<div class="mjw-tools-banner--popup">
								<banner-popup
									v-if="item + 1 > 6 && item + 1 <= 16"
									:icon="cdxIconAlert"
									key="warning"
									type="warning"
								>
									{{ $i18n('mjw-tools-banner-limit-warning') }}
								</banner-popup>
								<banner-popup
									v-if="item + 1 > 16"
									:icon="cdxIconError"
									key="error"
									type="error"
								>
									{{ $i18n('mjw-tools-banner-limit-error') }}
								</banner-popup>

								{{ item + 1 }}
							</div>
						</template>

						<template #item-name="{ item, row }">
							<cdx-select
								class="mjw-tools-banner-list--select"
								style="min-width: 230px;"
								:menu-items="patternMenuItems"
								:selected="item"
								:key="`pattern-select-${row.id}`"
								@update:selected="(selected) => updatePattern(row.id, selected)"
							>
								<template #label="{ selectedMenuItem }">
									<div
										v-if="selectedMenuItem"
										class="mjw-tools-banner-list--select-item"
									>
										<span
											v-html="selectedMenuItem.thumbnail.html"
										></span>
										<span
											>{{ selectedMenuItem.label }}</span
										>

										<!--
                                        <div v-if="patternItemRequired.includes(selectedMenuItem.value)"
                                            v-tooltip="$i18n('mjw-tools-banner-required-pattern')"
                                            class="mjw-tools-banner-list--required-pattern">
                                            <img class="pixel-image" style="margin-left: 0.5rem;" width="24" height="24"
                                                loading="lazy" :src="getImageLink(
                                                    `en:ItemSprite_${patternName[selectedMenuItem.value]
                                                        .toLowerCase()
                                                        .replace(/ /g, '-')}-banner-pattern.png`,
                                                )" />
                                        </div>
                                        -->
									</div>
								</template>

								<template #menu-item="{ menuItem }">
									<div
										class="mjw-tools-banner-list--select-item"
									>
										<span
											v-html="menuItem.thumbnail.html"
										></span>
										<span>{{ menuItem.label }}</span>

										<div
											v-if="patternItemRequired.includes(menuItem.value)"
											v-tooltip="$i18n('mjw-tools-banner-required-pattern')"
											class="mjw-tools-banner-list--required-pattern"
										>
											<span
												style="margin-left: 0.3rem;"
												v-html="menuItem.bannerPattern.html"
											></span>
										</div>
									</div>
								</template>
							</cdx-select>
						</template>

						<template #item-color="{ item, row }">
							<cdx-select
								class="mjw-tools-banner-list--select"
								:menu-items="colorMenuItems"
								:selected="item"
								:key="`color-select-${row.id}`"
								@update:selected="(selected) => updateColor(row.id, selected)"
							></cdx-select>
						</template>

						<template #item-actions="{ row }">
							<div style="display: flex;">
								<div
									class="mjw-tools-banner-list--item-buttons"
								>
									<cdx-button
										v-if="row.id !== 0"
										style="min-height: 0;"
										weight="quiet"
										:aria-label="$i18n('mjw-tools-banner-move-up')"
										@click="() => swapPattern(row.id, row.id - 1)"
									>
										<cdx-icon
											size="x-small"
											:icon="cdxIconUpTriangle"
										></cdx-icon>
									</cdx-button>
									<cdx-button
										v-if="row.id !== activePatterns.length - 1"
										style="min-height: 0;"
										weight="quiet"
										:aria-label="$i18n('mjw-tools-banner-move-down')"
										@click="() => swapPattern(row.id, row.id + 1)"
									>
										<cdx-icon
											size="x-small"
											:icon="cdxIconDownTriangle"
										></cdx-icon>
									</cdx-button>
								</div>

								<cdx-button
									weight="quiet"
									action="destructive"
									:aria-label="$i18n('mjw-tools-banner-remove')"
									@click="() => deletePattern(row.id)"
								>
									<cdx-icon :icon="cdxIconTrash"></cdx-icon>
								</cdx-button>
							</div>
						</template>

						<template #empty-state>
							<cdx-button
								action="progressive"
								weight="primary"
								size="large"
								@click="newLayer"
							>
								<cdx-icon
									:icon="cdxIconTableAddRowAfter"
								></cdx-icon>
								{{ $i18n('mjw-tools-banner-new') }}
							</cdx-button>
						</template>
					</cdx-table>
				</div>

				<div class="mjw-tools-banner-actions">
					<div class="mjw-tools-banner-action-group">
						<cdx-button @click="copyShareUrl">
							<cdx-icon :icon="cdxIconLink"></cdx-icon>
							{{ $i18n('mjw-tools-banner-copy-share-url') }}
						</cdx-button>
					</div>
					<div
						class="mjw-tools-banner-action-group mjw-tools-banner-java-command"
					>
						<cdx-button @click="copyJavaCommand">
							{{ $i18n('mjw-tools-banner-copy-java-command') }}
						</cdx-button>
						<cdx-text-input
							id="java-command"
							v-model="javaCommand"
							readonly="true"
							ref="inputJavaCommandRef"
							@focus="selectJavaCommand"
						></cdx-text-input>
					</div>
					<div class="mjw-tools-banner-action-group">
						<!-- <cdx-button @click="copyBedrockCommand">
                            {{ $i18n('mjw-tools-banner-copy-bedrock-command') }}
                        </cdx-button> -->
						<cdx-button
							v-tooltip="$i18n('mjw-tools-banner-bedrock-command-help-tooltip')"
							weight="quiet"
						>
							<cdx-icon :icon="cdxIconHelpNotice"></cdx-icon>
							{{ $i18n('mjw-tools-banner-bedrock-command-help-button') }}
						</cdx-button>
					</div>
				</div>
			</div>
		</div>
	</tool-field-base>
</template>

<style>
.mjw-tools-banner {
	.mjw-tools-banner-outer {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.375rem;
	}

	.mjw-tools-banner-canvas {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		align-items: center;
	}

	.mjw-tools-banner-canvas > canvas {
		height: 200px;
	}

	@media (min-width: 48rem) {
		.mjw-tools-banner-outer {
			align-items: stretch;
			flex-direction: row;
		}

		.mjw-tools-banner-canvas > canvas {
			height: 400px;
		}
	}

	.mjw-tools-banner-base-color-select {
		width: 100%;
	}

	.mjw-tools-banner-canvas--type-buttons {
		display: flex;
		width: 100%;
	}

	.mjw-tools-banner-canvas--type-buttons > * {
		flex-grow: 1;
	}

	.mjw-tools-banner-list {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 0.375rem;
		width: 100%;
		overflow-x: auto;
	}

	.mjw-tools-banner-list-inner {
		flex: 1;
		max-height: 400px;
		max-width: 100%;
		overflow-x: auto;
	}

	.mjw-tools-banner--popup {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.mjw-tools-banner-list--select {
		width: 100%;
	}
	.mjw-tools-banner-list--select-item {
		display: flex;
		align-items: center;
	}

	.mjw-tools-banner-list--required-pattern {
		display: flex;
		align-items: center;
		position: relative;
	}

	.mjw-tools-banner-list--item-buttons {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
	}

	.mjw-tools-banner-actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mjw-tools-banner-action-group {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.mjw-tools-banner-java-command {
		display: flex;
		width: 100%;
	}
	.mjw-tools-banner-java-command > .cdx-text-input {
		flex-grow: 1;
	}

	.cdx-select-vue__handle {
		min-width: 175px;
		display: flex;
		align-items: center;
		height: 36px;
	}

	.cdx-table {
		display: flex;
		flex-direction: column;
		background-color: var(--background-color-base);
	}

	.cdx-table__table-wrapper {
		flex: 1;
		overflow: visible;
		overflow-x: auto;
	}

	.cdx-table__header {
		position: sticky;
		top: 0;
		background-color: var(--background-color-base);
		z-index: var(--z-index-above-content);
	}
}
</style>
