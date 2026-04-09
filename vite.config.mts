import { fileURLToPath } from 'node:url'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import vue from "@vitejs/plugin-vue"
import { globSync } from 'glob'
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig } from "vite"
import vueDevTools from 'vite-plugin-vue-devtools'

function cjsModuleShimPlugin() {
	return {
		name: 'cjs-module-shim',
		enforce: 'pre' as const,
		transform(code: any, id: any) {
			if (!id.endsWith('.vue')) return
			if (!code.includes('module.exports')) return

			// module.exports = を削除するだけ（export default への置換はしない）
			const result = code.replace(
				/module\.exports\s*=\s*defineComponent\s*\(/,
				'export default defineComponent('
			)
			console.log('[cjs-shim] transformed:', id)
			return {
				code: result
			}
		}
	}
}

const input = globSync('./src/tools/*/index.html', {
	posix: true,
})
	.map((path) => `./${path}`)
	.reduce((acc, path) => {
		const key = path.match(/src\/tools\/(.+)\/index\.html/)![1]
		acc[key] = path
		return acc
	}, {})

export default defineConfig(({ command }) => {
	return {
		root: fileURLToPath(new URL('./src', import.meta.url)),
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
				'./FieldBase.vue': fileURLToPath(new URL('./src/tools/FieldBase.test.vue', import.meta.url)),
				'./BannerPopup.vue': fileURLToPath(new URL('./src/tools/banner/BannerPopup.test.vue', import.meta.url)),
				'./i18n.json': fileURLToPath(new URL('./src/i18n.json', import.meta.url)),
			},
		},

		css: {
			preprocessorOptions: {
				less: {
					strictUnits: true,
				},
			},
		},

		build: {
			outDir: './dist',
			emptyOutDir: true,
			sourcemap: 'hidden',
			lib: {
				entry: 'src/index.ts',
				formats: ['cjs'],
			},
			minify: false, // Let MediaWiki do its job
			target: ['es2017'],
			rollupOptions: {
				input,
			},
			commonjsOptions: {
				transformMixedEsModules: true, // ESM/CJS混在を許可
				include: [/\.vue$/, /node_modules/]
			}
		},
		server: {
			port: process.env.VITEST ? 50179 : undefined,
			proxy: {
				'/api': {
					target: 'https://minecraftjapan.miraheze.org/w/api.php',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				}
			}
		},

		plugins: [
			cjsModuleShimPlugin(),
			vue(),
			vueDevTools(),
			visualizer(),
		],
	};
});
