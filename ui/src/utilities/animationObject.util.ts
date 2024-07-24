import ObjectNode from "../models/ObjectNode";
import {
  ObjectNodeTypes,
  type AnimationObject,
} from "../types";

export const buildAnimationObject = (): AnimationObject => {
  const root = new ObjectNode();

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