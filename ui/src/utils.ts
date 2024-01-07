
export const debounce = (func: (...args: any[]) => void, timeout = 300) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export const degToRad = (deg: number) => deg * (Math.PI / 180);

export const radToDeg = (rad: number) => rad * (180 / Math.PI);

export const getPositionDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);

  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

export const getAngleOfChange = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  let angle = radToDeg(Math.atan(Math.abs(deltaY) / Math.abs(deltaX)));
  // Q1 has no offset; we'll default there;
  let quadrantOffset = 0;
  let quadrant = 1;
  // Q2 is TL and has an offset of 90deg;
  if (deltaX < 0 && deltaY > 0) {
    quadrant = 2;
    quadrantOffset = 90;
  }
  // Q3 is BL and has an offset of 180deg;
  if (deltaX <= 0 && deltaY <= 0) {
    quadrant = 3;
    quadrantOffset = 180;
  }
  // Q4 is BR and has an offset of 270deg;
  if (deltaX > 0 && deltaY < 0) {
    quadrant = 4;
    quadrantOffset = 270;
  }

  if (quadrant === 2 || quadrant === 4) {
    // These quadrants we actually want the inverse angle because the
    // calculations run from the x-axis, but Q1 and Q4 actually increase from
    // the Y.
    angle = 90 - angle;
  }

  return angle + quadrantOffset;
}

type AdjacentIndexMap = {
  top: number | null;
  left: number | null;
  bottom: number | null;
  right: number | null;
};
export const calculateAdjacentIndices = (
  index: number,
  width: number,
  height: number
) => {
  const map: AdjacentIndexMap = {
    top: null,
    left: null,
    right: null,
    bottom: null,
  };

  if (index % width !== 0) map.left = index - 1;
  if (index % width !== width - 1) map.right = index + 1;
  if (index >= width) map.top = index - width;
  if (index < (width * height - 1) - width) map.bottom = index + width;

  return map;
}