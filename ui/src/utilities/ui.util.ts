import { JSX } from "solid-js";
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

interface IGlobalDialogOptions {
  title?: string;
  text?: string;
  onAffirmative?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  onNegative?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  onNeutral?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  delayMs?: number;
  skipAnimation?: boolean;
}
export const openGlobalDialog = async (
  options: IGlobalDialogOptions = {}
) => {
  if (options.delayMs)
    await new Promise(res => setTimeout(res, options.delayMs));
  globalState.ui.dialog.text = options.text || "";
  globalState.ui.dialog.title = options.title || "";
  globalState.ui.dialog.affirmativeCB = options.onAffirmative;
  globalState.ui.dialog.negativeCB = options.onNegative;
  globalState.ui.dialog.neutralCB = options.onNeutral;
  if (options.skipAnimation) {
    globalState.ui.dialog.isRendered = true;
    globalState.ui.dialog.isOpaque = true;
    return;
  }
  globalState.ui.dialog.isOpaque = false;
  await new Promise(res => setTimeout(res, 0));
  globalState.ui.dialog.isRendered = true;
  await new Promise(res => setTimeout(res, 0));
  globalState.ui.dialog.isOpaque = true;
  await new Promise(res => setTimeout(res, ANIMATION_LENGTH));
};

export const closeGlobalDialog = async (
  options: IGlobalDialogOptions = {}
) => {
  if (options.delayMs)
    await new Promise(res => setTimeout(res, options.delayMs));
  if (options.skipAnimation) {
    globalState.ui.dialog.isRendered = false;
    globalState.ui.dialog.isOpaque = false;
    return;
  }
  globalState.ui.dialog.isOpaque = false;
  await new Promise(res => setTimeout(res, ANIMATION_LENGTH));
  globalState.ui.dialog.isRendered = false;
  globalState.ui.dialog.title = "";
  globalState.ui.dialog.text = "";
  globalState.ui.dialog.affirmativeCB = undefined;
  globalState.ui.dialog.negativeCB = undefined;
  globalState.ui.dialog.neutralCB = undefined;
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