<script>
/**
 * Tool/Time
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
console.log("[MJW Tools] Loaded component: time")
const { computed, ref, defineComponent } = require("vue")
const { CdxTextInput, CdxAccordion, CdxField } = require("@wikimedia/codex")
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
		CdxTextInput,
		CdxAccordion,
		CdxField,
		ToolFieldBase,
	},
	props: {},
	setup() {
		// tick
		const tps = ref(20)
		const mspt = computed({
			get: () => 1000 / tps.value,
			set: (value) => {
				if (Number.isNaN(value)) return
				tps.value = 1000 / value
			},
		})
		const gt = ref(0)

		// 1 gt = 1/20 second
		// 2 gt = 1 rt
		const rt = computed({
			get: () => gt.value / 2,
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value = value * 2
			},
		})

		// 24000 gt = 1 in-game day
		const inGameMillisecond = computed({
			get: () => Math.floor(((gt.value / tps.value) * 1000 * 72) % 1000),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value =
					gt.value +
					(((value - millisecond.value) / 1000) * tps.value) / 72
			},
		})

		const inGameSecond = computed({
			get: () => Math.floor(((gt.value / tps.value) * 72) % 60),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value =
					gt.value + ((value - inGameSecond.value) * tps.value) / 72
			},
		})

		const inGameMinute = computed({
			get: () => Math.floor(((gt.value / tps.value / 60) * 72) % 60),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value =
					gt.value +
					((value - inGameMinute.value) * tps.value * 60) / 72
			},
		})

		const inGameHour = computed({
			get: () => Math.floor(((gt.value / tps.value / 60 / 60) * 72) % 24),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value =
					gt.value +
					((value - inGameHour.value) * tps.value * 60 * 60) / 72
			},
		})

		const inGameDay = computed({
			get: () => Math.floor((gt.value / tps.value / 60 / 60 / 24) * 72),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value =
					gt.value +
					((value - inGameDay.value) * tps.value * 60 * 60 * 24) / 72
			},
		})

		// 1 gt = 1/20 second
		const millisecond = computed({
			get: () => Math.floor(((gt.value / tps.value) * 1000) % 1000),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value =
					gt.value + ((value - millisecond.value) / 1000) * tps.value
			},
		})

		const second = computed({
			get: () => Math.floor((gt.value / tps.value) % 60),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value = gt.value + (value - second.value) * tps.value
			},
		})

		const minute = computed({
			get: () => Math.floor((gt.value / tps.value / 60) % 60),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value = gt.value + (value - minute.value) * tps.value * 60
			},
		})

		const hour = computed({
			get: () => Math.floor((gt.value / tps.value / 60 / 60) % 24),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value = gt.value + (value - hour.value) * tps.value * 60 * 60
			},
		})

		const day = computed({
			get: () => Math.floor(gt.value / tps.value / 60 / 60 / 24),
			set: (value) => {
				if (Number.isNaN(value)) return
				gt.value =
					gt.value + (value - day.value) * tps.value * 60 * 60 * 24
			},
		})

		return {
			day,
			hour,
			minute,
			second,
			millisecond,
			inGameDay,
			inGameHour,
			inGameMinute,
			inGameSecond,
			inGameMillisecond,
			rt,
			gt,
			tps,
			mspt,
		}
	},
})
</script>

<template>
	<tool-field-base>
		<template #heading>{{ $i18n('mjw-tools-time-title') }}</template>

		<div class="mjw-tools-outer">
			<div class="mjw-tools-inner">
				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div class="mjw-tools-input-field">
						<cdx-text-input
							v-model="gt"
							class="mjw-tools-text-input"
							id="mjw-tools-time-gt"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-game-tick') }}
					</template>
				</cdx-field>

				<div style="height: 100%;">
					<div
						class="mjw-tools-input-symbol mjw-tools-mjw-tools-input-symbol-large"
					>
						=
					</div>
				</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div class="mjw-tools-input-field">
						<cdx-text-input
							v-model="rt"
							class="mjw-tools-text-input"
							id="mjw-tools-time-rt"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-redstone-tick') }}
					</template>
				</cdx-field>
			</div>
		</div>

		<cdx-accordion open>
			<template #title>{{ $i18n('mjw-tools-time-real-time') }}</template>

			<div class="mjw-tools-inner-item">
				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="day" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="day"
							class="mjw-tools-text-input"
							id="mjw-tools-time-rday"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-day') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">:</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="hour" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="hour"
							class="mjw-tools-text-input"
							id="mjw-tools-time-rhour"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-hour') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">:</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="minute" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="minute"
							class="mjw-tools-text-input"
							id="mjw-tools-time-rminute"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-minute') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">:</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="second" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="second"
							class="mjw-tools-text-input"
							id="mjw-tools-time-rsecond"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-second') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">.</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="millisecond" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="millisecond"
							class="mjw-tools-text-input"
							id="mjw-tools-time-rmillisecond"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-millisecond') }}
					</template>
				</cdx-field>
			</div>
		</cdx-accordion>

		<cdx-accordion open>
			<template #title
				>{{ $i18n('mjw-tools-time-ingame-time') }}</template
			>

			<div class="mjw-tools-inner-item">
				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="day" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="inGameDay"
							class="mjw-tools-text-input"
							id="mjw-tools-time-day"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-day') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">:</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="hour" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="inGameHour"
							class="mjw-tools-text-input"
							id="mjw-tools-time-hour"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-hour') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">:</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="minute" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="inGameMinute"
							class="mjw-tools-text-input"
							id="mjw-tools-time-minute"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-minute') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">:</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="second" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="inGameSecond"
							class="mjw-tools-text-input"
							id="mjw-tools-time-second"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-second') }}
					</template>
				</cdx-field>

				<div class="mjw-tools-input-symbol">.</div>

				<cdx-field
					class="mjw-tools-input-item"
					:is-fieldset="true"
					:hide-label="true"
				>
					<div id="millisecond" class="mjw-tools-input-field">
						<cdx-text-input
							v-model="inGameMillisecond"
							class="mjw-tools-text-input"
							id="mjw-tools-time-millisecond"
							input-type="number"
						/>
					</div>
					<template #help-text>
						{{ $i18n('mjw-tools-time-millisecond') }}
					</template>
				</cdx-field>
			</div>
		</cdx-accordion>

		<cdx-accordion>
			<template #title>{{ $i18n('mjw-tools-time-running-at') }}</template>

			<div class="mjw-tools-inner">
				<cdx-field :is-fieldset="true" :hide-label="true">
					<div class="mjw-tools-input-item">
						<div id="tps" class="mjw-tools-input-field">
							<cdx-text-input
								v-model="tps"
								class="mjw-tools-text-input"
								input-type="number"
								id="mjw-tools-time-tps"
								min="0"
							/>
						</div>
					</div>
					<span>{{ $i18n('mjw-tools-time-tps-unit') }}</span>
					<template #help-text>
						<span
							class="explain"
							:title="$i18n('mjw-tools-time-tps-description')"
							v-text="$i18n('mjw-tools-time-tps')"
						></span>
					</template>
				</cdx-field>

				<div style="height: 100%;">
					<div
						class="mjw-tools-input-symbol mjw-tools-mjw-tools-input-symbol-large"
					>
						=
					</div>
				</div>

				<cdx-field :is-fieldset="true" :hide-label="true">
					<div class="mjw-tools-input-item">
						<div id="tps" class="mjw-tools-input-field">
							<cdx-text-input
								v-model="mspt"
								class="mjw-tools-text-input"
								input-type="number"
								id="mjw-tools-time-mspt"
							/>
						</div>
					</div>
					<span>{{ $i18n('mjw-tools-time-mspt-unit') }}</span>
					<template #help-text>
						<span
							class="explain"
							:title="$i18n('mjw-tools-time-mspt-description')"
							v-text="$i18n('mjw-tools-time-mspt')"
						></span>
					</template>
				</cdx-field>
			</div>
		</cdx-accordion>
	</tool-field-base>
</template>

<style>
.mjw-tools-outer {
	display: flex;
	flex-wrap: wrap;
	flex-direction: column;
	gap: 0.5rem;
}

.mjw-tools-inner {
	display: flex;
	align-items: flex-start;
	gap: 0.25rem;
}

.mjw-tools-inner-item {
	display: flex;
	overflow-x: auto;
	overflow-y: hidden;
	align-items: center;
	gap: 0.25rem;
}

.mjw-tools-text-input {
	text-align: center;
	min-width: 4rem;
}

.mjw-tools-inner .cdx-field__control {
	display: flex;
	gap: 0.25rem;
	flex-direction: row;
}

.cdx-field {
	margin-top: 0;
}

.cdx-text-input {
	font-family: monospace;
	width: 84px;
	resize: horizontal;
}

.mjw-tools-input-symbol {
	font-family: monospace;
	vertical-align: text-bottom;
	height: 32px;
	line-height: 32px;
}

.mjw-tools-mjw-tools-input-symbol-large {
	font-size: 1.25rem;
	margin-right: 0.25rem;
	margin-left: 0.25rem;
}

.mjw-tools-input-field {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
