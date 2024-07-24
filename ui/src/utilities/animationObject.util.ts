import {
  ObjectNodeTypes,
  type ObjectNode,
  type AnimationObject,
} from "../types";
import { buildObjectNode } from "./objectNode.util";

export const buildAnimationObject = (): AnimationObject => {
  const root = buildObjectNode();

  const ao: AnimationObject = {
    id: crypto.randomUUID(),
    root,
  };

  setAnimationObjectRoot(ao, root);

  return ao;
};

export const setAnimationObjectRoot = (
  animationObject: AnimationObject,
  root: ObjectNode,
) => {
  animationObject.root = root;
  animationObject.root.object = animationObject;
  animationObject.root.type = ObjectNodeTypes.ROOT;
};