import { createResource, createSignal } from "solid-js";
import { loadSwivelObjects } from "../utilities/tauri";
import projectState from "./project.state";

export enum CanvasMode {
  ANIMATOR = "ANIMATOR",
  OBJECT_CREATOR = "OBJECT_CREATOR",
}
export enum SelectionType {
  FRAME = "frame",
  ANIMATION_OBJECT = "animationObject",
}
type Selectable =
  { type: SelectionType.FRAME, objectIds: string[] } |
  { type: SelectionType.ANIMATION_OBJECT, objectIds: string[] };

export const [currentFrameIndex, setCurrentFrameIndex] = createSignal(0, { equals: false });
export const [isPlaying, setIsPlaying] = createSignal(false);
export const [lastFrameTime, setLastFrameTime] = createSignal<Date | null>(null);
export const [selectedObjects, setSelectedObjects] = createSignal<Selectable | null>(null);
export const [canvasMode, setCanvasMode] = createSignal(CanvasMode.ANIMATOR);
export const currentFrame = () => projectState.frames[currentFrameIndex()];
export const deselectObjects = (e?: Event) => {
  e?.preventDefault();
  setSelectedObjects(null);
};
export const [savedObjects, { refetch: refetchSavedObjects }] = createResource(loadSwivelObjects);
export const resetAppState = () => {
  // Reset App State
  setCurrentFrameIndex(0);
  setIsPlaying(false);
  setLastFrameTime(null);
  setSelectedObjects(null);
};
