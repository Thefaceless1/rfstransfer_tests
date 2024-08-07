import {Locator, Page} from "@playwright/test";
import {PlaywrightDevPage} from "./PlaywrightDevPage";

export class BasePage extends PlaywrightDevPage{
    constructor(page: Page) {
        super(page)
    }
    /**
     * Кнопка "Создать"
     */
    protected readonly createButton: Locator = this.page.locator("//span[text()='Создать']")
    /**
     * Кнопка "Сохранить"
     */
    protected readonly saveButton: Locator = this.page.locator("//button[text()='Сохранить']")
    /**
     * Кнопка "Да"
     */
    protected readonly yesButton: Locator = this.page.locator("//button[text()='Да']")
}