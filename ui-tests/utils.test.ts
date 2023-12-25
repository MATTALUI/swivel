import { calculateAdjacentIndices, clamp, degToRad, getAngleOfChange, getPositionDistance, radToDeg } from "../ui/src/utils";

const SQTOT = Math.sqrt(3) / 2; // SQuare of Three Over Two
const HALF = 1 / 2;

type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
type MassTestCase<T, E> = {
  args: T,
  expectation: E,
}[];
type AdjacentTileMap = {
  top: number | null;
  left: number | null;
  bottom: number | null;
  right: number | null;
};

describe("clamp", () => {
  const precision = 5;
  const testCases: MassTestCase<Vec3, number> = [
    { args: [50, 0, 100], expectation: 50 },
    { args: [69, 0, 100], expectation: 69 },
    { args: [10000, 0, 100], expectation: 100 },
    { args: [-10000, 0, 100], expectation: 0 },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`keeps ${args[0]} between ${args[1]} and ${args[2]} by returning ${expectation}`, () => {
      expect(clamp(...args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});

describe("degToRad", () => {
  const precision = 5;
  const testCases: MassTestCase<number, number> = [
    { expectation: Math.PI / 6, args: 30 },
    { expectation: Math.PI / 3, args: 60 },
    { expectation: Math.PI / 2, args: 90 },
    { expectation: (3 * Math.PI) / 2, args: 270 },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`${expectation} rads`, () => {
      expect(degToRad(args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});

describe("radToDeg", () => {
  const precision = 5;
  const testCases: MassTestCase<number, number> = [
    { args: Math.PI / 6, expectation: 30 },
    { args: Math.PI / 3, expectation: 60 },
    { args: Math.PI / 2, expectation: 90 },
    { args: (3 * Math.PI) / 2, expectation: 270 },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`${expectation} degrees`, () => {
      expect(radToDeg(args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});

describe("getPositionDistance", () => {
  const precision = 5;
  const testCases: MassTestCase<Vec4, number> = [
    { args: [0, 0, 3, 4], expectation: 5 },
    { args: [0, 0, -3, 4], expectation: 5 },
    { args: [0, 0, 5, 12], expectation: 13 },
    { args: [0, 0, -5, -12], expectation: 13 },
    { args: [0, 0, 5, -12], expectation: 13 },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`(${args[0]}, ${args[1]}) -> (${args[2]}, ${args[3]}) = ${expectation}`, () => {
      expect(getPositionDistance(...args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});

describe("calculateAdjacentIndices", () => {
  const testCases: MassTestCase<Vec3, AdjacentTileMap> = [
    { args: [0, 3, 3], expectation: { top: null, left: null, right: 1, bottom: 3 } },
    { args: [4, 3, 3], expectation: { top: 1, left: 3, right: 5, bottom: 7 } },
    { args: [2, 3, 3], expectation: { top: null, left: 1, right: null, bottom: 5 } },
    { args: [6, 3, 3], expectation: { top: 3, left: null, right: 7, bottom: null } },
    { args: [8, 3, 3], expectation: { top: 5, left: 7, right: null, bottom: null } },
    { args: [7, 3, 3], expectation: { top: 4, left: 6, right: 8, bottom: null } },
    { args: [7, 5, 3], expectation: { top: 2, left: 6, right: 8, bottom: 12 } },
    { args: [14, 5, 3], expectation: { top: 9, left: 13, right: null, bottom: null } },
  ];

  testCases.forEach(({ args, expectation }) => {
    const { top, left, bottom, right } = expectation;
    const itMsg = `${args.join(',')} => t: ${top}, l: ${left}, b:${bottom}, r: ${right}`;
    it(itMsg, () => {
      expect(calculateAdjacentIndices(...args)).toEqual(expectation);
    });
  });
});

describe("getAngleOfChange", () => {
  const precision = 5;
  const testCases: MassTestCase<Vec4, number> = [
    // Q1
    { args: [0, 0, 1, 0], expectation: 0, },
    { args: [0, 0, SQTOT, HALF], expectation: 30, },
    { args: [0, 0, 1, 1], expectation: 45, },
    { args: [0, 0, HALF, SQTOT], expectation: 60, },
    { args: [0, 0, 0, 1], expectation: 90, },
    // Q2
    { args: [0, 0, -HALF, SQTOT], expectation: 120, },
    { args: [0, 0, -1, 1], expectation: 135, },
    { args: [0, 0, -SQTOT, HALF], expectation: 150, },
    { args: [0, 0, -1, 0], expectation: 180, },
    // Q3
    { args: [0, 0, -SQTOT, -HALF], expectation: 210, },
    { args: [0, 0, -1, -1], expectation: 225, },
    { args: [0, 0, -HALF, -SQTOT], expectation: 240, },
    { args: [0, 0, 0, -1], expectation: 270, },
    // Q4
    { args: [0, 0, HALF, -SQTOT], expectation: 300, },
    { args: [0, 0, 1, -1], expectation: 315, },
    { args: [0, 0, SQTOT, -HALF], expectation: 330, },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`${expectation} degrees`, () => {
      expect(getAngleOfChange(...args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});