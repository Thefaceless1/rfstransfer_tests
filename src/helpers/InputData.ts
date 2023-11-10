import {randomInt} from "crypto";

export class InputData {
    /**
     * Get current date
     */
    public static currentDate: string = new Date().toLocaleDateString('ru-RU');
    /**
     * Test annotation date
     */
    public static get testAnnotationDate(): string {
        return new Date().toLocaleString('ru-RU',{timeZone: 'Europe/Moscow'});
    }
    /**
     * Random set of letters
     */
    public static get randomWord(): string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];
        }
        return randomWord;
    }
}