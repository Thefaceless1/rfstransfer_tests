import {Cookie, Locator, Page} from "@playwright/test";
import {PlaywrightDevPage} from "./PlaywrightDevPage";
import {CookieNameType} from "../helpers/types/CookieNameType";
import {InputData} from "../helpers/InputData";
import {Elements} from "../framework/elements/Elements";
import {SelectedFilesType} from "../helpers/types/SelectedFilesType";
import {dbService} from "../db/DbService";

export class BasePage extends PlaywrightDevPage {
    protected readonly maxServerResponseTime: number = 61000
    protected readonly person: string = (process.env.BRANCH == "preprod") ? "Техническая учетная запись ручная ОРСТ" : "Автотест Трансфер"
    public readonly personId: number = (process.env.BRANCH == "preprod") ? 17600913 : 17611861
    public readonly clubId: number = (process.env.BRANCH == "preprod") ? 333890 : 279720
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
     * Поле "Дата окончания регистрации"
     */
    protected readonly regEndDate: Locator = this.page.locator("//input[@name='endDate']")
    /**
     * Кнопка "Отправить"
     */
    protected readonly sendButton: Locator = this.page.locator("//button[not(@disabled)]//span[text()='Отправить']")
    /**
     * Кнопка "Отменить"
     */
    protected readonly cancelButton: Locator = this.page.locator("//*[text()='Отменить']")
    /**
     * Кнопка "Удалить"
     */
    protected readonly deleteButton: Locator = this.page.locator("//button[text()='Удалить']")
    /**
     * Заголовок "Управление контрактами"
     */
    protected readonly contractManagementTitle: Locator = this.page.locator("//a[text()='Управление контрактами']")
    /**
     * Поле "Примечание"
     */
    protected readonly note: Locator = this.page.locator("//textarea[@name='note']")
    /**
     * Поле "Документы"
     */
    protected readonly documents: Locator = this.page.locator("//input[@type='file' and not(@disabled)]")
    /**
     * Иконка файла выбранного формата
     */
    protected fileIcon(format: SelectedFilesType): Locator {
        const formatWithRegister: string = format[0].toUpperCase()+format.slice(1).toLowerCase();
        return this.page.locator(`//*[contains(@class,'FileIcon${formatWithRegister}')]//..//..//..//following-sibling::button`);
    }

    /**
     * Получение значений cookie страницы
     */
    protected async pageCookie(cookieName: CookieNameType): Promise<string> {
        const cookies: Cookie[] = await this.page.context().cookies();
        const cookieValue: string | undefined = cookies.find(cookie => cookie.name == cookieName)?.value;
        if (!cookieValue) throw new Error(`Отсутствует cookie: ${cookieName}`);
        return cookieValue;
    }
    /**
     * Добавление документов для контрактов, доп. соглашений, трансферных соглашений и МТС
     */
    protected async addContractDocuments(isRegisterWorkActivity: boolean): Promise<void> {
        const documentFields: Locator[] = await this.documents.all();
        for (const documentField of documentFields) {
            const index = documentFields.indexOf(documentField);
            if (index == 0 && !isRegisterWorkActivity) continue;
            else if ((index == 1 && !isRegisterWorkActivity) || (index == 0 && isRegisterWorkActivity)) {
                await documentField.setInputFiles(InputData.getTestFiles("pdf"));
                await Elements.waitForVisible(this.fileIcon("pdf"));
            }
            else {
                await documentField.setInputFiles(InputData.getTestFiles("png"));
                await Elements.waitForVisible(this.fileIcon("png"));
                await documentField.setInputFiles(InputData.getTestFiles("jpg"));
                await Elements.waitForVisible(this.fileIcon("jpg"));
            }
        }
    }
    /**
     * Удаление созданных данных из БД для тестового пользователя
     */
    public async deleteTestUserData(): Promise<void> {
        await dbService.deleteFifaSending(this.personId);
        await dbService.deleteInstructions(this.personId);
        await dbService.deleteEmployeeContracts(this.personId);
    }
}