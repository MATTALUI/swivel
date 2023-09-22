if (window.__TAURI__) {
  const { listen } = window.__TAURI__.event;
  listen("SWIVEL::INIT_SAVE", async (e) => {
    const { invoke } = window.__TAURI__.tauri;
    const activeIndices = Array
      .from(document.querySelectorAll(".cell.active"))
      .map(e => +e.getAttribute("data-index"));
    const saveSuccess = await invoke("save_painted_map", { activeIndices });
  });
  listen("SWIVEL::INIT_NEW", async (e) => {

  });
}

(async () => {
  const width = 100;
  const height = 60;

  const total = width * height;
  const gridEle = document.querySelector("#grid");
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
          const neighbors = Utils.calculateAdjacentIndices(index, width, height);
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

    document.querySelector("#paintMode").addEventListener("click", () => {
      painting = false;
      mode = "paint";
    });
    document.querySelector("#floodMode").addEventListener("click", () => {
      painting = false;
      mode = "flood";
    });
  }

})();