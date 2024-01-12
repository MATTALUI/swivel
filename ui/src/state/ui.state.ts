import { createSignal } from "solid-js";
import ObjectNode from "../models/ObjectNode";
import type { CursorOption, MouseDownValues } from "../types";

export const [canvasCursor, setCanvasCursor] =
  createSignal<CursorOption>(null);
// This signal will be used to control the actual rendering of the full screen
// loader to the DOM. If it is true then the elements will be added to the page.
const [isFullscreenLoaderRendered, setIsFullscreenLoaderRendered] = createSignal(true);
// This signal will control whether or not the loader is visible when rendered.
// When true it will have full opacity and overlay all other elements. This
// separation of state allows finer-grained configuration for the animations
const [isFullscreenLoaderOpaque, setIsFullscreenLoaderOpaque] = createSignal(true);
// An optional message to show in the fullscreen loader to display
const [fullscreenLoadingMessage, setFullscreenLoadingMessage] =
  createSignal("Initializing");

const [selectedNode, setSelectedNode] =
  createSignal<ObjectNode | null>(null);
const [targetNode, setTargetNode] =
  createSignal<ObjectNode | null>(null);
const [mouseDownInitialValues, setMouseDownInitialValues] =
  createSignal<MouseDownValues | null>(null);

const uiState = {
  get cursor() { return canvasCursor(); },
  set cursor(c) { setCanvasCursor(c); },
  canvas: {
    get selectedNode() { return selectedNode(); },
    set selectedNode(n) { setSelectedNode(n); },
    get targetNode() { return targetNode(); },
    set targetNode(n) { setTargetNode(n); },
    get mouseDownInitialValues() { return mouseDownInitialValues(); },
    set mouseDownInitialValues(v) { setMouseDownInitialValues(v); },
  },
  loader: {
    get isRendered() { return isFullscreenLoaderRendered(); },
    set isRendered(r) { setIsFullscreenLoaderRendered(r); },
    get isOpaque() { return isFullscreenLoaderOpaque(); },
    set isOpaque(o) { setIsFullscreenLoaderOpaque(o); },
    get message() { return fullscreenLoadingMessage(); },
    set message(m) { setFullscreenLoadingMessage(m); },
  }
};
export default uiState;