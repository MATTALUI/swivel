import { createSignal } from "solid-js";
import ObjectNode from "../models/ObjectNode";
import type { CursorOption, MouseDownValues } from "../types";

export const [canvasCursor, setCanvasCursor] =
  createSignal<CursorOption>(null);
export const [selectedNode, setSelectedNode] =
  createSignal<ObjectNode | null>(null);
export const [targetNode, setTargetNode] =
  createSignal<ObjectNode | null>(null);
export const [mouseDownInitialValues, setMouseDownInitialValues] =
  createSignal<MouseDownValues | null>(null);