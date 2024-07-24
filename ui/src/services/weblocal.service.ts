import {
  openDB,
  type IDBPDatabase,
} from "idb";
import type {
  APIServiceFailure,
  APIServiceSuccess,
  IAPIService,
  SerializablePrefabAnimationObject,
  SwivelProject,
  PrefabAnimationObject,
  MediaResource,
  MediaResourceConstructorArgs,
} from "../types";
import { buildMediaResource } from "../utilities/mediaResource.util";

const SERVICE_NAME = "Web Local Service";
const DB_NAME = "SWIVEL::DATABASE";
const PROJECTS_STORE = "SWIVEL::PROJECTS";
const PREFABS_STORE = "SWIVEL::PREFABS";
const IMAGES_STORE = "SWIVEL::IMAGES";
const RESOURCES_STORE = "SWIVEL::RESOURCES";

// Do not touch once committed!
const IDB_MIGRATIONS = [
  (db: IDBPDatabase) => {
    const projects = db.createObjectStore(PROJECTS_STORE, { keyPath: "id" });
    projects.createIndex("name", "name", { unique: false });
    const prefabs = db.createObjectStore(PREFABS_STORE, { keyPath: "id" });
    prefabs.createIndex("name", "name", { unique: false });
  },
  (db: IDBPDatabase) => {
    db.createObjectStore(IMAGES_STORE, { autoIncrement: true });
    const resources = db.createObjectStore(RESOURCES_STORE, { keyPath: "id" });
    resources.createIndex("name", "name", { unique: false });
  },
];

const DBVersion = IDB_MIGRATIONS.length;

const useDb = async () => {
  const db = await openDB(DB_NAME, DBVersion, {
    upgrade: (
      db,
      oldVersion,
      newVersion,
      _transaction
    ) => {
      const finishVersion = newVersion || DBVersion;
      for (let i = oldVersion; i < finishVersion; i++) {
        const migration = IDB_MIGRATIONS[i];
        migration(db);
      }
    }
  });

  return db;
};

const buildServiceSuccess = <T>(data: T): APIServiceSuccess<T> => ({
  service: SERVICE_NAME,
  success: true,
  error: null,
  data,
});

const buildServiceError = (error: string): APIServiceFailure => ({
  service: SERVICE_NAME,
  success: false,
  error,
  data: null,
});

const getServiceName = () => SERVICE_NAME;

const displayServiceInformation = () => {
  console.log(`CURRENT SERVICE: ${SERVICE_NAME}`);
  return false;
};

const uploadImage = async (b64: string) => {

  // This code is a way that we can store the image in IDB and use a URL instead.
  // However, it creates an issue in that these URLs aren't permanant, so saving
  // them causes errors in the media resources. Will need to investigate a more
  // sturdy flow for this.

  // const res = await fetch(b64);
  // const blob = await res.blob();
  // const db = await useDb();
  // const transaction = db.transaction([IMAGES_STORE], "readwrite");
  // await db.add(IMAGES_STORE, blob); // This will return the inserted key
  // await transaction.done;
  // const src = URL.createObjectURL(blob);

  // return buildServiceSuccess(src);
  return buildServiceSuccess(b64);
};

const saveSwivelObject = async (prefab: PrefabAnimationObject) => {
  const db = await useDb();
  const transaction = db.transaction([PREFABS_STORE], "readwrite");
  await db.add(PREFABS_STORE, prefab);
  await transaction.done;

  return buildServiceSuccess(prefab);
};

const getSavedObjects = async () => {
  const db = await useDb();
  const transaction = db.transaction([PREFABS_STORE], "readonly");
  const objects: SerializablePrefabAnimationObject[] = await db.getAll(PREFABS_STORE);
  await transaction.done;

  return buildServiceSuccess(objects);
};

const saveProject = async (project: SwivelProject) => {
  const db = await useDb();
  const transaction = db.transaction([PROJECTS_STORE], "readwrite");
  await db.add(PROJECTS_STORE, project);
  await transaction.done;

  return buildServiceSuccess(true);
};

const exportProject = async (_project: SwivelProject) => {
  return buildServiceError("Not implemented");
};

const getMediaResources = async () => {
  const db = await useDb();
  const transaction = db.transaction([RESOURCES_STORE], "readonly");
  const serializedResources: MediaResourceConstructorArgs[] = await db.getAll(RESOURCES_STORE);
  await transaction.done;
  const resources = serializedResources.map(sr => buildMediaResource(sr));

  return buildServiceSuccess(resources);
};

const createMediaResource = async (resource: MediaResource) => {
  const db = await useDb();
  const transaction = db.transaction([RESOURCES_STORE], "readwrite");
  await db.add(RESOURCES_STORE, resource);
  await transaction.done;

  return buildServiceSuccess(resource);
};

const webLocalService: IAPIService = {
  getServiceName,
  displayServiceInformation,
  uploadImage,
  saveSwivelObject,
  getSavedObjects,
  saveProject,
  exportProject,
  getMediaResources,
  createMediaResource,
};

export default webLocalService;