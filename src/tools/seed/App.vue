<script>
/**
 * Tool/Seed
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
 *
 * [[Category:ガジェット/MJWTools]]
 * <nowiki>
 */
console.log("[MJW Tools] Loaded component: seed")
const { ref, defineComponent } = require("vue")
const { CdxMessage, CdxTextInput } = require("@wikimedia/codex")
const ToolFieldBase = require("./FieldBase.vue")
const Messages = require("./i18n.json")

const lang = mw.config.get("wgUserLanguage") || "ja"
if (lang !== "ja" && lang in Messages) {
	mw.messages.set(Messages[lang])
} else {
	mw.messages.set(Messages["ja"])
}

module.exports = defineComponent({
	components: {
		CdxMessage,
		CdxTextInput,
		ToolFieldBase,
	},
	props: {},
	setup() {
		const seed = ref("")

		function hashCode(s) {
			let h = 0
			for (let i = 0; i < s.length; i++) {
				h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
			}
			return h
		}

		return {
			seed,
			hashCode,
		}
	},
})
</script>

<template>
	<tool-field-base class="mjw-tools-seed">
		<template #heading>{{ $i18n('mjw-tools-seed-title') }}</template>

		<div class="mjw-tools-seed-outer">
			<cdx-text-input v-model="seed"></cdx-text-input>

			<div>
				{{ $i18n('mjw-tools-seed-actual') }}
				<code v-if="seed.trim() === ''"></code>
				<code
					v-else-if="/^[+-]?\d+$/.test(seed.trim()) &&
          (BigInt(seed.trim()) > 2n ** 63n - 1n || BigInt(seed.trim()) < -(2n ** 63n))
        "
					>{{ hashCode(seed.trim()) }}</code
				>
				<code v-else-if="/^[+-]?\d+$/.test(seed.trim())"
					>{{ seed.trim() }}</code
				>
				<code v-else>{{ hashCode(seed.trim()) }}</code>
			</div>

			<cdx-message
				v-if="
          /^[+-]?\d+$/.test(seed.trim()) &&
          (BigInt(seed.trim()) > 2n ** 63n - 1n || BigInt(seed.trim()) < -(2n ** 63n))
        "
				type="warning"
			>
				{{ $i18n('mjw-tools-seed-out-of-range') }}
			</cdx-message>
			<cdx-message
				v-else-if="/^[+-]?\d+$/.test(seed.trim())"
				type="warning"
			>
				{{ $i18n('mjw-tools-seed-number') }}
			</cdx-message>
			<cdx-message v-else-if="seed.trim() === ''" type="warning">
				{{ $i18n('mjw-tools-seed-empty-string') }}
			</cdx-message>
		</div>
	</tool-field-base>
</template>

<style>
.mjw-tools-seed {
	.mjw-tools-seed-outer {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
}
</style>
