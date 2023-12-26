import { createSignal } from "solid-js";
import SwivelProject from "../models/SwivelProject";
import { setCurrentFrameIndex } from "./app";

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
  setProjectFrames([...existingFrames, newFrame]);
  setCurrentFrameIndex(projectFrames().length - 1);
}