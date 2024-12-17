import {MainPage} from "./MainPage";
import {Download, expect, Locator, Page} from "@playwright/test";
import {RegistriesValues} from "../helpers/enums/RegistriesValues";
import {Elements} from "../framework/elements/Elements";
import path from "path";
import xlsx from 'xlsx';

export class RegistriesPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Отображение столбцов"
     */
    private readonly displayColumnsButton: Locator = this.page.locator("//button[@data-tooltip-content='Отображение столбцов']")
    /**
     * Непроставленные чекбоксы для столбцов таблицы на модальном окне "Настройка отображения столбцов"
     */
    private readonly nonCheckedColumnCheckboxes: Locator = this.page.locator("//input[contains(@name,'isVisible') and not(@checked)]")
    /**
     * Кнопка "Применить"
     */
    private readonly acceptButton: Locator = this.page.locator("//button[text()='Применить']")
    /**
     * Количество отображаемых, а также общее количество записей в таблице реестра
     */
    private readonly paginationRecordsInfo: Locator = this.page.locator("//li[contains(@class,'ant-pagination-total-text')]//div")
    /**
     * Кнопка выгрузки таблицы в excel
     */
    private readonly downloadButton: Locator = this.page.locator("//button[@data-tooltip-content='Выгрузить в формате xlsx, исходя из выбранных параметров в таблице']")
    /**
     * Наименования столбцов таблицы на модальном окне "Настройка отображения столбцов"
     */
    private readonly columnValues: Locator = this.page.locator("//div[@col-id='columnId']//span[@class='ag-cell-value']//div[not(text()='Назначение' or text()='Выбор')]")
    /**
     * Выгрузка выбранного реестра в excel
     */
    public async exportRegistryToExcel(registry: RegistriesValues): Promise<void> {
        await this.registriesTabValue(registry).click();
        await this.showColumns();
        const systemColumns: string[] = await this.columnValues.allInnerTexts();
        const totalRecordsCount: number = await this.totalRecordsCount();
        await this.acceptButton.click();
        const [excelColumns, excelRecordsCount] = await this.excelData();
        expect(excelRecordsCount).toBe(totalRecordsCount);
        expect(excelColumns).toEqual(systemColumns);
    }
    /**
     * Проставление видимости для всех имеющихся столбцов таблиц
     */
    private async showColumns(): Promise<void> {
        await this.displayColumnsButton.click();
        await Elements.waitForVisible(this.columnValues.first());
        const nonCheckedCheckboxCount: number = await this.nonCheckedColumnCheckboxes.count();
        if (nonCheckedCheckboxCount > 0) {
            for (let i = 0; i < nonCheckedCheckboxCount; i++) {
                await this.nonCheckedColumnCheckboxes.nth(i).click();
            }
        }
    }
    /**
     * Сохранение файла.Метод возвращает путь к сохраненному файлу
     */
    private async saveFile(): Promise<string> {
        const maxServerResponseTime: number = 61000;
        const downloadPromise: Promise<Download> = this.page.waitForEvent('download',{timeout: maxServerResponseTime});
        await this.downloadButton.click();
        const download: Download = await downloadPromise;
        let fileSavePath: string = await download.path();
        const guidSymbolCount: number = 36;
        const fileSavePathSymbols: number = fileSavePath.length;
        fileSavePath = fileSavePath.slice(0,fileSavePathSymbols - guidSymbolCount);
        fileSavePath = path.join(fileSavePath,download.suggestedFilename());
        await download.saveAs(fileSavePath);
        return fileSavePath;
    }
    /**
     * Получение данных из excel файла (наименования столбцов и общего количества записей)
     */
    private async excelData(): Promise<[string[],number]> {
        const fileSavePath: string = await this.saveFile();
        const workbook: xlsx.WorkBook = xlsx.readFile(fileSavePath);
        const sheetName: string = workbook.SheetNames[0];
        const sheet: xlsx.WorkSheet = workbook.Sheets[sheetName];
        const jsonData: Object[] = xlsx.utils.sheet_to_json(sheet);
        const columns: string[] = Object.keys(jsonData[0]);
        const recordsCount: number = jsonData.length;
        return [columns,recordsCount];
    }
    /**
     * Получение общего количества записей в реестрах
     */
    private async totalRecordsCount(): Promise<number> {
        const locatorText: string = await this.paginationRecordsInfo.first().innerText();
        const regExp: RegExp = /(?<=из\s)\d+/;
        const regExpData: RegExpMatchArray | null = regExp.exec(locatorText);
        if (!regExpData) throw new Error("Отсутствует значение общего кол-ва записей реестра после применения рег. выражения");
        return Number(regExpData[0]);
    }
}