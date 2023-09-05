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

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  setPosition(pos) {
    this.position = pos;
  }

  clone() {
    const clone = new ObjectNode();
    clone.size = this.size;
    clone.setPosition(this.position.clone());
    this.children.forEach(c => clone.appendChild(c.clone()));

    return clone
  }
}