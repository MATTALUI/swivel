class AnimationObject {
  constructor() {
    this.root = new ObjectNode();
    const child = new ObjectNode();
    this.root.appendChild(child);
    child.setPosition(new Vec2(0.5, 0.25));
  }

  clone() {
    const clone = new AnimationObject();
    clone.root = this.root.clone();

    return clone;
  }
}