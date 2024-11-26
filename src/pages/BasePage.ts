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
     * Кнопка "Подтвердить"
     */
    protected readonly submitButton: Locator = this.page.locator("//button[text()='Подтвердить']")
    /**
     * Кнопка "Отменить"
     */
    protected readonly cancelButton: Locator = this.page.locator("//span[text()='Отменить']")
    /**
     * Кнопка "Внутренние переходы"
     */
    protected readonly internalTransfersButton: Locator = this.page.locator("//a[text()='Внутренние переходы']")
}