import ObjectNode from "./ObjectNode";
import type { SerializableObjectNode } from "./ObjectNode";

export type SerializableAnimationObject = {
  id: string;
  root: SerializableObjectNode;
};

export default class AnimationObject {
  id: string;
  root: ObjectNode;

  constructor() {
    this.id = crypto.randomUUID();
    this.root = new ObjectNode();
    this.root.object = this;
  }

  toSerializableObject(): SerializableAnimationObject {
    return {
      id: this.id,
      root: this.root.toSerializableObject(),
    }
  }

  clone() {
    const clone = new AnimationObject();
    clone.id = this.id;
    clone.root = this.root.clone();

    return clone;
  }
}