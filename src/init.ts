import * as Codex from "@wikimedia/codex"
import * as CodexIcons from "@wikimedia/codex-icons"
import * as THREEjs from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Vue from "vue"
import BannerPopup from "./tools/banner/BannerPopup.test.vue"
import FieldBase from "./tools/FieldBase.test.vue"
import i18n from "./tools/i18n.json"
import "./common.css"
import "./sprite.css"

window.require = (mod) => {
    const registry = {
        vue: Vue,
        "@wikimedia/codex": Codex,
        "@wikimedia/codex-icons": CodexIcons,
        "./FieldBase.vue": FieldBase,
        "./BannerPopup.vue": BannerPopup,
        "./i18n.json": i18n,
        "../icons.json": CodexIcons
    }
    if (!(mod in registry)) {
        throw new Error(`[require shim] Unknown module: ${mod}`)
    }
    return registry[mod]
}

class MWMessage {
    map: string
    key?: string
    parameters?: any[]

    constructor(map: string, key?: string, parameters?: any[]) {
        this.map = map;
        this.key = key;
        this.parameters = parameters || [];
    }

    text(): string {
        const lang = window.mw.config.get("wgUserLanguage")
        if (i18n.ja[this.map]) {
            return i18n.ja[this.map]
        } else {
            return this.key ?? `〈${this.map}〉`
        }
    }
}

class MWApi {
    private url = "/api"

    constructor(options?: any) { }

    async get(_parameters: Record<string, string>) {
        const parameters = {
            ..._parameters,
            format: "json",
            formatversion: "2",
        }

        const urlparams = new URLSearchParams(parameters)

        return fetch(`${this.url}?${urlparams.toString()}`, {
            method: "GET",
            mode: "cors",
            credentials: 'omit'
        }).then((v) => {
            return v.json()
        })
    }
}

window.mw = {
    config: {
        get: (key: any) => {
            const config = {
                wgUserLanguage: "ja",
            }
            return config[key] ?? null
        },
    },
    messages: {
        _store: {},
        set(messages: any) {
            Object.assign(this._store, messages)
        },
    },
    Message: MWMessage,
    message(key: string): MWMessage {
        return new MWMessage(key)
    },

    Api: MWApi
}

window.THREE = THREEjs
//window.THREE.OrbitControls = OrbitControls

// module
window.module = { exports: {} }