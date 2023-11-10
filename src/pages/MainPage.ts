import {BasePage} from "./BasePage";
import {Locator, Page} from "@playwright/test";

export class MainPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Создание инструкции"
     */
    protected readonly createInstructionButton: Locator = this.page.locator("//p[text()='Создание инструкции']")
}