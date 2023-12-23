import Frame from "./Frame";

export default class SwivelProject {
  id: string;
  name: string;
  width: number;
  height: number;
  frames: Frame[];
  fps: number;
  backgroundColor: string;

  constructor() {
    this.id = crypto.randomUUID();
    this.frames = new Array(1).fill(new Frame());
    this.width = 1920;
    this.height = 1080;
    this.fps = 10;
    this.name = "Untitled Project";
    this.backgroundColor = "#ffffff";
  }

  get aspectRatio() {
    return this.width / this.height;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      fps: this.fps,
      frames: this.frames.map(f => f.toSerializableObject()),
    });
  }
}