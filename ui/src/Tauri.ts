// We'll need to investigate whether or not there's a library with this type
// predefined somewhere, but for now we'll just stub out the parts that we use.
interface ITauri {
  event: {
    listen: (event: string, fn: Function) => void;
  },
  tauri: {
    invoke: <T = void, D = any>(eventName: string, data?: D) => Promise<T>;
  },
};

declare global {
  interface Window {
    __TAURI__: ITauri | undefined;
  }
}

export default window.__TAURI__ || null;