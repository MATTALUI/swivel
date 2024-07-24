import { JSX, createSignal } from "solid-js";
import type {
  CursorOption,
  MouseDownValues,
  ObjectNode,
} from "../types";

type OptionalCallback =
  JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> | undefined;

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

// This pattern is the same as the full screen loader, but for the dialog and
// its infomation
const [isDialogRendered, setIsDialogRendered] = createSignal(false);
const [isDialogOpaque, setIsDialogOpaque] = createSignal(false);
const [dialogTitle, setDialogTitle] = createSignal("Attention");
const [dialogText, setDialogText] =
  createSignal("I Hope you're having a great day");
const [dialogAffirmativeCB, setDialogAffirmativeDB] =
  createSignal<OptionalCallback>(undefined);
const [dialogNegativeCB, setDialogNegativeDB] =
  createSignal<OptionalCallback>(undefined);
const [dialogNeutralCB, setDialogNeutralDB] =
  createSignal<OptionalCallback>(undefined);

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
  },
  dialog: {
    get isRendered() { return isDialogRendered(); },
    set isRendered(r) { setIsDialogRendered(r); },
    get isOpaque() { return isDialogOpaque(); },
    set isOpaque(o) { setIsDialogOpaque(o); },
    get title() { return dialogTitle(); },
    set title(t) { setDialogTitle(t); },
    get text() { return dialogText(); },
    set text(t) { setDialogText(t); },
    get affirmativeCB() { return dialogAffirmativeCB(); },
    set affirmativeCB(cb) { setDialogAffirmativeDB(() => cb); },
    get negativeCB() { return dialogNegativeCB(); },
    set negativeCB(cb) { setDialogNegativeDB(() => cb); },
    get neutralCB() { return dialogNeutralCB(); },
    set neutralCB(cb) { setDialogNeutralDB(() => cb); },
    get hasCBRegistered() {
      return !!dialogAffirmativeCB() ||
        !!dialogNegativeCB() ||
        !!dialogNeutralCB();
    },
  },
};
export default uiState;