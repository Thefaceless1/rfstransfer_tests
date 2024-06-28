import {BasePage} from "./BasePage";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../framework/elements/elements";
import {logger} from "../logger/logger";
import twoFactor from "node-2fa";

export class AuthorizationPage extends BasePage {
    public readonly personId: number = 17569661
    private loginAttempts: number = 3
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка авторизации пользователя
     */
    private readonly authorizationButton: Locator = this.page.locator("//button[contains(@class,'Avatar')]")
    /**
     * Значение выпадающего списка авторизации пользователя 'Выбрать пользователя'
     */
    private readonly selectUser: Locator = this.page.locator("//a[text()='Выбрать пользователя']")
    /**
     * Поле 'Пользователь'
     */
    private readonly user: Locator = this.page.locator("//*[contains(@class,'fakeUser__indicators')]")
    /**
     * Значения выпадающего списка поля 'Пользователь'
     */
    private readonly userValues: Locator = this.page.locator("//*[contains(@class,'fakeUser__option')]")
    /**
     * Поле "E-mail"
     */
    private readonly email: Locator = this.page.locator("//input[@placeholder='E-mail']")
    /**
     * Поле "Пароль"
     */
    private readonly password: Locator = this.page.locator("//input[@name='password']")
    /**
     * Кнопка "Войти"
     */
    private readonly enterButton: Locator = this.page.locator("//button[text()='ВОЙТИ']")
    /**
     * Сообщение "Код верификации введен неверно"
     */
    private readonly invalidCodeMessage: Locator = this.page.locator("//p[text()='Неверно введён проверочный код']")
    /**
     * Кнопка закрытия сообщения об ошибке, связанной с ошибочным кодом верификции
     */
    private readonly closeInvalidCodeMessageButton: Locator = this.page.locator("//button[contains(@class,'inline-flex')]")
    /**
     * Поле "Код подтверждения"
     */
    private readonly confirmationCode: Locator = this.page.locator("//input[@placeholder='Код подтверждения']")
    /**
     * Кнопка "Подтвердить"
     */
    private readonly confirmButton: Locator = this.page.locator("//button[text()='ПОДТВЕРДИТЬ']")
    /**
     * Авторизация пользователя
     */
    public async authorization(): Promise<void> {
        await this.page.goto("/");
        if(process.env.BRANCH == "preprod") {
            await Elements.waitForVisible(this.email);
            await this.email.fill(process.env.USER_LOGIN + "@rfs.ru");
            await this.password.fill(process.env.USER_PASS!);
            await this.enterButton.click();
            if(process.env.IS_TWO_FA == "true") {
                await Elements.waitForVisible(this.confirmationCode);
                await this.setConfirmationCode();
            }
        }
        else {
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
    /**
     * Get 2FA code
     */
    private get get2FaToken(): string {
        const token = twoFactor.generateToken("MFEONTQDSEYUEMWYXWJMPJY6QZSYO2U7");
        return (token) ? token.token : this.get2FaToken;
    }
    /**
     * Ввод кода подтверждения
     */
    private async setConfirmationCode(): Promise<void> {
        if(this.loginAttempts == 0) throw new Error("Не осталось попыток входа в систему");
        const twoFaToken: string = this.get2FaToken;
        await this.confirmationCode.fill(twoFaToken);
        await this.confirmButton.click();
        await this.page.waitForTimeout(1000);
        if(await this.invalidCodeMessage.isVisible()) {
            logger.warn("Неверный код подтверждения. Ожидание генерации нового кода...");
            await this.closeInvalidCodeMessageButton.click();
            await this.waitForGenerateNewToken(twoFaToken);
            this.loginAttempts--;
            if(this.loginAttempts > 0) logger.info(`Вход в систему c новым кодом подтверждения. Осталось попыток: ${this.loginAttempts}`);
            await this.setConfirmationCode();
        }
    }
    /**
     * Ожидание генерации нового кода двухфакторной аутентификции
     */
    private async waitForGenerateNewToken(twoFaCode: string): Promise<void> {
        while (twoFaCode == this.get2FaToken) {
            await this.page.waitForTimeout(1000);
        }
    }
}