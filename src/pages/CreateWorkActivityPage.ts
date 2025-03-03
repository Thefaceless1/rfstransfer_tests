import {MainPage} from "./MainPage";
import {Locator, Page} from "@playwright/test";

export class CreateWorkActivityPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Поле "Физическое лицо"
     */
    private readonly individual: Locator = this.page.locator("//div[contains(@class,'person__dropdown-indicator')]")
    /**
     * Поле для ввода значения для поиска физического лица
     */
    private readonly individualInput: Locator = this.page.locator("//input[@class='person__input']")
    /**
     * Значение физического лица в выпадающем списке
     */
    private readonly individualValue: Locator = this.page.locator(`//*[contains(@class,'person__option')]//*[contains(text(),'${this.person}')]`)
    /**
     * Поле "Организация"
     */
    private readonly organization: Locator = this.page.locator("//*[contains(@class,'organization__dropdown-indicator')]")
    /**
     * Поле для ввода значения для поиска организации
     */
    private readonly organizationInput: Locator = this.page.locator("//input[contains(@class,'organization__input')]")
    /**
     * Значение выпадающего списка поля "Организация"
     */
    private organizationValue(clubId: number): Locator {
        return this.page.locator(`//*[contains(@class,'organization__option')]//div//div[contains(text(),'${clubId}')]`);
    }
    /**
     * Добавление записи о трудовой деятельности
     */
    public async addWorkActivity(): Promise<void> {
        await this.registerEmployeeButton.click();
        await this.individual.click();
        await this.individualInput.fill(this.person);
        await this.individualValue.click();
        await this.organization.click();
        await this.organizationInput.fill(String(this.clubId));
        await this.organizationValue(this.clubId).click();
        await this.createButton.click();
    }
}