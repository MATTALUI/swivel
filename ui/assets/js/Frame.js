class Frame {
  constructor () {
    this.previewImage = null;
    this.objects = [
      new AnimationObject(),
      new AnimationObject(),
    ];

    this.objects[1].root.setPosition(new Vec2(0.25, 0.5));
    this.objects[1].root.children[0].setPosition(new Vec2(0.25, 0.25));

    this.objects[1].root.children[0].appendChild(new ObjectNode());
    this.objects[1].root.children[0].children[0].setPosition(new Vec2(0, 0));

    this.objects[1].root.appendChild(new ObjectNode());
    this.objects[1].root.children[1].setPosition(new Vec2(0.12, 0.89));
  }
}