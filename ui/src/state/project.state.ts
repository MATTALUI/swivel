import { createSignal } from "solid-js";
import SwivelProject from "../models/SwivelProject";
import { setCurrentFrameIndex } from "./app";
import Frame from "../models/Frame";
import { getFramePreviewUrl } from "../utilities/canvas";

const defaultProject = new SwivelProject();

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
  get aspectRatio() { return width() / height(); },
  get swivelProject() {
    const project = new SwivelProject();

    project.id = id();
    project.name = name();
    project.width = width();
    project.height = height();
    project.frames = frames();
    project.fps = fps();
    project.backgroundColor = backgroundColor();

    return project;
  },
  addFrame: () => {
    const existingFrames = frames();
    const newFrame = existingFrames[existingFrames.length - 1].clone();
    newFrame.index = existingFrames.length;
    setFrames([...existingFrames, newFrame]);
    setCurrentFrameIndex(frames().length - 1);
  },
  updateFrame: (index: number, updates: Partial<Frame> = {}) => {
    const frame = frames()[index];
    Object.assign(frame, updates);
    if ("previewImage" in updates) return;
    const previewImage = updates.previewImage ?? getFramePreviewUrl(frame);
    frame.previewImage = previewImage;
    const imgEle = document.querySelector<HTMLImageElement>(`[data-frame-preview="${index}"]`);
    if (imgEle) imgEle.src = previewImage;
  },
  updateFramePreviews: async () => {
    const existingFrames = frames();
    const newFrames = await Promise.all([...existingFrames].map(async (frame) => {
      frame.previewImage = getFramePreviewUrl(frame);

      return frame;
    }));
    setFrames(newFrames);
  },
  reset: () => {
    const project = new SwivelProject();
    setName(project.name);
    setWidth(project.width);
    setHeight(project.height);
    setFrames(project.frames);
    setFPS(project.fps);
    setBackgroundColor(project.backgroundColor);
  },
};

export default projectState;