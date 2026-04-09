<script>
/**
 * Tool/Energy
 *
 * Licensed under
 * Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
 * https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 */
console.log("[MJW Tools] Loaded component: energy")
const { computed, ref, defineComponent } = require("vue")
const { CdxField, CdxTextInput } = require("@wikimedia/codex")
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
		CdxField,
		CdxTextInput,
		ToolFieldBase,
	},
	props: {},
	setup() {
		const energyRF = ref(0)

		const energyEU = computed({
			get: () => energyRF.value / 4,
			set: (value) => {
				if (Number.isNaN(value)) return
				energyRF.value = value * 4
			},
		})

		const energyJ = computed({
			get: () => energyRF.value * 2.5,
			set: (value) => {
				if (Number.isNaN(value)) return
				energyRF.value = value / 2.5
			},
		})

		const energyMJ = computed({
			get: () => energyRF.value / 10,
			set: (value) => {
				if (Number.isNaN(value)) return
				energyRF.value = value * 10
			},
		})

		const energyFE = computed({
			get: () => energyRF.value * 1,
			set: (value) => {
				if (Number.isNaN(value)) return
				energyRF.value = value / 1
			},
		})

		return {
			energyRF,
			energyEU,
			energyJ,
			energyMJ,
			energyFE,
		}
	},
})
</script>

<template>
	<tool-field-base class="mjw-tools-energy">
		<template #heading>{{ $i18n('mjw-tools-energy-title') }}</template>

		<cdx-field class="mjw-tools-energy-fieldset" :is-fieldset="true">
			<template #label>{{ $i18n('mjw-tools-energy-fe') }}</template>

			<div class="mjw-tools-input-field">
				<cdx-text-input
					class="mjw-tools-text-input mjw-tools-energy-text-input"
					v-model="energyFE"
					id="mjw-tools-energy-fe"
					input-type="number"
				/>
			</div>
			<span
				class="mjw-tools-input-label"
				v-text="$i18n('mjw-tools-energy-unit-fe')"
			></span>
		</cdx-field>

		<cdx-field class="mjw-tools-energy-fieldset" :is-fieldset="true">
			<template #label>{{ $i18n('mjw-tools-energy-eu') }}</template>

			<div class="mjw-tools-input-field">
				<cdx-text-input
					class="mjw-tools-text-input mjw-tools-energy-text-input"
					v-model="energyEU"
					id="mjw-tools-energy-eu"
					input-type="number"
				/>
			</div>
			<span
				class="mjw-tools-input-label"
				v-text="$i18n('mjw-tools-energy-unit-eu')"
			></span>
		</cdx-field>

		<cdx-field class="mjw-tools-energy-fieldset" :is-fieldset="true">
			<template #label>{{ $i18n('mjw-tools-energy-joule') }}</template>

			<div class="mjw-tools-input-field">
				<cdx-text-input
					class="mjw-tools-text-input mjw-tools-energy-text-input"
					v-model="energyJ"
					id="mjw-tools-energy-joule"
					input-type="number"
				/>
			</div>
			<span
				class="mjw-tools-input-label"
				v-text="$i18n('mjw-tools-energy-unit-joule')"
			></span>
		</cdx-field>

		<cdx-field class="mjw-tools-energy-fieldset" :is-fieldset="true">
			<template #label>{{ $i18n('mjw-tools-energy-rf') }}</template>

			<div class="mjw-tools-input-field">
				<cdx-text-input
					class="mjw-tools-text-input mjw-tools-energy-text-input"
					v-model="energyRF"
					id="mjw-tools-energy-rf"
					input-type="number"
				/>
			</div>
			<span
				class="mjw-tools-input-label"
				v-text="$i18n('mjw-tools-energy-unit-rf')"
			></span>
		</cdx-field>

		<cdx-field class="mjw-tools-energy-fieldset" :is-fieldset="true">
			<template #label>{{ $i18n('mjw-tools-energy-mj') }}</template>

			<div class="mjw-tools-input-field">
				<cdx-text-input
					class="mjw-tools-text-input mjw-tools-energy-text-input"
					v-model="energyMJ"
					id="mjw-tools-energy-mj"
					input-type="number"
				/>
			</div>
			<span
				class="mjw-tools-input-label"
				v-text="$i18n('mjw-tools-energy-unit-mj')"
			></span>
		</cdx-field>

		<span v-html="$i18n('mjw-tools-energy-description')"></span>
	</tool-field-base>
</template>

<style>
.mjw-tools-energy {
	.cdx-field {
		margin-top: 0;
	}

	.mjw-tools-energy .cdx-text-input {
		font-family: monospace;
		width: 84px;
	}

	.mjw-tools-energy-fieldset .cdx-field__control {
		display: flex;
		flex-direction: row;
		gap: 0.25rem;
		align-items: flex-end;
	}

	.mjw-tools-text-input {
		text-align: center;
		min-width: 4rem;
	}

	.mjw-tools-energy-text-input {
		width: 100%;
		resize: none;
	}

	.mjw-tools-input-label {
		min-width: 1.3rem;
		text-align: right;
	}

	.mjw-tools-input-field {
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		gap: 0.25rem;
	}
}
</style>
