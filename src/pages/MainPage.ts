import {Locator, Page} from "@playwright/test";
import {AuthorizationPage} from "./AuthorizationPage";

export class MainPage extends AuthorizationPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Создание инструкции"
     */
    protected readonly createInstructionButton: Locator = this.page.locator("//p[text()='Создание инструкции']")
}