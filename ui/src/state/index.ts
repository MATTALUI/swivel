import projectState from "./project.state";

const globalState = {
  project: projectState,
};

const STATE_KEY = "state";

declare global {
  interface Window {
    [STATE_KEY]: typeof globalState,
  }
}

window[STATE_KEY] = globalState;

export default globalState;