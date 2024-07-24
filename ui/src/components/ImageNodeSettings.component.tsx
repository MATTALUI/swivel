import { JSX, Match, Show, Switch, createSignal } from "solid-js";
import globalState from "../state";
import styles from "./ImageNodeSettings.module.scss";
import {
  MediaResourceType,
  type ObjectNode,
} from "../types";
import APIService from "../services";
import { buildMediaResource, hydrateMediaResource } from "../utilities/mediaResource.util";

interface IImageNodeSettingsProps {
  node: ObjectNode;
}

type InputHandler = JSX.ChangeEventHandler<HTMLInputElement, Event>;

const ImageNodeSettings = (props: IImageNodeSettingsProps) => {
  const imageResource = () => globalState.mediaResources.byId?.[props.node.image || "🦖"];
  const [loadingImage, setLoadingImage] = createSignal(false);

  const imageSrc = () => imageResource()?.url;
  const imageUnavailable = () => !imageSrc();

  const buttonText = () => {
    const maxLength = 25;
    const text = imageResource()?.name || "Select Image";
    return text.length < maxLength
      ? text
      : text.slice(0, maxLength - 4) + "...";
  };

  const changeImage: InputHandler = async (event) => {
    try {
      setLoadingImage(true);
      const [file] = event.target.files || [];
      if (!file)
        throw new Error("There is no file available in this file upload.");
      await new Promise<void>((res) => setTimeout(res, 1000));
      await new Promise<void>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result as string;
          APIService.uploadImage(base64Image).then(({
            success,
            data: publicURL,
          }) => {
            if (!success) return rej();
            const resource = buildMediaResource({
              type: MediaResourceType.IMAGE,
              url: publicURL,
              name: file.name,
            });
            hydrateMediaResource(resource).then(() => {
              props.node.image = resource.id;
              props.node.width = resource.width;
              props.node.height = resource.height;
              APIService.createMediaResource(resource).then(() => {
                globalState.mediaResources.new = resource;
                res();
              });
            });
          });
        };
        reader.readAsDataURL(file);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div>
      <div class={styles.imagePreview}>
        <Switch>
          <Match when={imageUnavailable() && !props.node.image}>
            <span>No Image Available</span>
          </Match>
          <Match when={imageUnavailable()}>
            <span class={styles.error}>There was an error loading the resource for this node</span>
          </Match>
          <Match when={!!imageSrc()}>
            <img src={imageSrc()} />
          </Match>
        </Switch>
      </div>
      <div class={styles.fileSelector}>
        <input id="resource" name="resource" type="file" onChange={changeImage} />
        <label for="resource">
          <Show when={loadingImage()}>
            <span class={styles.loader}></span>
          </Show>
          {buttonText()}
        </label>
      </div>
    </div>
  );
};

export default ImageNodeSettings;