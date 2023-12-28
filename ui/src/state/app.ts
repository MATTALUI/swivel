import { createSignal } from "solid-js";
import { projectFrames } from "./project";
import AnimationObject from "../models/AnimationObject";

export const [currentFrameIndex, setCurrentFrameIndex] = createSignal(0);
export const [isPlaying, setIsPlaying] = createSignal(false);
export const [lastFrameTime, setLastFrameTime] = createSignal<Date | null>(null);
export const [selectedObjects, setSelectedObjects] = createSignal<AnimationObject[]>([]);
export const currentFrame = () => projectFrames()[currentFrameIndex()];