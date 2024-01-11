import { createSignal } from "solid-js";
import ObjectNode from "../models/ObjectNode";
import type { MouseDownValues } from "../types";

export const [selectedNode, setSelectedNode] =
  createSignal<ObjectNode | null>(null);
export const [targetNode, setTargetNode] =
  createSignal<ObjectNode | null>(null);
export const [mouseDownInitialValues, setMouseDownInitialValues] =
  createSignal<MouseDownValues | null>(null);