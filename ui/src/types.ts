import type MediaResource from "./models/MediaResource";

// These can be anything from the CSS options for cursor, but you'll have to opt-in
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

export type Vec2 = {
  x: number;
  y: number;
}

export type Vec2Tuple = [number, number];

export type AnimationObject = {
  id: string;
  root: ObjectNode;
};

export type Frame = {
  id: string;
  index: number | null;
  previewImage: string | null;
  objects: AnimationObject[];
  backgroundColor: string | null;
}

// export type MediaResource = {
//   id: string;
//   type: MediaResourceType;
//   name: string;
//   width: number;
//   height: number;
//   url: string;
//   element: HTMLImageElement | HTMLVideoElement | null;
// };

export type ObjectNode = {
  id: string;
  object: AnimationObject | null;
  parent: ObjectNode | null;
  position: Vec2;
  children: ObjectNode[];
  size: number;
  width: number | null;
  height: number | null;
  type: ObjectNodeTypes;
  image?: string;
}

export type PrefabAnimationObject = {
  id: string;
  name: string;
  previewImage: string;
  object: AnimationObject;
  createdAt: Date;
};

export type SwivelProject = {
  id: string;
  version: string;
  name: string;
  width: number;
  height: number;
  frames: Frame[];
  fps: number;
  backgroundColor: string;
}

export interface Dimensions {
  height: number,
  width: number,
}

export type SerializableObjectNode = {
  id: string;
  position: Vec2;
  size: number;
  children: SerializableObjectNode[];
  type: ObjectNodeTypes;
  image?: string | null;
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
  NODE = "node",
}

export type Selectable =
  { type: SelectionType.FRAME, objectIds: string[] } |
  { type: SelectionType.NODE, objectIds: string[] } |
  { type: SelectionType.ANIMATION_OBJECT, objectIds: string[] };

export type PayloadEvent<T> = {
  payload: T;
};

export type APIServiceBase = {
  service: string;
}

export type APIServiceSuccess<T> = APIServiceBase & {
  success: true;
  error: null;
  data: T;
}
export type APIServiceFailure = APIServiceBase & {
  success: false;
  error: string;
  data: null;
}
export type APIServiceMeta<T> = APIServiceSuccess<T> | APIServiceFailure;

export type APIServiceResponse<T> = Promise<APIServiceMeta<T>>;

export interface IAPIService {
  /** Returns the name of the service */
  getServiceName: () => string;
  /**
   * A utility function that will display a brief description of a service
   * mostly used for debugging which services are being applied in which
   * environments
   * */
  displayServiceInformation: () => boolean;
  /**
   * Uploads a base64 encoded image to a publicly accessible location, returning
   * the src-able url for that image
  */
  uploadImage: (b64: string) => APIServiceResponse<string>;
  /** Gets a list of prefabricated animation objects that the user has saved */
  getSavedObjects: () => APIServiceResponse<SerializablePrefabAnimationObject[]>;
  /** Saves a new prefabricated animation object */
  saveSwivelObject: (p: PrefabAnimationObject) => APIServiceResponse<PrefabAnimationObject>;
  /** Saves an animation project */
  saveProject: (p: SwivelProject) => APIServiceResponse<boolean>;
  /** Exports an animation project to a new file */
  exportProject: (p: SwivelProject) => APIServiceResponse<boolean>;
  /** Gets a list of all of the media resources that have been saved to the service */
  getMediaResources: () => APIServiceResponse<MediaResource[]>;
  /** Creates a media resource record on the service */
  createMediaResource: (r: MediaResource) => APIServiceResponse<MediaResource>;
}