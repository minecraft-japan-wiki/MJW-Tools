<script>
import { CdxButton, CdxIcon, CdxPopover } from "@wikimedia/codex"
import { defineComponent, ref, useSlots, useTemplateRef } from "vue"

export default defineComponent({
	name: "BannerPopup",
	components: {
		CdxButton,
		CdxIcon,
		CdxPopover,
	},
	props: {
		icon: {
			type: String,
			required: true,
		},
		type: {
			type: String, // 'warning' | 'error'
			required: true,
		},
	},
	setup(props) {
		const button = useTemplateRef("button")
		const popupOpen = ref(false)
		const slots = useSlots()

		return {
			icon: props.icon,
			type: props.type,
			button,
			popupOpen,
			slots,
		}
	},
})
</script>

<template>
	<cdx-button
		ref="button"
		weight="quiet"
		:aria-label="$i18n(`mjw-tools-banner-${type}`)"
		@click="popupOpen = !popupOpen"
	>
		<cdx-icon size="small" :icon="icon" :class="`${type}-icon`"></cdx-icon>
	</cdx-button>
	<cdx-popover
		v-model:open="popupOpen"
		:anchor="button"
		placement="top-start"
	>
		<slot></slot>
	</cdx-popover>
</template>

<style>
.cdx-icon.warning-icon {
	color: var(--color-warning);
}

.cdx-icon.error-icon {
	color: var(--color-error);
}
</style>
