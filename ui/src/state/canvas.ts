import { createSignal } from "solid-js";
import ObjectNode from "../models/ObjectNode";

// These can be anything from the CSS options for cursor, but you'll ahve to opt-in
// https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
export type CursorOption =
  "grab" |
  "grabbing" |
  null;

export type MouseDownValues = {
  x: number;
  y: number;
  originalParentNode: ObjectNode | null;
  originalNodeRoot: ObjectNode;
}

export const [canvasCursor, setCanvasCursor] =
  createSignal<CursorOption>(null);
export const [selectedNode, setSelectedNode] =
  createSignal<ObjectNode | null>(null);
export const [targetNode, setTargetNode] =
  createSignal<ObjectNode | null>(null);
export const [mouseDownInitialValues, setMouseDownInitialValues] =
  createSignal<MouseDownValues | null>(null);