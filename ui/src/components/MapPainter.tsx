import { mountMappainterTauriListeners } from "../utilities/tauri";
import { calculateAdjacentIndices } from "../utils";
import FileHeader from "./FileHeader";
import styles from "./MapPainter.module.scss";

const WIDTH = 40;
const HEIGHT = 30;

type PaintMode = "paint" | "flood";

const MapPainter = () => {
  mountMappainterTauriListeners();

  let painting = false;
  let mode: PaintMode = "paint";

  const applyPaint = (e: MouseEvent, force = false) => {
    e.preventDefault();
    if (mode !== "paint") return;
    if (!force && !painting) return;
    const ele = e.target as HTMLDivElement;
    ele.classList.add(styles.active);
    ele.dataset.active = "true";
  };

  const applyFlood = (e: MouseEvent, _force = false) => {
    const flood = (index: number) => {
      const ele = document.querySelector<HTMLDivElement>(`[data-index="${index}"]`);
      const active = !!ele && ele.classList.contains(styles.active);
      if (!!ele && !active) {
        ele.classList.add(styles.active);
        ele.dataset.active = "true";
        const neighbors = calculateAdjacentIndices(index, WIDTH, HEIGHT);
        Object.values(neighbors).forEach((ni) => {
          if (!ni && ni !== 0) return;
          flood(ni);
        });
      }
    }
    const i = (e.target as HTMLDivElement)?.getAttribute("data-index");
    if (i !== null) flood(+i);
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

  return (
    <div class={styles.container}>
      <FileHeader />
      <div class={styles.mapContainer}>
        <div class={styles.mappainter}>
          <div class={styles.controls}></div>
          <div
            style={{
              "grid-template-columns": `repeat(${WIDTH}, 1fr)`
            }}
            class={styles.grid}
            draggable={false}
          >
            {new Array(WIDTH * HEIGHT).fill(0).map((_, index) => (
              <div
                data-index={index}
                class={styles.cell}
                draggable={false}
                onMouseMove={applyPaint}
                onClick={(e) => {
                  e.preventDefault();
                  const handler = handlerMap[mode];
                  handler(e, true);
                }}
              />
            ))}
          </div>
          <div class={styles.controls}>
            <button
              onClick={() => {
                painting = false;
                mode = "paint";
              }}
            >
              Paint
            </button>
            <button
              onClick={() => {
                painting = false;
                mode = "flood";
              }}
            >
              Flood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPainter;