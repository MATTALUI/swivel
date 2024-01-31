import Tauri from "../Tauri";
import type { IAPIService } from "../types";
import tauriService from "./tauri.service";
import unsupportedService from "./unsupported.service";
import webLocalService from "./weblocal.service";

let APIService: IAPIService = unsupportedService;
if ("indexedDB" in window) APIService = webLocalService;
if (Tauri) APIService = tauriService;

export default APIService;