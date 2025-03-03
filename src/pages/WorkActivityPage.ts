import {Locator, Page} from "@playwright/test";
import {CreateWorkActivityPage} from "./CreateWorkActivityPage";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";

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
     * Чекбокс "Подтверждаю, что вышеуказанная информация является достоверной и правильной"
     */
    private readonly isApprovedCheckBox: Locator = this.page.locator("//input[@name='isApproved']")
    /**
     * кнопка "Зарегистрировать без верификации"
     */
    private readonly registerWithoutVerifyButton: Locator = this.page.locator("//button[text()='Зарегистрировать без верификации' and not(@disabled)]")
    /**
     * Значения выпадающего списка поля "Должность"
     */
    private readonly positionDropDownValues: Locator = this.page.locator("//div[contains(@class,'position__option')]")
    /**
     * Кнопка "Верифицировать"
     */
    private readonly verifyButton: Locator = this.page.locator("//button[text()='Верифицировать']")
    /**
     * Иконка верифицированная трудовой деятельности
     */
    public readonly verifiedActivityIcon: Locator = this.page.locator("//div[@data-tooltip-content='Верифицированная запись']")
    /**
     * Сообщение "Запись о трудовой деятельности зарегистрирована"
     */
    public readonly workActivityRegisteredMessage: Locator = this.page.locator("//div[text()='Запись о трудовой деятельности зарегистрирована']")
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
        await this.isApprovedCheckBox.check();
        await this.registerWithoutVerifyButton.click();
    }
    /**
     * Верификация трудовой деятельности
     */
    public async verifyWorkActivity(): Promise<void> {
        await this.verifyButton.click();
    }
}