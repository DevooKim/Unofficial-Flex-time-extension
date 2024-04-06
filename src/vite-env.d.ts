/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GITHUB_OWNER: string
    readonly VITE_GITHUB_REPO: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare const APP_VERSION: string
declare const ASSET_NAME: string
