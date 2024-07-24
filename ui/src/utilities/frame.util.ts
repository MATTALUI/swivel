import type { Frame } from "../types";
import {
  ObjectNodeTypes,
  type AnimationObject,
} from "../types";
import { buildVec2 } from "../utilities/vec2.util";
import { buildAnimationObject } from "./animationObject.util";
import { appendChildNode, buildObjectNode } from "./objectNode.util";

// This is only used when initializing the first empty frame for a
// blank object.
const buildDefaultFrameObjects = (): AnimationObject[] => {
  let child, newestChild;

  const dino = buildAnimationObject();
  const root = dino.root;
  child = root;
  child.position = buildVec2(0.5, 0.5);

  newestChild = buildObjectNode();
  const belly = newestChild;
  newestChild.position = buildVec2(0.53, 0.4);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  const head = newestChild;
  newestChild.position = buildVec2(0.58, 0.3);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.6, 0.3);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.65, 0.35);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.6, 0.4);
  appendChildNode(head, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.56, 0.4);
  appendChildNode(belly, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.56, 0.43);
  appendChildNode(belly, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.56, 0.63);
  appendChildNode(root, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.56, 0.73);
  appendChildNode(child, newestChild);
  child = newestChild;
  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.58, 0.73);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.52, 0.66);
  appendChildNode(root, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.52, 0.76);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.54, 0.76);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.43, 0.59);
  appendChildNode(root, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.33, 0.7);
  appendChildNode(child, newestChild);
  child = newestChild;

  const box = buildAnimationObject();
  child = box.root;
  child.position = buildVec2(0.7, 0.7);

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.7, 0.8);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.8, 0.8);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.8, 0.7);
  appendChildNode(child, newestChild);
  child = newestChild;

  newestChild = buildObjectNode();
  newestChild.position = buildVec2(0.72, 0.7);
  appendChildNode(child, newestChild);
  child = newestChild;

  const imageObject = buildAnimationObject();
  child = imageObject.root;
  child.position = buildVec2(0.1, 0.1);
  newestChild = buildObjectNode();
  appendChildNode(child, newestChild);
  child = newestChild;
  child.type = ObjectNodeTypes.IMAGE;
  child.image = "default-dino";
  child.position = buildVec2(0.4, 0.4);

  return [
    // imageObject,
    dino,
    box,
  ];
};

export const buildFrame = (): Frame => {
  return {
    id: crypto.randomUUID(),
    index: null,
    previewImage: null,
    objects: buildDefaultFrameObjects(),
    backgroundColor: null,
  };
};