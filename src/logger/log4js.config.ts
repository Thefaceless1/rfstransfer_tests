import log4js from "log4js";
import {logService} from "./LogService.js";

export const config: log4js.Configuration = {
    appenders: {
        file: {
            type: "file",
            filename: logService.logsFilePath,
            flags: "w"
        }
    },
    categories: {
        default: {
            appenders: ["file"],
            level: "info"
        }
    }
}