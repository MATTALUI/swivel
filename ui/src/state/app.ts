import { createSignal } from "solid-js";
import { projectFrames } from "./project";
import Frame from "../models/Frame";
import AnimationObject from "../models/AnimationObject";

export enum SelectionType {
  FRAME = "frame",
  ANIMATION_OBJECT = "animationObject",
}
type Selectable =
  { type: SelectionType.FRAME, objects: Frame[] } |
  { type: SelectionType.ANIMATION_OBJECT, objects: AnimationObject[] };

export const [currentFrameIndex, setCurrentFrameIndex] = createSignal(0);
export const [isPlaying, setIsPlaying] = createSignal(false);
export const [lastFrameTime, setLastFrameTime] = createSignal<Date | null>(null);
export const [selectedObjects, setSelectedObjects] = createSignal<Selectable | null>(null);
export const currentFrame = () => projectFrames()[currentFrameIndex()];
export const deselectObjects = (e?: Event) => {
  e?.preventDefault();
  setSelectedObjects(null);
}
