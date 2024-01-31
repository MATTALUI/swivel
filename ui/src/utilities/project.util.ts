import type Frame from "../models/Frame";
import APIService from "../services";
import globalState from "../state";
import { getFramePreviewUrl } from "./canvas.util";
import { startFullscreenLoading, stopFullscreenLoading } from "./ui.util";

export const addFrame = () => {
  const existingFrames = globalState.project.frames;
  const newFrame = existingFrames[existingFrames.length - 1].clone();
  newFrame.index = existingFrames.length;
  globalState.project.frames = [...existingFrames, newFrame];
  globalState.animator.currentFrameIndex = globalState.project.frames.length - 1;
};

export const updateFrame = (index: number, updates: Partial<Frame> = {}) => {
  const frame = globalState.project.frames[index];
  Object.assign(frame, updates);
  if ("previewImage" in updates) return;
  const previewImage = updates.previewImage ?? getFramePreviewUrl(frame);
  frame.previewImage = previewImage;
  const imgEle = document.querySelector<HTMLImageElement>(`[data-frame-preview="${index}"]`);
  if (imgEle) imgEle.src = previewImage;
};

export const updateFramePreviews = async () => {
  const existingFrames = globalState.project.frames;
  const newFrames = await Promise.all([...existingFrames].map(async (frame) => {
    frame.previewImage = getFramePreviewUrl(frame);

    return frame;
  }));
  globalState.project.frames = newFrames;
};

export const saveProject = async () => {
  startFullscreenLoading({ message: "Saving" });
  await new Promise(res => setTimeout(res, 1000));
  const project = globalState.project.swivelProject;
  await APIService.saveProject(project);
  stopFullscreenLoading();
};

export const restartProject = async () => {
  startFullscreenLoading({ message: "Setting Up New Project" });
  await new Promise(res => setTimeout(res, 1000));
  globalState.animator.reset();
  globalState.project.reset();
  stopFullscreenLoading();
};

export const exportProject = async () => {
  startFullscreenLoading({ message: "Exporting" });
  await new Promise(res => setTimeout(res, 1000));
  const project = globalState.project.swivelProject;
  await APIService.exportProject(project);
  stopFullscreenLoading();
};
