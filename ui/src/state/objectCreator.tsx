import { createSignal } from "solid-js";
import AnimationObject from "../models/AnimationObject";
import ObjectNode from "../models/ObjectNode";
import { CreatorToolNames } from "../types";

export const [creationObject, setCreationObject] =
  createSignal<AnimationObject | null>(null);
export const [creatorControllableNodes, setCreatorControllableNodes] =
  createSignal<ObjectNode[]>([]);
export const [currentCreatorTool, setCurrentCreatorTool] =
  createSignal(CreatorToolNames.SELECT);
export const [newObjectName, setNewObjectName] = createSignal("New Object");