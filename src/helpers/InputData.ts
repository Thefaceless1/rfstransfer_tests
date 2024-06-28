import {randomInt} from "crypto";
import * as fs from "fs";
import path from "path";
import { fileURLToPath} from "url";
import {SelectedFilesType} from "./types/SelectedFilesType";

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
    public static futureDate(plusDaysCount: number, fromDate?: string): string {
        const msInOneDay: number = 86400000;
        const day: number = Number(fromDate?.slice(0,2));
        const month: number = Number(fromDate?.slice(3,5))-1;
        const year: number = Number(fromDate?.slice(6));
        const msCountForFutureDate: number = (fromDate) ?
            new Date(year,month,day).getTime() + (plusDaysCount * msInOneDay) :
            Date.now() + (plusDaysCount * msInOneDay);
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
    public static getTestFiles(selectedFiles: SelectedFilesType): string[] | string {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const testFilesPath: string = path.resolve(__dirname, "testfiles");
        const fileNames: string[] = fs.readdirSync(testFilesPath);
        const files = fileNames.map(fileName => {
            const obj = {
                dir: testFilesPath,
                base: fileName
            }
            return path.format(obj);
        });
        if(selectedFiles == "all") return files;
        else {
           const selectedFormatFile: string | undefined = files.find(file => file.toLowerCase().includes(selectedFiles));
           if(!selectedFormatFile) throw new Error(`Отсутствует файл формата ${selectedFiles}`);
           return selectedFormatFile;
        }
    }
}