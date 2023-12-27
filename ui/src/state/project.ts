import { createSignal } from "solid-js";
import SwivelProject from "../models/SwivelProject";
import { setCurrentFrameIndex } from "./app";
import Frame from "../models/Frame";
import { getFramePreviewUrl } from "../utilities/canvas";

const defaultProject = new SwivelProject();

// Project Signals
export const [projectId] =
  createSignal(defaultProject.id);
export const [projectName, setProjectName] =
  createSignal(defaultProject.name);
export const [projectWidth, setProjectWidth] =
  createSignal(defaultProject.width);
export const [projectHeight, setProjectHeight] =
  createSignal(defaultProject.height);
export const [projectFrames, setProjectFrames] =
  createSignal(defaultProject.frames);
export const [projectFPS, setProjectFPS] =
  createSignal(defaultProject.fps);
export const [projectBackgroundColor, setProjectBackgroundColor] =
  createSignal(defaultProject.backgroundColor);
export const projectAspectRatio = () => projectWidth() / projectHeight();
export const addProjectFrame = () => {
  const existingFrames = projectFrames();
  const newFrame = existingFrames[existingFrames.length - 1].clone();
  newFrame.index = existingFrames.length;
  setProjectFrames([...existingFrames, newFrame]);
  setCurrentFrameIndex(projectFrames().length - 1);
}
export const updateProjectFrame = (index: number, updates: Partial<Frame>) => {
  const existingFrames = projectFrames();
  const newFrames = [...existingFrames];
  Object.assign(newFrames[index], updates);
  setProjectFrames(newFrames);
}
export const updateFramePreviews = async () => {
  const existingFrames = projectFrames();
  const newFrames = await Promise.all([...existingFrames].map(async (frame) => {
    frame.previewImage = getFramePreviewUrl(frame);

    return frame;
  }));
  setProjectFrames(newFrames);
}