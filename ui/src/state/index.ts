import { createSignal } from "solid-js";
import projectState from "./project.state";
import animatorState from "./animator.state";
import creatorState from "./creator.state";
import { CanvasMode } from "../types";

const [canvasMode, setCanvasMode] = createSignal(CanvasMode.ANIMATOR);

const globalState = {
  get canvasMode() { return canvasMode(); },
  set canvasMode(cm: CanvasMode) { setCanvasMode(cm); },
  project: projectState,
  animator: animatorState,
  creator: creatorState,
};

const STATE_KEY = "state";

declare global {
  interface Window {
    [STATE_KEY]: typeof globalState,
  }
}

window[STATE_KEY] = globalState;

export default globalState;