import type { PayloadEvent } from "../types";

export const switchTools = (e: PayloadEvent<{ name: string }>) => {
  const { name } = e.payload;
  window.location.href = name === "index" ? "/" : `/${name}`;
};

export const gotoAnimator = () => {
  if (window.location.pathname === "/") return;
  switchTools({ payload: { name: "index" } });
};

export const gotoMapPainter = () => {
  if (window.location.pathname === "/mappainter") return;
  switchTools({ payload: { name: "mappainter" } });
};