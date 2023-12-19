import {BasePage} from "./BasePage";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../framework/elements/elements";

export class AuthorizationPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка авторизации пользователя
     */
    private authorizationButton: Locator = this.page.locator("//button[contains(@class,'Avatar')]")
    /**
     * Значение выпадающего списка авторизации пользователя 'Выбрать пользователя'
     */
    private selectUser: Locator = this.page.locator("//a[text()='Выбрать пользователя']")
    /**
     * Поле 'Пользователь'
     */
    private user: Locator = this.page.locator("//*[contains(@class,'fakeUser__indicators')]")
    /**
     * Значения выпадающего списка поля 'Пользователь'
     */
    private userValues: Locator = this.page.locator("//*[contains(@class,'fakeUser__option')]")
    /**
     * Авторизация пользователя
     */
    public async authorization(): Promise<void> {
        await this.page.goto("/");
        await this.authorizationButton.click();
        await Elements.waitForVisible(this.selectUser);
        await this.selectUser.click();
        await this.page.waitForTimeout(1000)
        await this.user.click();
        await Elements.waitForVisible(this.userValues.first());
        await this.userValues.first().click();
        await this.saveButton.click();
    }
}