import { SwivelProject } from "../types";
import Frame from "../models/Frame";
import { SWIVEL_VERSION } from "../constants";

export const buildSwivelProject = (): SwivelProject => {
  const frame = new Frame();
  frame.index = 0;

  return {
    id: crypto.randomUUID(),
    version: SWIVEL_VERSION,
    frames: [frame],
    width: 1920,
    height: 1080,
    fps: 10,
    name: "Untitled Project",
    backgroundColor: "#ffffff",
  }
}