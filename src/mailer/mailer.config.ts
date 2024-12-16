import nodemailer, {SendMailOptions} from 'nodemailer'
import * as Process from "process";
import 'dotenv/config'
import path from "path";

export const archiveName: string = "report.zip";
export const archivePath: string = path.resolve("src",archiveName);
export const transporter = nodemailer.createTransport({
    service: 'SMTP',
    host: Process.env.MAIL_HOST,
    port: Number(Process.env.MAIL_PORT),
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})

export const mailOptions: SendMailOptions = {
    from: Process.env.MAIL_FROM,
    to: Process.env.MAIL_TO!.split(",").map(address => address.trim()),
    subject: `Отчет по автотестам для модуля Управления контрактами версии ${Process.env.APP_VERSION} от ${new Date().toLocaleDateString('ru-RU')}`,
    text: 'Распакуйте архив и откройте файл index.html для просмотра отчета',
    attachments: [
        {
            filename: archiveName,
            path: archivePath
        }
    ]
}