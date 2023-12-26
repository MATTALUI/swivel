import { Show } from "solid-js";
import { fullscreenLoadingMessage, isFullscreenLoading, isFullscreenLoadingOpaque } from "../state/loader";
import styles from "./FullscreenLoader.module.scss";
import cx from "classnames";

export const FullscreenLoader = () => (
  <Show when={isFullscreenLoading()}>
    <div
      class={cx(
        styles.container,
        {
          [styles.on]: isFullscreenLoadingOpaque(),
          [styles.off]: !isFullscreenLoadingOpaque(),
        }
      )}
    >
      <div class={styles.loader}></div>
      <div class={styles.loadingMessage}>{fullscreenLoadingMessage()}</div>
    </div>
  </Show>
);

export default FullscreenLoader;