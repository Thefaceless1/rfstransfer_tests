import {Locator, Page} from "@playwright/test";
import {CreateWorkActivityPage} from "./CreateWorkActivityPage";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";
import {WorkActivityStates} from "../helpers/enums/WorkActivityStates";

export class WorkActivityPage extends CreateWorkActivityPage {
    private readonly regBeginDateValue: string = InputData.currentDate
    private readonly regEndDateValue: string
    constructor(page: Page) {
        super(page);
        this.regEndDateValue = InputData.futureDate(30,this.regBeginDateValue)
    }
    /**
     * Заголовок регистрационной формы
     */
    public readonly registerFormTitle: Locator = this.page.locator("//div[text()='Данные о регистрации']")
    /**
     * Поле "Дата начала регистрации"
     */
    private readonly regBeginDate: Locator = this.page.locator("//input[@name='beginDate']")
    /**
     * Поле "Дата окончания регистрации"
     */
    private readonly regEndDate: Locator = this.page.locator("//input[@name='endDate']")
    /**
     * Поле "Должность"
     */
    private readonly position: Locator = this.page.locator("//div[contains(@class,'position__dropdown-indicator')]")
    /**
     * Кнопка "Зарегистрировать"
     */
    private readonly registerButton: Locator = this.page.locator("//button[text()='Зарегистрировать' and not(@disabled)]")
    /**
     * Чекбокс "Зарегистрировать с верификацией"
     */
    private readonly registerWithVerificationCheckBox: Locator = this.page.locator("//input[@name='isVerifyMode']")
    /**
     * Значения выпадающего списка поля "Должность"
     */
    private readonly positionDropDownValues: Locator = this.page.locator("//div[contains(@class,'position__option')]")
    /**
     * Иконка верифицированная трудовой деятельности
     */
    public readonly verifiedIcon: Locator = this.page.locator("//div[@data-tooltip-content='Верифицированная запись']")
    /**
     * Иконка трудовой деятельности, требующей повторную верификацию
     */
    public readonly reverificationRequiredIcon: Locator = this.page.locator("//div[@data-tooltip-content='Требуется повторная верификация записи']")
    /**
     * Сообщение "Запись о трудовой деятельности зарегистрирована"
     */
    public readonly workActivityRegisteredMessage: Locator = this.page.locator("//div[text()='Запись о трудовой деятельности зарегистрирована']")
    /**
     * Сообщение "Данные о регистрации сохранены"
     */
    public readonly workActivitySavedMessage: Locator = this.page.locator("//div[text()='Данные о регистрации сохранены']")
    /**
     * Регистрация трудовой деятельности
     */
    public async registerWorkActivity(): Promise<void> {
        await DateInput.fillDateInput(this.regBeginDate,this.regBeginDateValue);
        await DateInput.fillDateInput(this.regEndDate,this.regEndDateValue);
        await this.position.click();
        await this.positionDropDownValues.first().click();
        await this.addContractDocuments(true);
        await this.note.fill(InputData.randomWord);
        await this.registerButton.click();
    }
    /**
     * Верификация трудовой деятельности
     */
    public async verifyWorkActivity(): Promise<void> {
        await this.registerWithVerificationCheckBox.check();
        await this.saveButton.click();
    }
    /**
     * Редактирование трудовой деятельности
     */
    public async editWorkActivity(state: WorkActivityStates): Promise<void> {
        switch (state) {
            case WorkActivityStates.registered:
                await this.position.click();
                await this.positionDropDownValues.last().click();
                break;
            case WorkActivityStates.verified:
                const newRegEndDateValue: string = InputData.futureDate(1,this.regEndDateValue);
                await DateInput.fillDateInput(this.regEndDate,newRegEndDateValue);
        }
        await this.saveButton.click();
    }
}