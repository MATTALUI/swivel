import { createResource, createSignal } from "solid-js";
import Tauri from "../Tauri";
import {
  type SerializablePrefabAnimationObject,
  type Selectable,
  TauriServerFunctions,
  ObjectNodeTypes,
} from "../types";

const builtinPrefabs: SerializablePrefabAnimationObject[] = [
  {
    id: crypto.randomUUID(),
    name: "Dino Party",
    previewImage: "/dino.png",
    object: {
      id: crypto.randomUUID(),
      root: {
        id: crypto.randomUUID(),
        position: { x: 0, y: 0.21875 },
        size: 5,
        children: [{
          id: crypto.randomUUID(),
          image: "default-dino",
          type: ObjectNodeTypes.IMAGE,
          children: [],
          size: 5,
          position: { x: 1, y: 0.78125 },
        }],
        type: ObjectNodeTypes.ROOT,
      }
    },
    createdAt: new Date(1).toString(),
  },
  {
    id: crypto.randomUUID(),
    name: "Swivel Logo",
    previewImage: "/original.png",
    object: {
      id: crypto.randomUUID(),
      root: {
        id: crypto.randomUUID(),
        position: { x: 0, y: 0 },
        size: 5,
        children: [{
          id: crypto.randomUUID(),
          image: "default-logo",
          type: ObjectNodeTypes.IMAGE,
          children: [],
          size: 5,
          position: { x: 1, y: 1 },
        }],
        type: ObjectNodeTypes.ROOT,
      }
    },
    createdAt: new Date(1).toString(),
  },
];

const [currentFrameIndex, setCurrentFrameIndex] = createSignal(0, { equals: false });
const [isPlaying, setIsPlaying] = createSignal(false);
const [lastFrameTime, setLastFrameTime] = createSignal<Date | null>(null);
const [selectedObjects, setSelectedObjects] = createSignal<Selectable | null>(null);
const [savedObjects, { refetch: refetchSavedObjects }] = createResource(
  async (): Promise<SerializablePrefabAnimationObject[]> => {
    let prefabs: SerializablePrefabAnimationObject[] = [];
    if (!Tauri) {
      // Add a web service call here
    } else {
      const { invoke } = Tauri.tauri;
      prefabs = await invoke<SerializablePrefabAnimationObject[]>(TauriServerFunctions.LOAD_PREFABS);
    }
    prefabs = prefabs.concat(builtinPrefabs);

    return prefabs.sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
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