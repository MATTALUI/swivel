import globalState from "../state";

export const getCurrentFrame = () =>
  globalState.project.frames[globalState.animator.currentFrameIndex];