import { createSignal } from "solid-js";
import AnimationObject from "../models/AnimationObject";
import ObjectNode from "../models/ObjectNode";
import { CreatorToolNames } from "../types";

const [object, setObject] =
  createSignal<AnimationObject | null>(null);
const [controllableNodes, setControllableNodes] =
  createSignal<ObjectNode[]>([]);
const [currentTool, setCurrentTool] =
  createSignal(CreatorToolNames.SELECT);
const [name, setName] = createSignal("New Object");

const creatorState = {
  get object() { return object(); },
  set object(o) { setObject(o); },
  get controllableNodes() { return controllableNodes(); },
  set controllableNodes(n) { setControllableNodes(n); },
  get currentTool() { return currentTool(); },
  set currentTool(t) { setCurrentTool(t); },
  get name() { return name(); },
  set name(n) { setName(n); },
};

export default creatorState;