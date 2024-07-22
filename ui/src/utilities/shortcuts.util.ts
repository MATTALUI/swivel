type Shortcuts = Record<string, ((e: KeyboardEvent) => void)[]>;
const shortcutRegistry: Shortcuts = {
};

const dispatchKeyboardShortcuts = (event: KeyboardEvent) => {
  const target = event.target as Element | null;
  if (
    [
      "INPUT",
    ].includes(target?.nodeName.toUpperCase() || "")
  ) return;
  let key = event.key.replace("Key", "").toUpperCase();
  if (key === " ") key = "SPACE";
  if (key === "META" || key === "SHIFT") key = "";
  const keyData = [key];
  if (event.shiftKey) keyData.unshift("SHIFT");
  if (event.metaKey) keyData.unshift("META");
  const keyString = keyData.filter(v => !!v).join("+").toUpperCase();
  const handlers = shortcutRegistry[keyString];
  if (handlers && handlers.length) {
    event.preventDefault();
    event.stopPropagation();
    handlers.forEach(h => h(event));
  }
};

export const registerKeyboardShortcuts = (shortcuts: Shortcuts) => {
  Object.entries(shortcuts).forEach(([shortcutKey, handlers]) => {
    if (!shortcutRegistry[shortcutKey]) shortcutRegistry[shortcutKey] = [];
    shortcutRegistry[shortcutKey] =
      shortcutRegistry[shortcutKey].concat(handlers);
  });
};

export const unregisterKeyboardShortcuts = (shortcuts: Shortcuts) => {
  Object.entries(shortcuts).forEach(([shortcutKey, handlers]) => {
    if (!shortcutRegistry[shortcutKey]) return;
    shortcutRegistry[shortcutKey] =
      shortcutRegistry[shortcutKey].filter(h => !handlers.includes(h));
  });
};

export const listenForKeyboardShortcuts = () => {
  document.addEventListener("keydown", dispatchKeyboardShortcuts);
};
