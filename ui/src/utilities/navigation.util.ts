import type { PayloadEvent } from "../types";

export const switchTools = (e: PayloadEvent<{ name: string }>) => {
  const { name } = e.payload;
  window.location.href = name === "index" ? "/" : `/${name}`;
};