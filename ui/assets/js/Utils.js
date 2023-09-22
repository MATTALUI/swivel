export default class Utils { }

Utils.debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

Utils.clamp = (val, min, max) => Math.min(Math.max(val, min), max);

Utils.degToRad = (deg) => deg * (Math.PI / 180);

Utils.radToDeg = (rad) => rad * (180 / Math.PI);

Utils.getPositionDistance = (x1, y1, x2, y2) => {
  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);

  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

Utils.getAngleOfChange = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  let angle = Utils.radToDeg(Math.atan(Math.abs(deltaY) / Math.abs(deltaX)));
  // Q1 has no offset; we'll default there;
  let quadrantOffset = 0;
  let quadrant = 1;
  // Q2 is TL and has an offset of 90deg;
  if (deltaX < 0 && deltaY > 0){
    quadrant = 2;
    quadrantOffset = 90;
  }
  // Q3 is BL and has an offset of 180deg;
  if (deltaX <= 0 && deltaY <= 0){
    quadrant = 3;
    quadrantOffset = 180;
  }
  // Q4 is BR and has an offset of 270deg;
  if (deltaX > 0 && deltaY < 0){
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

Utils.calculateAdjacentIndices = (index, width, height) => {
  const map = { top: null, left: null, right: null, bottom: null };

  if (index % width !== 0) map.left = index - 1;
  if (index % width !== width - 1) map.right = index + 1;
  if (index >= width ) map.top = index - width;
  if (index < (width * height - 1) - width) map.bottom = index + width;

  return map;
}

// This is a short term measure that lets us use this code in the client the
// same as in the tests. Eventually we'll move to a more module-based design and
// might not need this?
try { window.Utils = Utils; } catch (e) { }