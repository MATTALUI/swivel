// ui/__src/Tauri.ts
var Tauri_default = window.__TAURI__ || null;

// ui/__src/Utils.ts
var debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(null, args);
    }, timeout);
  };
};
var clamp = (val, min, max) => Math.min(Math.max(val, min), max);
var degToRad = (deg) => deg * (Math.PI / 180);
var radToDeg = (rad) => rad * (180 / Math.PI);
var getPositionDistance = (x1, y1, x2, y2) => {
  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);
  return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
};
var getAngleOfChange = (x1, y1, x2, y2) => {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  let angle = radToDeg(Math.atan(Math.abs(deltaY) / Math.abs(deltaX)));
  let quadrantOffset = 0;
  let quadrant = 1;
  if (deltaX < 0 && deltaY > 0) {
    quadrant = 2;
    quadrantOffset = 90;
  }
  if (deltaX <= 0 && deltaY <= 0) {
    quadrant = 3;
    quadrantOffset = 180;
  }
  if (deltaX > 0 && deltaY < 0) {
    quadrant = 4;
    quadrantOffset = 270;
  }
  if (quadrant === 2 || quadrant === 4) {
    angle = 90 - angle;
  }
  return angle + quadrantOffset;
};
var calculateAdjacentIndices = (index, width, height) => {
  const map = {
    top: null,
    left: null,
    right: null,
    bottom: null
  };
  if (index % width !== 0)
    map.left = index - 1;
  if (index % width !== width - 1)
    map.right = index + 1;
  if (index >= width)
    map.top = index - width;
  if (index < width * height - 1 - width)
    map.bottom = index + width;
  return map;
};

// ui/__src/targets/MapPainter.ts
(async () => {
  const width = 40;
  const height = 30;
  if (Tauri_default) {
    const { listen } = Tauri_default.event;
    listen("SWIVEL::INIT_SAVE", async (e) => {
      if (!Tauri_default)
        return;
      const { invoke } = Tauri_default.tauri;
      const activeIndices = Array.from(document.querySelectorAll(".cell.active")).map((e2) => Number(e2.getAttribute("data-index")));
      const saveSuccess = await invoke("save_painted_map", {
        activeIndices,
        width,
        height
      });
    });
    listen("SWIVEL::INIT_NEW", async (e) => {
      console.log("Create new map painter!");
    });
  }
  const total = width * height;
  const gridEle = document.querySelector("#grid");
  if (!gridEle) {
    console.error("Cannot find grid element");
    return;
  }
  gridEle.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  for (let i = 0;i < total; i++) {
    const cell = document.createElement("div");
    cell.draggable = false;
    cell.classList.add("cell");
    cell.setAttribute("data-index", i.toString());
    gridEle.appendChild(cell);
  }
  {
    let painting = false;
    let mode = "paint";
    const applyPaint = (e, force = false) => {
      e.preventDefault();
      if (mode !== "paint")
        return;
      if (!force && !painting)
        return;
      e.target.classList.add("active");
    };
    const applyFlood = (e, force = false) => {
      const flood = (index) => {
        const ele = document.querySelector(`.cell[data-index="${index}"]`);
        const active = !!ele && ele.classList.contains("active");
        if (!!ele && !active) {
          ele.classList.add("active");
          const neighbors = calculateAdjacentIndices(index, width, height);
          Object.values(neighbors).forEach((ni) => {
            if (!ni && ni !== 0)
              return;
            flood(ni);
          });
        }
      };
      flood(e.target.getAttribute("data-index"));
    };
    const handlerMap = {
      paint: applyPaint,
      flood: applyFlood
    };
    document.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (mode !== "paint")
        return;
      painting = true;
    });
    document.addEventListener("mouseup", (e) => {
      e.preventDefault();
      if (mode !== "paint")
        return;
      painting = false;
    });
    document.querySelectorAll(".cell").forEach((ele) => {
      ele.addEventListener("mousemove", applyPaint);
      ele.addEventListener("click", (e) => {
        e.preventDefault();
        const handler = handlerMap[mode];
        handler(e, true);
      });
    });
    document.querySelector("#paintMode")?.addEventListener("click", () => {
      painting = false;
      mode = "paint";
    });
    document.querySelector("#floodMode")?.addEventListener("click", () => {
      painting = false;
      mode = "flood";
    });
  }
})();
