<template>
	<div class="mjw-tools-field-base">
		<h2 v-if="slots.heading" class="cdx-label mjw-tools-label-heading">
			<span class="cdx-label__label__text">
				<slot name="heading">Tool</slot>
			</span>
		</h2>

		<slot></slot>
	</div>
</template>

<script>
const { useSlots, defineComponent } = require("vue")

module.exports = defineComponent({
	name: "ToolFieldBase",
	setup() {
		const slots = useSlots()
		return {
			slots,
		}
	},
})
</script>

<style>
.mjw-tools-field-base {
	border-radius: 4px;
	border: 1px solid #ccc;
	padding: 1em;
}

.dark .mjw-tools-field-base {
	border-color: #595959;
}

.mjw-tools-label-heading {
	margin: 0;
	font-size: 1.125rem;
}
</style>
