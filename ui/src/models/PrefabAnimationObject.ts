import AnimationObject, { SerializableAnimationObject } from "./AnimationObject";

export type SerializablePrefabAnimationObject = {
  id: string;
  name: string;
  previewImage: string;
  object: SerializableAnimationObject;
  createdAt: string;
}

export default class PrefabAnimationObject {
  id: string;
  name: string;
  previewImage: string;
  private object: SerializableAnimationObject;
  createdAt: Date;

  constructor(object: AnimationObject) {
    this.id = crypto.randomUUID();
    this.name = "Unnamed Object";
    this.previewImage = "";
    this.object = object.toSerializableObject();
    this.createdAt = new Date();
  }

  toSerializableObject(): SerializablePrefabAnimationObject {
    return {
      id: this.id,
      name: this.name,
      previewImage: this.previewImage,
      object: this.object,
      createdAt: this.createdAt.toString(),
    };
  }
}