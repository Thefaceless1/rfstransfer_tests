import {CreateInstructionPage} from "./CreateInstructionPage";
import {Locator, Page} from "@playwright/test";
import {Mediators} from "../helpers/enums/Mediators";
import {Elements} from "../framework/elements/elements";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";

export class InstructionPage extends CreateInstructionPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Добавить"
     */
    private readonly addButton: Locator = this.page.locator("//span[text()='Добавить']")
    /**
     * Наименование инструкции
     */
    public readonly instructionName: Locator = this.page.locator("//div[contains(text(),'Инструкция') and not(contains(text(),'создана'))]")
    /**
     * Значение поля "Номер договора"
     */
    private readonly contractNumber: Locator = this.page.locator("//input[@name='contractNumber']")
    /**
     * Значение поля "Дата заключения"
     */
    private readonly dateConclusion: Locator = this.page.locator("//input[@name='dateConclusion']")
    /**
     * Значение поля "Срок действия с"
     */
    private readonly dateValidityFrom: Locator = this.page.locator("//input[@name='dateValidityFrom']")
    /**
     * Значение поля "Срок действия по"
     */
    private readonly dateValidityTo: Locator = this.page.locator("//input[@name='dateValidityTo']")
    /**
     * Значение поля "Примечание"
     */
    private readonly note: Locator = this.page.locator("//textarea[@name='note']")
    /**
     * Поле "Документы"
     */
    private readonly documents: Locator = this.page.locator("//input[@type='file']")
    /**
     * Поле "Сторона"
     */
    private readonly side: Locator = this.page.locator("//div[contains(@class,'mediators.0.side__indicators')]")
    /**
     * Поле "Посредники"
     */
    private readonly mediator: Locator = this.page.locator("//div[contains(@class,'mediators.0.person__indicators')]")
    /**
     * Значения выпадающего списка поля "Посредники"
     */
    private readonly mediatorValues: Locator = this.page.locator("//div[contains(@class,'mediators.0.person__option')]")
    /**
     * Кнопка "Добавить посредника"
     */
    private readonly addMediator: Locator = this.page.locator("//span[text()='Добавить посредника']")
    /**
     * Иконка файла с расширением "doc"
     */
    private readonly docIcon: Locator = this.page.locator("//*[contains(@class,'FileIconDoc')]")
    /**
     * Иконка файла с расширением "xlsx"
     */
    private readonly xlsxIcon: Locator = this.page.locator("//*[contains(@class,'FileIconXls')]")
    /**
     * Поле с номером созданного трудового договора
     */
    public readonly createContractNumber: Locator = this.page.locator("//span[contains(@id,'cell-number')]")
    /**
     * Выбранное значение выпадающего списка поля "Сторона" блока "Посредники"
     */
    private selectedMediatorSideValue(value: Mediators): Locator {
        return this.page.locator("//div[contains(@class,'mediators.0.side__option')]",{hasText: value});
    }
    /**
     * Добавление трудового договора для инструкции
     */
    public async addContract(): Promise<void> {
        await this.addButton.click();
        await this.contractNumber.fill(InputData.randomWord)
        await DateInput.fillDateInput(this.dateConclusion,InputData.currentDate);
        await DateInput.fillDateInput(this.dateValidityFrom,InputData.currentDate);
        await DateInput.fillDateInput(this.dateValidityTo,InputData.futureDate(5));
        await this.note.fill(InputData.randomWord);
        await this.documents.setInputFiles(InputData.getTestFiles);
        await Elements.waitForVisible(this.docIcon);
        await Elements.waitForVisible(this.xlsxIcon);
        await this.side.click();
        await Elements.waitForVisible(this.selectedMediatorSideValue(Mediators.club));
        await this.selectedMediatorSideValue(Mediators.club).click();
        await this.mediator.click();
        await Elements.waitForVisible(this.mediatorValues.first());
        await this.mediatorValues.first().click();
        await this.saveButton.click();
    }
}