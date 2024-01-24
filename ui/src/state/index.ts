import { createSignal } from "solid-js";

import projectState from "./project.state";
import animatorState from "./animator.state";
import creatorState from "./creator.state";
import uiState from "./ui.state";
import mediaResourceState from "./mediaResources.state";

import { CanvasMode } from "../types";

const [canvasMode, setCanvasMode] = createSignal(CanvasMode.ANIMATOR);

const globalState = {
  get canvasMode() { return canvasMode(); },
  set canvasMode(cm: CanvasMode) { setCanvasMode(cm); },
  project: projectState,
  animator: animatorState,
  creator: creatorState,
  ui: uiState,
  mediaResources: mediaResourceState,
};

const STATE_KEY = "state";

declare global {
  interface Window {
    [STATE_KEY]: typeof globalState | undefined,
  }
}

if (import.meta.env.DEV) {
  window[STATE_KEY] = globalState;
}


export default globalState;