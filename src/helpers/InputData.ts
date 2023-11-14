import {randomInt} from "crypto";
import * as fs from "fs";
import path from "path";
import { fileURLToPath} from "url";

export class InputData {
    /**
     * Текущая дата
     */
    public static currentDate: string = new Date().toLocaleDateString('ru-RU');
    /**
     * Дата для аннотации в тесте
     */
    public static get testAnnotationDate(): string {
        return new Date().toLocaleString('ru-RU',{timeZone: 'Europe/Moscow'});
    }
    /**
     * Будащая дата с указанным добавленным кол-вом дней
     */
    public static futureDate(plusDaysCount: number): string {
        const msInOneDay: number = 86400000;
        const msCountForFutureDate: number = Date.now() + (plusDaysCount * msInOneDay);
        return new Date(msCountForFutureDate).toLocaleDateString('ru-RU');
    }
    /**
     * Случайный набор букв
     */
    public static get randomWord(): string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "тест|";
        while (randomWord.length < 15) {
            randomWord += alphabet[randomInt(0, alphabet.length)];
        }
        return randomWord;
    }
    /**
     * Получение тестовых файлов из репозитория
     */
    public static get getTestFiles(): string[] {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const testFilesPath: string = path.resolve(__dirname, "testfiles");
        const fileNames: string[] = fs.readdirSync(testFilesPath);
        return fileNames.map(fileName => {
            const obj = {
                dir: testFilesPath,
                base: fileName
            }
            return path.format(obj);
        });
    }
}