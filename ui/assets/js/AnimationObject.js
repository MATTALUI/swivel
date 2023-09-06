class AnimationObject {
  constructor() {
    this.root = new ObjectNode();
  }

  clone() {
    const clone = new AnimationObject();
    clone.root = this.root.clone();

    return clone;
  }
}