import Vec2 from "./Vec2";
import type { SerializableVec2 } from "./Vec2";

export type SerializableObjectNode = {
  position: SerializableVec2;
  size: number;
  children: SerializableObjectNode[];
};

export default class ObjectNode {
  parent: ObjectNode | null;
  position: Vec2;
  children: ObjectNode[];
  size: number;

  constructor() {
    this.parent = null;
    this.position = new Vec2();
    this.children = [];
    this.size = 5;
  }

  get isRoot() {
    return !this.parent;
  }

  get objectRootNode() {
    let root: ObjectNode = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }

  appendChild(child: ObjectNode) {
    child.parent = this;
    this.children.push(child);
  }

  setPosition(pos: Vec2) {
    this.position = pos;
  }

  toSerializableObject(): SerializableObjectNode {
    return {
      position: this.position.toSerializableObject(),
      size: this.size,
      children: this.children.map(c => c.toSerializableObject()),
    }
  }

  clone() {
    const clone = new ObjectNode();
    clone.size = this.size;
    clone.setPosition(this.position.clone());
    this.children.forEach(c => clone.appendChild(c.clone()));

    return clone
  }
}