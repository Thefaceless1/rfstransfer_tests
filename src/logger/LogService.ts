import path from "path";
import * as fs from "fs";

class LogService {
    public readonly logsFileName: string = "rfstransfer.log"
    public readonly logsFilePath: string = path.resolve("src","artifacts","logs",this.logsFileName)
    /**
     * Удаление данных из лог файла
     */
    public async clearLogFile(): Promise<void> {
        if (fs.existsSync(this.logsFilePath)) {
            fs.truncate(this.logsFilePath,0,err => {
                if (err) console.log('Ошибка при очистке файла:', err);
            });
        }
    }
}
export const logService = new LogService();