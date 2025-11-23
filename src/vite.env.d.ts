/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PORT: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_GOOGLE_AUTH_CLIENT_ID: string
    readonly VITE_THE_LAST_SPELLING_BEE_RE_CAPTCHA_KEY: string
    // Add other env variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  } 