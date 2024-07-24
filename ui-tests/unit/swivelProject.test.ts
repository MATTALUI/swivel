import { SWIVEL_VERSION } from "../../ui/src/constants";
import {
  buildSwivelProject,
} from "../../ui/src/utilities/swivelProject.util";

describe("buildSwivelProject", () => {
  it("builds a base swivel project", () => {
    expect(buildSwivelProject()).toMatchObject({
      // TODO: improve this test by matching these properties
      // id: ANY STRING,
      // frames: SERIALIZABLE FRAMES,
      version: SWIVEL_VERSION,
      width: 1920,
      height: 1080,
      fps: 10,
      name: "Untitled Project",
      backgroundColor: "#ffffff",
    });
  });
});