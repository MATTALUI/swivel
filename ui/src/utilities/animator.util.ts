import globalState from "../state";

export const getCurrentFrame = () =>
  globalState.project.frames[globalState.animator.currentFrameIndex];

export const deselectObjects = (e?: Event) => {
  e?.preventDefault();
  globalState.animator.selectedObjects = null;
};