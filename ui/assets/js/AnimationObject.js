class AnimationObject {
  constructor() {
    this.root = new ObjectNode();
  }

  toSerializableObject() {
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