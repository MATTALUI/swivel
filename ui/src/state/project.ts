import { createSignal } from "solid-js";
import SwivelProject from "../models/SwivelProject";

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