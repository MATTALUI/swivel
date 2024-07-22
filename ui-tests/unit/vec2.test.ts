import {
  buildVec2,
  getRenderedPosition,
  getRenderedPositionTuple,
} from "../../ui/src/utilities/vec2.util";

describe("buildVec2", () => {
  it("defaults values to 0.5", () => {
    expect(buildVec2()).toEqual({ x: 0.5, y: 0.5 });
  });

  it("allows for override values", () => {
    expect(buildVec2(0.69)).toEqual({ x: 0.69, y: 0.5 });
    expect(buildVec2(0.69, 0.420)).toEqual({ x: 0.69, y: 0.420 });
  });
});

describe("getRenderedPosition", () => {
  it("denormalizes vector based on screen size", () => {
    expect(getRenderedPosition(buildVec2(), { width: 100, height: 200 }))
      .toEqual({ x: 50, y: 100 });
  });
});

describe("getRenderedPositionTuple", () => {
  it("denormalizes vector based on screen size", () => {
    expect(getRenderedPositionTuple(buildVec2(), { width: 100, height: 200 }))
      .toEqual([50, 100]);
  });
});
