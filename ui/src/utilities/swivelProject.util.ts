import { SwivelProject } from "../types";
import { SWIVEL_VERSION } from "../constants";
import { buildFrame } from "./frame.util";

export const buildSwivelProject = (): SwivelProject => {
  const frame = buildFrame();
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
    backgroundOpacity: 100,
  };
};