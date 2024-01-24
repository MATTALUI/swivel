import globalState from "../state";

interface IFullscreenLoadingOptions {
  message?: string;
  skipAnimation?: boolean;
  delayMs?: number;
}
const ANIMATION_LENGTH = 250;
export const startFullscreenLoading = async (
  options: IFullscreenLoadingOptions = {}
) => {
  if (options.delayMs)
    await new Promise(res => setTimeout(res, options.delayMs));
  globalState.ui.loader.message = options.message || "";
  if (options.skipAnimation) {
    globalState.ui.loader.isRendered = true;
    globalState.ui.loader.isOpaque = true;
    return;
  }
  globalState.ui.loader.isOpaque = false;
  await new Promise(res => setTimeout(res, 0));
  globalState.ui.loader.isRendered = true;
  await new Promise(res => setTimeout(res, 0));
  globalState.ui.loader.isOpaque = true;
  await new Promise(res => setTimeout(res, ANIMATION_LENGTH));
};

export const stopFullscreenLoading = async (
  options: IFullscreenLoadingOptions = {}
) => {
  if (options.delayMs)
    await new Promise(res => setTimeout(res, options.delayMs));
  if (options.skipAnimation) {
    globalState.ui.loader.isRendered = false;
    globalState.ui.loader.isOpaque = false;
    return;
  }
  globalState.ui.loader.isOpaque = false;
  await new Promise(res => setTimeout(res, ANIMATION_LENGTH));
  globalState.ui.loader.isRendered = false;
};

export const shortPollUntil = (fn: () => boolean, intervalMS = 250): Promise<void> => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (fn()) {
        clearInterval(interval);
        resolve();
      }
    }, intervalMS);
  });
};