import Utils from "../ui/assets/js/Utils";

const SQTOT = Math.sqrt(3) / 2; // SQuare of Three Over Two
const HALF = 1 / 2;

type Vec3 = [number, number, number];
type Vec4 = [number, number, number, number];
type MassTestCase<T, E> = {
  args: T,
  expectation: E,
}[];

describe("Utils.clamp", () => {
  const precision = 5;
  const testCases: MassTestCase<Vec3, number> = [
    { args: [50, 0, 100], expectation: 50 },
    { args: [69, 0, 100], expectation: 69 },
    { args: [10000, 0, 100], expectation: 100 },
    { args: [-10000, 0, 100], expectation: 0 },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`keeps ${args[0]} between ${args[1]} and ${args[2]} by returning ${expectation}`, () => {
      expect(Utils.clamp(...args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});

describe("Utils.degToRad", () => {
  const precision = 5;
  const testCases: MassTestCase<number, number> = [
    { expectation: Math.PI / 6 , args: 30 },
    { expectation: Math.PI / 3 , args: 60 },
    { expectation: Math.PI / 2 , args: 90 },
    { expectation: (3 * Math.PI) / 2 , args: 270 },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`${expectation} rads`, () => {
      expect(Utils.degToRad(args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});

describe("Utils.radToDeg", () => {
  const precision = 5;
  const testCases: MassTestCase<number, number> = [
    { args: Math.PI / 6 , expectation: 30 },
    { args: Math.PI / 3 , expectation: 60 },
    { args: Math.PI / 2 , expectation: 90 },
    { args: (3 * Math.PI) / 2 , expectation: 270 },
  ];

  testCases.forEach(({ args, expectation }) => {
    it(`${expectation} degrees`, () => {
      expect(Utils.radToDeg(args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});

describe("Utils.getAngleOfChange", () => {
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
      expect(Utils.getAngleOfChange(...args).toFixed(precision)).toEqual(expectation.toFixed(precision));
    });
  });
});