import {Locator, Page} from "@playwright/test";
import {AuthorizationPage} from "./AuthorizationPage";
import {RegistriesValues} from "../helpers/enums/RegistriesValues";

export class MainPage extends AuthorizationPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Международные переходы"
     */
    protected readonly internationalTransfersButton: Locator = this.page.locator("//a[text()='Международные переходы']")
    /**
     * Выбранное значение таба "Реестры"
     */
    protected registriesTabValue(tabValue: RegistriesValues): Locator {
        return this.page.locator(`//p[text()='Реестры']/following-sibling::*//a[text()='${tabValue}']`);
    }
}