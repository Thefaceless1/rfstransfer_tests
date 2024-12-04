import log4js from "log4js";
import path from "path";

export const logsFileName: string = "rfstransfer.log";
export const logsFilePath: string = path.resolve("src","artifacts","logs",logsFileName);
export const config: log4js.Configuration = {
    appenders: {
        file: {
            type: "file",
            filename: logsFilePath,
            flags: "w"
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ["console", "file"],
            level: "info"
        }
    }
}