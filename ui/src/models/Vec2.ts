import type { SerializableVec2 } from "../types";


export default class Vec2 {
  x: number;
  y: number;

  constructor(x = 0.5, y = 0.5) {
    this.x = x;
    this.y = y;
  }

  getRenderedPosition(width: number, height: number) {
    return {
      x: this.x * width,
      y: this.y * height,
    };
  }

  getRenderedPositionTuple(width: number, height: number) {
    const { x, y } = this.getRenderedPosition(width, height);

    return [x, y];
  }

  toSerializableObject(): SerializableVec2 {
    return {
      x: this.x,
      y: this.y,
    };
  }

  clone() {
    const clone = new Vec2(this.x, this.y);

    return clone;
  }
}