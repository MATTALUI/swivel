import type { Frame } from "../types";
import ObjectNode from "../models/ObjectNode";
import {
  ObjectNodeTypes,
  type AnimationObject,
} from "../types";
import { buildVec2 } from "../utilities/vec2.util";
import { buildAnimationObject } from "./animationObject.util";

// This is only used when initializing the first empty frame for a
// blank object.
const buildDefaultFrameObjects = (): AnimationObject[] => {
  let child, newestChild;

  const dino = buildAnimationObject();
  const root = dino.root;
  child = root;
  child.setPosition(buildVec2(0.5, 0.5));

  newestChild = new ObjectNode();
  const belly = newestChild;
  newestChild.setPosition(buildVec2(0.53, 0.4));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  const head = newestChild;
  newestChild.setPosition(buildVec2(0.58, 0.3));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.6, 0.3));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.65, 0.35));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.6, 0.4));
  head.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.56, 0.4));
  belly.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.56, 0.43));
  belly.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.56, 0.63));
  root.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.56, 0.73));
  child.appendChild(newestChild);
  child = newestChild;
  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.58, 0.73));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.52, 0.66));
  root.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.52, 0.76));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.54, 0.76));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.43, 0.59));
  root.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.33, 0.7));
  child.appendChild(newestChild);
  child = newestChild;

  const box = buildAnimationObject();
  child = box.root;
  child.setPosition(buildVec2(0.7, 0.7));

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.7, 0.8));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.8, 0.8));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.8, 0.7));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(buildVec2(0.72, 0.7));
  child.appendChild(newestChild);
  child = newestChild;

  const imageObject = buildAnimationObject();
  child = imageObject.root;
  child.setPosition(buildVec2(0.1, 0.1));
  newestChild = new ObjectNode();
  child.appendChild(newestChild);
  child = newestChild;
  child.type = ObjectNodeTypes.IMAGE;
  child.image = "default-dino";
  child.setPosition(buildVec2(0.4, 0.4));

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