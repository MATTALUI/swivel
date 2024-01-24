import { MediaResourceType } from "../types";

type MediaResourceConstructorArgs = {
  id?: string;
  type: MediaResourceType;
  url: string;
  width?: number;
  height?: number;
  element?: HTMLImageElement | HTMLVideoElement | null;
};

export default class MediaResource {
  id: string;
  type: MediaResourceType;
  width: number;
  height: number;
  url: string;
  element: HTMLImageElement | HTMLVideoElement | null;

  constructor(properties: MediaResourceConstructorArgs) {
    this.id = properties.id || crypto.randomUUID();
    this.type = properties.type;
    this.url = properties.url;
    this.width = properties.width ?? 0;
    this.height = properties.height ?? 0;
    this.element = properties.element ?? null;
  }

  hydrate():Promise<MediaResource> {
    if (this.element) return Promise.resolve(this);
    return new Promise((resolve) => {
      switch (this.type) {
      case MediaResourceType.IMAGE: {
        this.element = new Image() as HTMLImageElement;
        this.element.src = this.url;
        const onload = () => {
          this.element?.removeEventListener("load", onload);
          resolve(this);
        };
        this.element.addEventListener("load", onload);
      }
      }
    });
  }
}