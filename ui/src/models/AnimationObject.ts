import { ObjectNodeTypes, type SerializableAnimationObject } from "../types";
import ObjectNode from "./ObjectNode";

export default class AnimationObject {
  id: string;
  root: ObjectNode;

  constructor() {
    this.id = crypto.randomUUID();
    this.root = new ObjectNode();
    this.setRoot(this.root);
  }

  setRoot(node: ObjectNode) {
    this.root = node;
    this.root.object = this;
    this.root.type = ObjectNodeTypes.ROOT;
  }

  toSerializableObject(): SerializableAnimationObject {
    return {
      id: this.id,
      root: this.root.toSerializableObject(),
    };
  }

  clone() {
    const clone = new AnimationObject();
    clone.id = this.id;
    clone.root = this.root.clone();

    return clone;
  }
}