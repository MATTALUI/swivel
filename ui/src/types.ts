import ObjectNode from "./models/ObjectNode";

// These can be anything from the CSS options for cursor, but you'll ahve to opt-in
// https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
export const ErasorCursor = "url('erasor.svg'), auto";
export type CursorOption =
  "grab" |
  "grabbing" |
  "crosshair" |
  "none" |
  "auto" |
  "cell" |
  "not-allowed" |
  "url('erasor.svg'), auto" |
  null;

export type MouseDownValues = {
  x: number;
  y: number;
  originalParentNode: ObjectNode | null;
  originalNodeRoot: ObjectNode;
  originalNode: ObjectNode;
}

export type SerializableVec2 = {
  x: number;
  y: number;
}

export type SerializableObjectNode = {
  id: string;
  position: SerializableVec2;
  size: number;
  children: SerializableObjectNode[];
};

export type SerializableAnimationObject = {
  id: string;
  root: SerializableObjectNode;
};

export type SerializablePrefabAnimationObject = {
  id: string;
  name: string;
  previewImage: string;
  object: SerializableAnimationObject;
  createdAt: string;
}

export type SerializableMediaResource = {
  type: MediaResourceType;
}

export enum CreatorToolNames {
  SELECT = "SELECT",
  ADD = "ADD",
  GROUP = "GROUP",
  ERASE = "ERASE",
}

export enum TauriClientEvents {
  SWITCH_TOOLS = "SWIVEL::SWITCH_TOOLS",
  SAVE = "SWIVEL::INIT_SAVE",
  NEW = "SWIVEL::INIT_NEW",
  EXPORT = "SWIVEL::INIT_EXPORT",
}

export enum TauriServerFunctions {
  SAVE = "save_project",
  SAVE_PREFAB = "save_prefab_object",
  LOAD_PREFABS = "load_prefab_objects",
  EXPORT = "export_project",
  SAVEMAPPAINTER = "save_painted_map",
}

export enum ObjectNodeTypes {
  DEFAULT = "ROTATE",
  ROOT = "TRANSLATE",
  // eslint-disable-next-line  @typescript-eslint/no-duplicate-enum-values
  ROTATE = "ROTATE",
  // eslint-disable-next-line  @typescript-eslint/no-duplicate-enum-values
  TRANSLATE = "TRANSLATE",
  SCALE = "SCALE",
  CIRCLE = "CIRCLE",
  CIRCLE_FILLED = "CIRCLE_FILLED",
  IMAGE = "IMAGE",
}

export enum MediaResourceType {
  IMAGE = "IMAGE",
}

export enum CanvasMode {
  ANIMATOR = "ANIMATOR",
  OBJECT_CREATOR = "OBJECT_CREATOR",
}
export enum SelectionType {
  FRAME = "frame",
  ANIMATION_OBJECT = "animationObject",
}

export type Selectable =
  { type: SelectionType.FRAME, objectIds: string[] } |
  { type: SelectionType.ANIMATION_OBJECT, objectIds: string[] };