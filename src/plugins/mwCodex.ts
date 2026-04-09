import * as Codex from '@wikimedia/codex'
import * as CodexIcons from "@wikimedia/codex-icons"
import type { App } from "vue"
import BannerPopup from '../tools/banner/BannerPopup.test.vue'
import FieldBaseTest from '../tools/FieldBase.test.vue'

export default function (app: App) {
    for (const [name, component] of Object.entries(Codex)) {
        if (name === "CdxTooltip") {

        } else if (name.startsWith('Cdx')) {
            app.component(name, component as any)
        }
    }

    for (const [name, component] of Object.entries(CodexIcons)) {
        if (name.startsWith('cdx')) {
            app.component(name, component as any)
        }
    }

    app.component("ToolFieldBase", FieldBaseTest)
    app.component("BannerPopup", BannerPopup)
}