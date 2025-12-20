import { ManifestV3Export, crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import { defineConfig } from 'vite'

import manifest from './manifest.json'
import pkg from './package.json'

const root = resolve(__dirname, 'src')
const pagesDir = resolve(root, 'pages')
const popupDir = resolve(root, 'pages/popup')
const utilsDir = resolve(root, 'utils')
const outDir = resolve(__dirname, 'dist')
const publicDir = resolve(__dirname, 'public')

const isDev = process.env.NODE_ENV === 'development'

function extractSemanticVersion(version: string): string | null {
    const match = version.match(/(\d+\.\d+\.\d+)/)
    return match ? match[0] : null
}

const extensionManifest = {
    ...manifest,
    name: isDev ? `DEV: ${manifest.name}` : manifest.name,
    version: extractSemanticVersion(pkg.version),
    version_name: pkg.version,
}

export default defineConfig({
    resolve: {
        alias: {
            '@src': root,
            '@pages': pagesDir,
            '@popup': popupDir,
            '@utils': utilsDir,
        },
    },
    plugins: [
        crx({
            manifest: extensionManifest as ManifestV3Export,
            contentScripts: {
                injectCss: true,
            },
        }),
    ],
    publicDir,
    build: {
        outDir,
        sourcemap: isDev,
        emptyOutDir: !isDev,
        rollupOptions: {
            onwarn(warning, warn) {
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return
                }
                if (warning.code === 'SOURCEMAP_ERROR') {
                    return
                }
                warn(warning)
            },
        },
    },
    define: {
        APP_VERSION: JSON.stringify(`v${pkg.version}`),
        ASSET_NAME: JSON.stringify('unofficial-flex-extension.zip'),
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
        cors: true,
    },
})
