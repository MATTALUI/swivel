import {
  ObjectNodeTypes,
  type SerializableObjectNode,
  type Vec2,
} from "../types";
import { buildVec2 } from "../utilities/vec2.util";
import AnimationObject from "./AnimationObject";


export default class ObjectNode {
  id: string;
  object: AnimationObject | null;
  parent: ObjectNode | null;
  position: Vec2;
  children: ObjectNode[];
  size: number;
  width: number | null;
  height: number | null;
  type: ObjectNodeTypes;
  private _image?: string;

  constructor() {
    this.id = crypto.randomUUID();
    this.object = null;
    this.parent = null;
    this.position = buildVec2();
    this.children = [];
    this.size = 5;
    this.width = null;
    this.height = null;
    this.type = ObjectNodeTypes.DEFAULT;
  }

  get isRoot() {
    return !this.parent;
  }

  get objectRootNode() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let root: ObjectNode = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }

  get image(): string | null {
    return this._image || null;
  }

  set image(newImage: string) {
    if (this.type !== ObjectNodeTypes.IMAGE)
      throw new Error("Can not set image of non-image type nodes");
    this._image = newImage;
  }

  appendChild(child: ObjectNode) {
    child.object = this.object;
    child.parent = this;
    this.children.push(child);
  }

  detach(child: ObjectNode) {
    this.children = this.children.filter(c => c.id !== child.id);
  }

  setPosition(pos: Vec2) {
    this.position = pos;
  }

  toSerializableObject(): SerializableObjectNode {
    return {
      id: this.id,
      position: this.position,
      size: this.size,
      children: this.children.map(c => c.toSerializableObject()),
      type: this.type,
      image: this.image,
    };
  }

  clone() {
    const clone = new ObjectNode();
    clone.id = this.id;
    clone.parent = this.parent;
    clone.size = this.size;
    clone.object = this.object;
    clone.type = this.type;
    clone._image = this._image;
    clone.setPosition(this.position);
    this.children.forEach(c => clone.appendChild(c.clone()));

    return clone;
  }
}