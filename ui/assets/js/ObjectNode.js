class ObjectNode {
  constructor() {
    this.parent = null;
    this.position = new Vec2();
    this.children = [];
    this.size = 5;
  }

  get isRoot () {
    return !this.parent;
  }

  get objectRootNode () {
    let root = this;
    while (root.parent) {
      root = root.parent;
    }
    return root;
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  setPosition(pos) {
    this.position = pos;
  }

  toSerializableObject() {
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