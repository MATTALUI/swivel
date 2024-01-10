import projectState from "./project.state";
import animatorState from "./animator.state";

const globalState = {
  project: projectState,
  animator: animatorState,
};

const STATE_KEY = "state";

declare global {
  interface Window {
    [STATE_KEY]: typeof globalState,
  }
}

window[STATE_KEY] = globalState;

export default globalState;