import nodemailer, {SendMailOptions} from 'nodemailer'
import * as path from "path";
import * as Process from "process";
import 'dotenv/config'

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
    attachments: [
        {
            filename: 'index.html',
            path: path.resolve("src","artifacts","report","index.html")
        }
    ]
}