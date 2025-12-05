export {};

declare global {
  interface Window {
    google?: {
      maps: typeof google.maps;
    };
  }
}

