import { createSignal } from "solid-js";
import AnimationObject from "../models/AnimationObject";
import ObjectNode from "../models/ObjectNode";

export enum CreatorToolNames {
  SELECT = "SELECT",
  ADD = "ADD",
  GROUP = "GROUP",
}
export const [creationObject, setCreationObject] =
  createSignal<AnimationObject | null>(null);
export const [creatorControllableNodes, setCreatorControllableNodes] =
  createSignal<ObjectNode[]>([]);
export const [currentCreatorTool, setCurrentCreatorTool] =
  createSignal(CreatorToolNames.SELECT);