class Utils { }

Utils.debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

Utils.clamp = (val, min, max) => Math.min(Math.max(val, min), max);