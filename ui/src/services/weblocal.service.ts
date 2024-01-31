import type PrefabAnimationObject from "../models/PrefabAnimationObject";
import SwivelProject from "../models/SwivelProject";
import type {
  APIServiceFailure,
  APIServiceSuccess,
  IAPIService,
} from "../types";

const SERVICE_NAME = "Web Local Service";

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

const saveSwivelObject = async (_prefab: PrefabAnimationObject) => {
  return buildServiceError("Not implemented");
};

const getSavedObjects = async () => {
  return buildServiceError("Not implemented");
};

const saveProject = async (_project: SwivelProject) => {
  console.log(SERVICE_NAME, "saveProject", _project);
  return buildServiceError("Not implemented");
};

const exportProject = async (_project: SwivelProject) => {
  console.log(SERVICE_NAME, "exportProject", _project);
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