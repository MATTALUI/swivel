import type { JSX } from "solid-js";
import { For, Match, Show, Switch } from "solid-js";
import styles from "./Settings.module.scss";
import ObjectNode from "../models/ObjectNode";
import globalState from "../state";
import { ObjectNodeTypes, SelectionType } from "../types";
import ImageNodeSettings from "./ImageNodeSettings.component";

type InputHandler = JSX.ChangeEventHandler<HTMLSelectElement, Event>;

const ObjectNodeSettings = () => {
  const selectedNodes = () => {
    const nodes: ObjectNode[] = [];
    const selection = globalState.animator.selectedObjects;
    if (!globalState.creator.object?.root) return nodes;
    if (!selection) return nodes;
    const selectedIds = selection.objectIds;
    const collectNodes = (node: ObjectNode) => {
      if (selectedIds.includes(node.id))
        nodes.push(node);
      node.children.forEach(collectNodes);
    };
    collectNodes(globalState.creator.object.root);

    return nodes;
  };

  // This comes from the fact that I'm mutating the data in some places so
  // signals aren't updating. Crap. Created issue #87
  const refetch = () => {
    globalState.animator.selectedObjects = {
      objectIds: selectedNodes().map(n => n.id),
      type: SelectionType.NODE,
    };
  };

  const nodeTypes = () => {
    return Array.from(new Set(selectedNodes().map(n => n.type)));
  };

  const firstType = () => nodeTypes()[0];

  const uniformTypes = () => nodeTypes().length === 1;

  const containsRoot = () => {
    return selectedNodes().some(n => n.isRoot);
  };

  const changeNodeTypes: InputHandler = (event) => {
    const newObject = globalState.creator.object;
    const selection = globalState.animator.selectedObjects;
    const newType = event.target.value as ObjectNodeTypes;
    if (!selection) return;
    const selectedIds = selection.objectIds;
    const updateNode = (node: ObjectNode) => {
      if (selectedIds.includes(node.id)) node.type = newType;
      node.children.forEach(updateNode);
    };
    if (newObject?.root) updateNode(newObject.root);
    globalState.creator.object = newObject;
    refetch();
  };

  return (
    <>
      <h2 class={styles.title}>Node</h2>
      <Show when={uniformTypes()}>
        <div class={styles.settingContainer}>
          <select
            onChange={changeNodeTypes}
            disabled={containsRoot() || nodeTypes().length > 1}
          >
            <Show when={containsRoot()}>
              <option selected value={ObjectNodeTypes.IMAGE}>
                Root
              </option>
            </Show>
            <option
              selected={firstType() === ObjectNodeTypes.ROTATE}
              value={ObjectNodeTypes.ROTATE}
            >
              Rotator
            </option>
            <option
              selected={firstType() === ObjectNodeTypes.TRANSLATE  && !containsRoot()}
              value={ObjectNodeTypes.TRANSLATE}
            >
              Translator
            </option>
            <option
              selected={firstType() === ObjectNodeTypes.IMAGE}
              value={ObjectNodeTypes.IMAGE}
            >
              Image
            </option>
          </select>
        </div>
        <Switch>
          <Match when={firstType() === ObjectNodeTypes.IMAGE}>
            <For each={selectedNodes()}>
              {(node) => <ImageNodeSettings node={node} />}
            </For>
          </Match>
        </Switch>
      </Show>
    </>
  );
};

export default ObjectNodeSettings;