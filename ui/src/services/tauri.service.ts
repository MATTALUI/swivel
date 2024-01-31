import OptionalTauri from "../Tauri";
import type PrefabAnimationObject from "../models/PrefabAnimationObject";
import SwivelProject from "../models/SwivelProject";
import {
  type APIServiceFailure,
  type APIServiceSuccess,
  type IAPIService,
  type SerializablePrefabAnimationObject,
  TauriServerFunctions
} from "../types";

// If we're using the service without a tauri instance then we deserve the errors
const Tauri = OptionalTauri!;
const SERVICE_NAME = "Tauri Service";

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

const uploadImage = async (_b64: string) => {
  return buildServiceError("Not implemented");
};

const saveSwivelObject = async (prefab: PrefabAnimationObject) => {
  try {
    const { invoke } = Tauri.tauri;
    // await new Promise(res => setTimeout(res, 1000));
    const saveData = JSON.stringify(prefab.toSerializableObject());
    await invoke(TauriServerFunctions.SAVE_PREFAB, { saveData });

    return buildServiceSuccess(prefab);
  } catch (e) {
    console.error(e);
    return buildServiceError((e as Error).message);
  }
};

const getSavedObjects = async () => {
  const { invoke } = Tauri.tauri;
  const prefabs = await invoke<SerializablePrefabAnimationObject[]>(TauriServerFunctions.LOAD_PREFABS);
  return buildServiceSuccess(prefabs);
};

const saveProject = async (project: SwivelProject) => {
  const projectData = project.serialize();
  const { invoke } = Tauri.tauri;
  await invoke(TauriServerFunctions.SAVE, { projectData });

  return buildServiceSuccess(true);
};

const exportProject = async (project: SwivelProject) => {
  const projectData = project.serialize();
  const { invoke } = Tauri.tauri;
  await invoke(TauriServerFunctions.EXPORT, { projectData });

  return buildServiceSuccess(true);
};

const tauriService: IAPIService = {
  getServiceName,
  displayServiceInformation,
  uploadImage,
  saveSwivelObject,
  getSavedObjects,
  saveProject,
  exportProject,
};

export default tauriService;