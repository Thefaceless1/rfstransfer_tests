import {mailOptions, transporter} from "./mailer.config.js";
import {logger} from "../logger/logger.js";

transporter.sendMail(mailOptions,(err) => {
    (err) ?
        logger.error(`Ошибка отправки отчета ${err}`) :
        logger.info(`Отчет отправлен на указанные адреса`);
})