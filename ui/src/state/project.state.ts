import { createSignal } from "solid-js";
import type { Frame } from "../types";
import { buildSwivelProject } from "../utilities/swivelProject.util";

const defaultProject = buildSwivelProject();

// Project Signals
const [id] =
  createSignal(defaultProject.id);
const [name, setName] =
  createSignal(defaultProject.name);
const [width, setWidth] =
  createSignal(defaultProject.width);
const [height, setHeight] =
  createSignal(defaultProject.height);
const [frames, setFrames] =
  createSignal(defaultProject.frames);
const [fps, setFPS] =
  createSignal(defaultProject.fps);
const [backgroundColor, setBackgroundColor] =
  createSignal(defaultProject.backgroundColor);
const [backgroundOpacity, setBackgroundOpacity] =
  createSignal(defaultProject.backgroundOpacity);

const projectState = {
  get id() { return id(); },
  get name() { return name(); },
  set name(newName: string) { setName(newName); },
  get width() { return width(); },
  set width(newWidth: number) { setWidth(newWidth); },
  get height() { return height(); },
  set height(newHeight: number) { setHeight(newHeight); },
  get frames() { return frames(); },
  set frames(newFrames: Frame[]) { setFrames(newFrames); },
  get fps() { return fps(); },
  set fps(newFPS: number) { setFPS(newFPS); },
  get backgroundColor() { return backgroundColor(); },
  set backgroundColor(bg: string) { setBackgroundColor(bg); },
  get backgroundOpacity() { return backgroundOpacity(); },
  set backgroundOpacity(op: number) { setBackgroundOpacity(op); },
  get aspectRatio() { return width() / height(); },
  get swivelProject() {
    const project = buildSwivelProject();

    project.id = id();
    project.name = name();
    project.width = width();
    project.height = height();
    project.frames = frames();
    project.fps = fps();
    project.backgroundColor = backgroundColor();
    project.backgroundOpacity = backgroundOpacity();

    return project;
  },
  reset: () => {
    const project = buildSwivelProject();
    setName(project.name);
    setWidth(project.width);
    setHeight(project.height);
    setFrames(project.frames);
    setFPS(project.fps);
    setBackgroundColor(project.backgroundColor);
  },
};

export default projectState;