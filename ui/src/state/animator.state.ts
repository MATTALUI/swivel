import { createResource, createSignal } from "solid-js";
import Tauri from "../Tauri";
import type { SerializablePrefabAnimationObject } from "../types";

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

const [currentFrameIndex, setCurrentFrameIndex] = createSignal(0, { equals: false });
const [isPlaying, setIsPlaying] = createSignal(false);
const [lastFrameTime, setLastFrameTime] = createSignal<Date | null>(null);
const [selectedObjects, setSelectedObjects] = createSignal<Selectable | null>(null);
const [canvasMode, setCanvasMode] = createSignal(CanvasMode.ANIMATOR);
export const deselectObjects = (e?: Event) => {
  e?.preventDefault();
  setSelectedObjects(null);
};

const [savedObjects, { refetch: refetchSavedObjects }] = createResource(
  async (): Promise<SerializablePrefabAnimationObject[]> => {
    if (!Tauri) {
      // Add a web service call here
      return [];
    }
    const { invoke } = Tauri.tauri;
    const prefabs = await invoke<SerializablePrefabAnimationObject[]>("load_prefab_objects");//TauriServerFunctions.LOAD_PREFABS);

    return prefabs;
  }
);

const baseAnimatorState = {
  get currentFrameIndex() { return currentFrameIndex(); },
  set currentFrameIndex(index: number) { setCurrentFrameIndex(index); },
  get isPlaying() { return isPlaying(); },
  set isPlaying(playing: boolean) { setIsPlaying(playing); },
  get lastFrameTime() { return lastFrameTime(); },
  set lastFrameTime(lt: Date | null) { setLastFrameTime(lt); },
  get selectedObjects() { return selectedObjects(); },
  set selectedObjects(so: Selectable | null) { setSelectedObjects(so); },
  get canvasMode() { return canvasMode(); },
  set canvasMode(cm: CanvasMode) { setCanvasMode(cm); },
  get savedObjects() { return savedObjects(); },
  refetchSavedObjects,
  reset: () => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setLastFrameTime(null);
    setSelectedObjects(null);
  }
};
export default baseAnimatorState;