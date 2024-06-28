import nodemailer, {SendMailOptions} from 'nodemailer'
import * as path from "path";
import * as Process from "process";
import 'dotenv/config'
import Mail from "nodemailer/lib/mailer";
import * as fs from "fs";
import {logsFileName, logsFilePath} from "../logger/log4js.config.js";

export const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: Process.env.MAIL_HOST,
    secure: true,
    auth: {
        user: Process.env.MAIL_FROM,
        pass: Process.env.MAIL_PASS
    }
})

export const mailOptions: SendMailOptions = {
    from: Process.env.MAIL_FROM,
    to: Process.env.MAIL_TO!.split(",").map(address => address.trim()),
    subject: `Отчет по автотестам для модуля 'Трансфер' версии ${Process.env.APP_VERSION} от ${new Date().toLocaleDateString('ru-RU')}`,
    text: 'Скачайте прикрепленный файл для просмотра отчета',
    attachments: getAttachments()
}

function getAttachments(): Mail.Attachment[] {
    const attachments: Mail.Attachment[] = [
        {
            filename: 'index.html',
            path: path.resolve("src","artifacts","report","index.html")
        }
    ]
    const logPath: string = path.resolve("src","artifacts","logs");
    const logFolder: string[] = fs.readdirSync(logPath);
    if(logFolder.length > 0) attachments.push(getLogFile());
    const screenshotsPath: string = path.resolve("src","artifacts","screenshots");
    const screenshotsFolder: string[] = fs.readdirSync(screenshotsPath);
    if(screenshotsFolder.length > 0) {
        screenshotsFolder.forEach(subFolder => {
            const subFolderPath: string = screenshotsPath + "/" + subFolder;
            const filesArray: string[] = fs.readdirSync(subFolderPath);
            if(filesArray.length > 0) {
                filesArray.forEach(file => {
                    const filePath: string = subFolderPath + "/" + file;
                    attachments.push({
                        filename: file,
                        path: path.resolve(filePath)
                    })
                })
            }
        })
    }
    return attachments;
}

function getLogFile(): Mail.Attachment {
    return {
        filename: logsFileName,
        path: logsFilePath
    }
}