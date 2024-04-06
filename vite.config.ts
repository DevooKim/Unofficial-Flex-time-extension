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

const extensionManifest = {
    ...manifest,
    name: isDev ? `DEV: ${manifest.name}` : manifest.name,
    version: pkg.version,
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
    },
    define: {
        APP_VERSION: JSON.stringify(pkg.version),
        ASSET_NAME: 'unofficial-flex-extension.zip',
    },
})
