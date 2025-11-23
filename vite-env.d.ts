/// <reference types="vite/client" />

interface Envs {
  readonly PORT: string;
}

interface ImportMetaEnv extends Envs {
  readonly VITE_PORT: string;
  readonly VITE_NODE_ENV: string;
  readonly VITE_GOOGLE_AUTH_CLIENT_ID: string;
  readonly VITE_THE_LAST_SPELLING_BEE_RE_CAPTCHA_KEY: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
}

 
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

 
declare namespace NodeJS {
  export type ProcessEnv = Envs
}
