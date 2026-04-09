import "../../init"
import * as Vue from "vue"
import mwCodex from "../../plugins/mwCodex"
import mwi18n from "../../plugins/mwi18n"

const { default: App } = await import("./App.vue")
const targetEl = document.querySelector("#app")!

const VueApp = Vue.createApp(App).use(mwi18n).use(mwCodex).mount(targetEl)
