import ObjectNode from "./ObjectNode";
import Vec2 from "./Vec2";
import AnimationObject, { SerializableAnimationObject } from "./AnimationObject";

// This is only used when initializing the first empty frame for a
// blank object.
const buildDefaultObjects = (): AnimationObject[] => {
  let child, newestChild;

  const dino = new AnimationObject();
  const root = dino.root;
  child = root;
  child.setPosition(new Vec2(0.5, 0.5));

  newestChild = new ObjectNode();
  const belly = newestChild;
  newestChild.setPosition(new Vec2(0.53, 0.4));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  const head = newestChild;
  newestChild.setPosition(new Vec2(0.58, 0.3));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.6, 0.3));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.65, 0.35));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.6, 0.4));
  head.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.56, 0.4));
  belly.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.56, 0.43));
  belly.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.56, 0.63));
  root.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.56, 0.73));
  child.appendChild(newestChild);
  child = newestChild;
  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.58, 0.73));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.52, 0.66));
  root.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.52, 0.76));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.54, 0.76));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.43, 0.59));
  root.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.33, 0.7));
  child.appendChild(newestChild);
  child = newestChild;

  const box = new AnimationObject();
  child = box.root;
  child.setPosition(new Vec2(0.7, 0.7));

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.7, 0.8));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.8, 0.8));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.8, 0.7));
  child.appendChild(newestChild);
  child = newestChild;

  newestChild = new ObjectNode();
  newestChild.setPosition(new Vec2(0.72, 0.7));
  child.appendChild(newestChild);
  child = newestChild;


  return [dino, box];
};

type SerializableFrame = {
  id: string;
  index: number | null;
  previewImage: string | null;
  objects: SerializableAnimationObject[];
};

export default class Frame {
  id: string;
  index: number | null;
  previewImage: string | null;
  objects: AnimationObject[];
  backgroundColor: string | null;


  constructor() {
    this.id = crypto.randomUUID();
    this.index = null;
    this.previewImage = null;
    this.objects = buildDefaultObjects();
    this.backgroundColor = null;
  }

  toSerializableObject(): SerializableFrame {
    return {
      id: this.id,
      index: this.index,
      previewImage: this.previewImage,
      objects: this.objects.map(o => o.toSerializableObject()),
    };
  }

  clone() {
    const clone = new Frame();
    clone.id = this.id;
    clone.index = this.index;
    clone.previewImage = this.previewImage;
    clone.backgroundColor = this.backgroundColor;
    clone.objects = this.objects.map(o => o.clone());

    return clone;
  }
}