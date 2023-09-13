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

Utils.getAngleOfChange = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const angle = Utils.radToDeg(Math.atan(Math.abs(deltaY) / Math.abs(deltaX)));
  // Q1 has no offset; we'll default there;
  let quadrantOffset = 0;
  // Q2 is TL and has an offset of 90deg;
  if (deltaX < 0 && deltaY > 0) quadrantOffset = 90;
  // Q3 is BL and has an offset of 180deg;
  if (deltaX <= 0 && deltaY <= 0) quadrantOffset = 180;
  // Q4 is BR and has an offset of 270deg;
  if (deltaX > 0 && deltaY < 0) quadrantOffset = 270;

  return angle + quadrantOffset;
}

// This is a short term measure that lets us use this code in the client the
// same as in the tests. Eventually we'll move to a more module-based design and
// might not need this?
try { window.Utils = Utils; } catch (e) { }