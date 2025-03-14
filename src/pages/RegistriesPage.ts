import {MainPage} from "./MainPage";
import {Download, expect, Locator, Page} from "@playwright/test";
import {RegistriesValues} from "../helpers/enums/RegistriesValues";
import {Elements} from "../framework/elements/Elements";
import path from "path";
import xlsx from 'xlsx';
import {ApiService} from "../api/ApiService";
import {ServerResponseType} from "../helpers/types/ServerResponseType";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";

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
     * Иконка лоадера
     */
    private readonly loader: Locator = this.page.locator("//*[@class='ProgressSpin-Circle']")
    /**
     * Кнопка "Назначить на себя"
     */
    private readonly nominateYourselfButton: Locator = this.page.locator("//button[text()='Назначить на себя']")
    /**
     * Кнопка "Завершить регистрацию"
     */
    private readonly endRegisterButton: Locator = this.page.locator("//button[text()='Завершить регистрацию']")
    /**
     * Кнопка "Назначить"
     */
    private readonly nominateButton: Locator = this.page.locator("//button[text()='Назначить' and not(@disabled)]")
    /**
     * Кнопка "Применить фильтры"
     */
    private readonly acceptFilters: Locator = this.page.locator("//button[text()='Применить фильтры' and not(@disabled)]")
    /**
     * Поле "Гражданство"
     */
    private readonly citizenship: Locator = this.page.locator("//div[contains(@class,'citizenshipCountry__dropdown-indicator')]")
    /**
     * Поле "Показать фильтры"
     */
    private readonly showFilters: Locator = this.page.locator("//div[text()='Показать фильтры']")
    /**
     * Поле с ФИО текущего пользователя
     */
    private readonly currentUserData: Locator = this.page.locator("//div[contains(@class,'items-center')]//p[1]")
    /**
     * Поле "Выберите ответственного сотрудника"
     */
    private readonly selectResponsiblePerson: Locator = this.page.locator("//div[contains(@class,'designatedEmployee__indicators')]")
    /**
     * Поле "Выберите ответственного сотрудника"
     */
    private readonly responsiblePersonDropdownValues: Locator = this.page.locator("//div[contains(@class,'designatedEmployee__option')]//div//div[1]")
    /**
     * Значения столбца "Ответственный" реестра "Список инструкций"
     */
    private readonly responsiblePersonValues: Locator = this.page.locator("//span[contains(@id,'cell-designatedEmployee')]")
    /**
     * Чекбокс в столбце "Назначение" реестра "Список инструкций"
     */
    private readonly nominationCheckbox: Locator = this.page.locator("//div[@ref='eCheckbox']//input[@ref='eInput']")
    /**
     * Чекбокс для записи таблицы
     */
    private readonly tableRecordCheckbox: Locator = this.page.locator("//div[@ref='eCheckbox']//input[@ref='eInput']")
    /**
     * Кнопка "Верифицировать"
     */
    private readonly verifyButton: Locator = this.page.locator("//button[text()='Верифицировать']")
    /**
     * Кнопка "Завершить"
     */
    private readonly endButton: Locator = this.page.locator("//button[text()='Завершить']")
    /**
     * Значение "Верифицирована" столбца "Верификация" в строке таблицы
     */
    public readonly verifiedRecord: Locator = this.page.locator("//span[@class='ag-cell-value' and text()='Верифицированная']")
    /**
     * Значение "Завершенная" столбца "Статус регистрации" в строке таблицы
     */
    public readonly completedRecord: Locator = this.page.locator("//span[@class='ag-cell-value']//div[text()='Завершенная']")
    /**
     * Поле для поиска значений в фильтре
     */
    private readonly filterSearchField: Locator = this.page.locator("//input[@class='selection__input']")
    /**
     * Чекбокс найденных значений в фильтре
     */
    private readonly filterValuesCheckbox: Locator = this.page.locator("//input[contains(@class,'Checkbox-Input')]")
    /**
     * Количество отображаемых, а также общее количество записей в таблице реестра
     */
    private readonly paginationRecordsInfo: Locator = this.page.locator("//li[contains(@class,'ant-pagination-total-text')]//div")
    /**
     * Кнопка фильтра в поле "Физическое лицо"
     */
    private readonly personFilterButton: Locator = this.page.locator("//span[text()='Физическое лицо']//..//preceding-sibling::*//span[contains(@class,'IconFunnel')]")
    /**
     * Кнопка выгрузки таблицы в excel
     */
    private readonly downloadButton: Locator = this.page.locator("//button[@data-tooltip-content='Выгрузить в формате xlsx, исходя из выбранных параметров в таблице']")
    /**
     * Наименования столбцов таблицы на модальном окне "Настройка отображения столбцов"
     */
    private readonly columnValues: Locator = this.page.locator("//div[@col-id='columnId']//span[@class='ag-cell-value']//div[not(text()='Назначение' or text()='Выбор')]")
    /**
     * Значения выпадающего списка поля "Гражданство" по их наименованию
     */
    private citizenshipDropdownValues(text: string): Locator {
        return this.page.locator(`//div[contains(@class,'citizenshipCountry__option')]//div[text()='${text}']`);
    }
    /**
     * Выгрузка выбранного реестра в excel
     */
    public async exportRegistryToExcel(registry: RegistriesValues): Promise<void> {
        await this.registriesTabValue(registry).click();
        if (registry == RegistriesValues.contractsRegistry) await this.setGlobalFilters();
        await this.showColumns();
        const systemColumns: string[] = await this.columnValues.allInnerTexts();
        const totalRecordsCount: number = await this.totalRecordsCount();
        await this.acceptButton.click();
        const [excelColumns, excelRecordsCount] = await this.excelData();
        expect(excelRecordsCount).toBe(totalRecordsCount);
        expect(excelColumns).toEqual(systemColumns);
    }
    /**
     * Установка глобального фильтра в реестре ТД
     */
    private async setGlobalFilters(): Promise<void> {
        await this.showFilters.click();
        await this.citizenship.click();
        const selectedFilterValue: string = "Все, кроме РФ";
        await this.citizenshipDropdownValues(selectedFilterValue).click();
        await this.page.keyboard.press('Escape');
        await this.acceptFilters.click();
        await Elements.waitForVisible(this.loader);
        await Elements.waitForHidden(this.loader,this.maxServerResponseTime);
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
        const downloadPromise: Promise<Download> = this.page.waitForEvent('download',{timeout: this.maxServerResponseTime});
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
    /**
     * Назначение ответственного на инструкцию
     */
    public async nominateResponsiblePerson(isMyself: boolean): Promise<void> {
        if (isMyself) await this.nominationCheckbox.first().click();
        let expectedUserSurname: string;
        if (isMyself) {
            expectedUserSurname = await this.getPersonSurname(this.currentUserData);
            await this.nominateYourselfButton.click();
        }
        else {
            await this.selectResponsiblePerson.click();
            expectedUserSurname = await this.getPersonSurname(this.responsiblePersonDropdownValues.first());
            await this.responsiblePersonDropdownValues.first().click();
            await this.nominateButton.click();
        }
        await Elements.waitForVisible(this.loader);
        await Elements.waitForHidden(this.loader);
        const nominatedUserSurname: string = await this.getPersonSurname(this.responsiblePersonValues.first());
        expect(nominatedUserSurname).toBe(expectedUserSurname);
    }
    /**
     * Получение фамилии сотрудника из его ФИО
     */
    private async getPersonSurname(locator: Locator): Promise<string> {
        const personValue: string = await locator.innerText();
        const regExp: RegExp = /[А-Яа-я\w]+(?=\s)/;
        const regExpData = regExp.exec(personValue);
        if (!regExpData) throw new Error("Отсутствует значение после применения рег. выражения к значению пользователя");
        return regExpData[0];
    }
    /**
     * Создание и регистрация трудовой деятельности через вызов api
     */
    public async registerPreliminaryWorkActivity(): Promise<void> {
        const xCsrfToken: string = await this.pageCookie("XSRF-TOKEN");
        const jSessionId: string = await this.pageCookie("JSESSIONID");
        const apiService = new ApiService(xCsrfToken,jSessionId);
        const response: ServerResponseType = await apiService.addWorkActivity({
            page: this.page,
            orgId: this.clubId,
            personId: this.personId
        });
        const workActivityId: number = Number(response.data);
        await apiService.registerWorkActivity({
            page: this.page,
            workActivityId: workActivityId
        });
    }
    /**
     * Массовая верификация трудовой деятельности
     */
    public async massVerifyWorkActivity(): Promise<void> {
        await this.setPersonFilter();
        await this.tableRecordCheckbox.click();
        await this.verifyButton.click();
        await Elements.waitForVisible(this.cancelButton);
        await this.verifyButton.last().click();
    }
    /**
     * Массовое завершение трудовой деятельности
     */
    public async massEndWorkActivity(): Promise<void> {
        await this.endRegisterButton.click();
        const endDate: string = InputData.futureDate(-1,InputData.currentDate);
        await DateInput.fillDateInput(this.regEndDate,endDate);
        await this.sendButton.click();
        await this.endButton.click();
    }
    /**
     * Установка фильтра в поле "Физическое лицо"
     */
    private async setPersonFilter(): Promise<void> {
        await this.personFilterButton.click();
        await this.filterSearchField.fill(this.person);
        await this.filterValuesCheckbox.click();
        await this.acceptButton.click();
        const expectedFilteredRecords: number = 1;
        await expect(this.tableRecordCheckbox).toHaveCount(expectedFilteredRecords);
    }
}