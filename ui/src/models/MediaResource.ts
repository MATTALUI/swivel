import { MediaResourceType } from "../types";

export type MediaResourceConstructorArgs = {
  id?: string;
  type: MediaResourceType;
  url: string;
  name?: string;
  width?: number;
  height?: number;
  element?: HTMLImageElement | HTMLVideoElement | null;
};

export default class MediaResource {
  id: string;
  type: MediaResourceType;
  name: string;
  width: number;
  height: number;
  url: string;
  element: HTMLImageElement | HTMLVideoElement | null;

  constructor(properties: MediaResourceConstructorArgs) {
    this.id = properties.id || crypto.randomUUID();
    this.type = properties.type;
    this.url = properties.url;
    this.name = properties.name || "Unnamed Resource";
    this.width = properties.width ?? 0;
    this.height = properties.height ?? 0;
    this.element = properties.element ?? null;
  }

  toSerializableObject() {
    return {
      id: this.id,
      type: this.type,
      url: this.url,
      name: this.name,
      width: this.width,
      height: this.height,
      element: null,
    };
  }

  hydrate(): Promise<MediaResource> {
    if (this.element) return Promise.resolve(this);
    return new Promise((resolve) => {
      switch (this.type) {
      case MediaResourceType.IMAGE: {
        this.element = new Image() as HTMLImageElement;
        this.element.src = this.url;
        const onload = () => {
          this.element?.removeEventListener("load", onload);
          if (!this.height) this.height = this.element?.height || 0;
          if (!this.width) this.width = this.element?.width || 0;
          resolve(this);
        };
        this.element.addEventListener("load", onload);
      }
      }
    });
  }
}