class Frame {
  constructor() {
    this.previewImage = null;
    this.objects = Frame.buildDefaultObjects();
  }

  clone() {
    const clone = new Frame();
    clone.objects = this.objects.map(o => o.clone());

    return clone;
  }
}

// This realistically is only used when initializing the first empty frame for a
// blank object.
Frame.buildDefaultObjects = () => {
  let child, newestChild;
  const objects = [];
  // M
  const m = new AnimationObject();
  m.root.setPosition(new Vec2(0.1, 0.69));
  child = new ObjectNode();
  m.root.appendChild(child);
  child.setPosition(new Vec2(0.1, 0.5));
  newestChild = new ObjectNode()
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.15, 0.58));
  newestChild = new ObjectNode()
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.2, 0.5));
  newestChild = new ObjectNode()
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.2, 0.69));
  // A
  const a = new AnimationObject();
  a.root.setPosition(new Vec2(0.25, 0.69));
  child = new ObjectNode();
  a.root.appendChild(child);
  child.setPosition(new Vec2(0.275, 0.5));
  newestChild = new ObjectNode()
  child.appendChild(newestChild);
  child = newestChild;
  child.setPosition(new Vec2(0.3, 0.69));
  // T
  const t1 = new AnimationObject();
  t1.root.setPosition(new Vec2(0.375, 0.69));
  child = new ObjectNode();
  t1.root.appendChild(child);
  child.setPosition(new Vec2(0.375, 0.5));
  newestChild = new ObjectNode()
  child.appendChild(newestChild);
  newestChild.setPosition(new Vec2(0.35, 0.5));
  newestChild = new ObjectNode()
  child.appendChild(newestChild);
  newestChild.setPosition(new Vec2(0.4, 0.5));
  // T
  const t2 = new AnimationObject();
  t2.root.setPosition(new Vec2(0.475, 0.5));


  objects.push(m, a, t1, t2);
  child = new ObjectNode();
  t2.root.appendChild(child);
  child.setPosition(new Vec2(0.45, 0.5));
  child = new ObjectNode();
  t2.root.appendChild(child);
  child.setPosition(new Vec2(0.5, 0.5));
  child = new ObjectNode();
  t2.root.appendChild(child);
  child.setPosition(new Vec2(0.475, 0.69));
  

  return objects;
}