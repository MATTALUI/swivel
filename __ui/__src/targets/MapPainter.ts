import Tauri from "../Tauri";
import { calculateAdjacentIndices } from "../Utils";

(async () => {
  const width = 40;
  const height = 30;

  if (Tauri) {
    const { listen } = Tauri.event;
    listen("SWIVEL::INIT_SAVE", async (e) => {
      if (!Tauri) return;
      const { invoke } = Tauri.tauri;
      const activeIndices = Array
        .from(document.querySelectorAll(".cell.active"))
        .map(e => Number(e.getAttribute("data-index")));
      const saveSuccess = await invoke("save_painted_map", {
        activeIndices,
        width,
        height,
      });
    });
    listen("SWIVEL::INIT_NEW", async (e) => {
      console.log("Create new map painter!");
    });
  }

  const total = width * height;
  const gridEle = document.querySelector<HTMLDivElement>("#grid");
  if (!gridEle) {
    console.error("Cannot find grid element");
    return;
  }
  gridEle.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

  for (let i = 0; i < total; i++) {
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
      if (mode !== "paint") return;
      if (!force && !painting) return;
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
            if (!ni && ni !== 0) return;
            flood(ni);
          });
        }
      }
      flood(e.target.getAttribute("data-index"));
    }

    const handlerMap = {
      paint: applyPaint,
      flood: applyFlood,
    }

    document.addEventListener("mousedown", (e) => {
      e.preventDefault()
      if (mode !== "paint") return;
      painting = true;
    });

    document.addEventListener("mouseup", (e) => {
      e.preventDefault()
      if (mode !== "paint") return;
      painting = false;
    });

    document.querySelectorAll(".cell").forEach((ele) => {
      ele.addEventListener("mousemove", applyPaint);
      ele.addEventListener("click", (e) => {
        e.preventDefault()
        const handler = handlerMap[mode];
        handler(e, true)
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