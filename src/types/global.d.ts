export {};

declare global {
  interface Window {
    __TAURI__?: any;
    __TAURI_INTERNALS__?: any;
  }
}
