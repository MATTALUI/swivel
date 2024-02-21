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

export const shortPollUntil = (fn: () => boolean, intervalMS = 250, attempts = 20): Promise<void> => {
  let attempt = 0;
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      let success = false;
      try {
        success = fn();
      } catch (e) {
        console.error(e);
      }
      if (success) {
        clearInterval(interval);
        resolve();
      } else {
        attempt++;
        if (attempt > attempts) {
          clearInterval(interval);
          reject("shortPollUntil hit max attempts");
        }
      }
    }, intervalMS);
  });
};