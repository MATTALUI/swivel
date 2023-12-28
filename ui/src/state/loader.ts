import { createSignal } from "solid-js";

// This signal will be used to control the actual rendering of the full screen
// loader to the DOM. If it is true then the elements will be added to the page.
const [_isFullscreenLoading, _setIsFullscreenLoading] = createSignal(true);
// This signal will control whether or not the loader is visible when rendered.
// When true it will have full opacity and overlay all other elements. This
// separation of state allows finer-grained configuration for the animations
const [_isFullscreenLoadingOpaque, _setIsFullscreenLoadingOpaque] = createSignal(true);
// An optional message to show in the fullscreen loader to display
const [_fullscreenLoadingMessage, _setFullscreenLoadingMessage] =
  createSignal("Initializing");

// The Acessors can safely be exported as-is
export const isFullscreenLoading = _isFullscreenLoading;
export const isFullscreenLoadingOpaque = _isFullscreenLoadingOpaque;
export const fullscreenLoadingMessage = _fullscreenLoadingMessage;

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
  _setFullscreenLoadingMessage(options.message || "");
  if (options.skipAnimation) {
    _setIsFullscreenLoading(true);
    _setIsFullscreenLoadingOpaque(true);
    return;
  }
  _setIsFullscreenLoadingOpaque(false);
  await new Promise(res => setTimeout(res, 0));
  _setIsFullscreenLoading(true);
  await new Promise(res => setTimeout(res, 0));
  _setIsFullscreenLoadingOpaque(true);
  await new Promise(res => setTimeout(res, ANIMATION_LENGTH));
}

export const stopFullscreenLoading = async (
  options: IFullscreenLoadingOptions = {}
) => {
  if (options.delayMs)
    await new Promise(res => setTimeout(res, options.delayMs));
  if (options.skipAnimation) {
    _setIsFullscreenLoading(false);
    _setIsFullscreenLoadingOpaque(false);
    return;
  }
  _setIsFullscreenLoadingOpaque(false);
  await new Promise(res => setTimeout(res, ANIMATION_LENGTH));
  _setIsFullscreenLoading(false);
}