import type {
  IAPIService,
  APIServiceFailure
} from "../types";

const SERVICE_NAME = "None";
const ERROR_MESSAGE = "Services Unavailable";

const serviceError = async (justThrow: boolean = true): Promise<APIServiceFailure> => {
  if (justThrow) throw new Error(ERROR_MESSAGE);
  return {
    service: SERVICE_NAME,
    success: false,
    error: ERROR_MESSAGE,
    data: null,
  };
};

const getServiceName = () => SERVICE_NAME;

const displayServiceInformation = () => {
  console.log(`CURRENT SERVICE: ${SERVICE_NAME}`);
  console.error("All service calls will throw errors");
  return false;
};

const uploadImage = async () => serviceError();
const getSavedObjects = async () => serviceError();
const saveSwivelObject = async () => serviceError();
const saveProject = async () => serviceError();
const exportProject = async () => serviceError();

const unsupportedService: IAPIService = {
  getServiceName,
  displayServiceInformation,
  uploadImage,
  getSavedObjects,
  saveSwivelObject,
  saveProject,
  exportProject,
};

export default unsupportedService;