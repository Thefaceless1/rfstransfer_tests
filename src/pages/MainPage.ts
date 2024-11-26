import {Locator, Page} from "@playwright/test";
import {AuthorizationPage} from "./AuthorizationPage";

export class MainPage extends AuthorizationPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Международные переходы"
     */
    protected readonly internationalTransfersButton: Locator = this.page.locator("//a[text()='Международные переходы']")
}