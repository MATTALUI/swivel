import { createSignal } from "solid-js";
import ObjectNode from "../models/ObjectNode";

// These can be anything from the CSS options for cursor, but you'll ahve to opt-in
// https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
type CursorOption =
  "grab" |
  "grabbing" |
  null;
export const [canvasCursor, setCanvasCursor] = createSignal<CursorOption>(null);
export const [selectedNode, setSelectedNode] = createSignal<ObjectNode | null>(null);
export const [targetNode, setTargetNode] = createSignal<ObjectNode | null>(null);