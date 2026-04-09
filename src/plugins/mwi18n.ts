import type { App } from "vue"
import i18n from "../tools/i18n.json"

export default function (app: App) {
    app.config.globalProperties.$i18n = (key: string) => {
        if (i18n.ja[key]) {
            return i18n.ja[key]
        } else {
            return `〈${key}〉`
        }
    }
}
