import {
  openDB,
  type IDBPDatabase,
} from "idb";
import type PrefabAnimationObject from "../models/PrefabAnimationObject";
import SwivelProject from "../models/SwivelProject";
import type {
  APIServiceFailure,
  APIServiceSuccess,
  IAPIService,
  SerializablePrefabAnimationObject,
} from "../types";

const SERVICE_NAME = "Web Local Service";
const DB_NAME = "SWIVEL::DATABASE";
const PROJECTS_STORE = "SWIVEL::PROJECTS";
const PREFABS_STORE = "SWIVEL::PREFABS";

// Do not touch once committed!
const DB_MIGRATIONS = [
  (db: IDBPDatabase) => {
    const projects = db.createObjectStore(PROJECTS_STORE, { keyPath: "id" });
    projects.createIndex("name", "name", { unique: false });
    const prefabs = db.createObjectStore(PREFABS_STORE, { keyPath: "id" });
    prefabs.createIndex("name", "name", { unique: false });
  },
];

const DBVersion = DB_MIGRATIONS.length;

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
        const migration = DB_MIGRATIONS[i];
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
  // Right now we just use the b64 image as the public image, might investigate
  // putting into indexdb in the future
  return buildServiceSuccess(b64);
};

const saveSwivelObject = async (prefab: PrefabAnimationObject) => {
  const db = await useDb();
  const transaction = db.transaction([PREFABS_STORE], "readwrite");
  db.add(PREFABS_STORE, prefab);
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
  db.add(PROJECTS_STORE, project.toSerializableObject());
  await transaction.done;

  return buildServiceSuccess(true);
};

const exportProject = async (_project: SwivelProject) => {
  return buildServiceError("Not implemented");
};

const webLocalService: IAPIService = {
  getServiceName,
  displayServiceInformation,
  uploadImage,
  saveSwivelObject,
  getSavedObjects,
  saveProject,
  exportProject,
};

export default webLocalService;