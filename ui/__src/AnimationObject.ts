import ObjectNode from "./ObjectNode";
import type { SerializableObjectNode } from "./ObjectNode";

export type SerializableAnimationObject = {
  root: SerializableObjectNode;
};

export default class AnimationObject {
  root: ObjectNode;

  constructor() {
    this.root = new ObjectNode();
  }

  toSerializableObject(): SerializableAnimationObject {
    return {
      root: this.root.toSerializableObject(),
    }
  }

  clone() {
    const clone = new AnimationObject();
    clone.root = this.root.clone();

    return clone;
  }
}