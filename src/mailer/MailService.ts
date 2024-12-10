import archiver from "archiver";
import * as fs from "fs";
import path from "path";
import {archivePath, mailOptions, transporter} from "./mailer.config.js";

class MailService {
    /**
     * Архивация папки с отчетами и отправка архива на указанные адреса
     */
    public sendReport(): void {
        const output: fs.WriteStream = fs.createWriteStream(archivePath);
        const archive: archiver.Archiver = archiver('zip', {zlib: {level: 9}});
        archive.on("error", error => {
            console.log(`При архивации отчета произошла ошибка: ${error}`);
        });
        archive.on("close", () => {
            console.log("Архивация отчета завершена");
            transporter.sendMail(mailOptions,(err) => {
                (err) ?
                    console.log(`Ошибка отправки отчета ${err}`) :
                    console.log(`Отчет отправлен на указанные адреса`);
            })
        });
        archive.pipe(output);
        const archiveDirectory: string = path.resolve("src","artifacts");
        archive.directory(archiveDirectory, false);
        archive.finalize();
    }
}
export const mailService = new MailService();
mailService.sendReport();