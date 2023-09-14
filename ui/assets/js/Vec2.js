class Vec2 {
  constructor(x=0.5, y=0.5) {
    this.x = x;
    this.y = y;
  }

  getRenderedPosition (width, height) {
    return {
      x: this.x * width,
      y: this.y * height,
    };
  }

  getRenderedPositionTuple (width, height) {
    const { x, y } = this.getRenderedPosition(width, height);

    return [x, y];
  }

  toSerializableObject() {
    return {
      x: this.x,
      y: this.y,
    }
  }

  clone () {
    const clone = new Vec2(this.x, this.y);

    return clone;
  }
}