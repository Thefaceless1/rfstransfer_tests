import {CreateInstructionPage} from "./CreateInstructionPage";
import {Locator, Page} from "@playwright/test";
import {Mediators} from "../helpers/enums/Mediators";
import {Elements} from "../framework/elements/elements";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";
import {ContractType} from "../helpers/types/ContractType";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {dbHelper} from "../db/db";

export class InstructionPage extends CreateInstructionPage {
    public createdContractNumber: string = InputData.randomWord
    public createdAdditionalAgreementNumber: string = InputData.randomWord
    constructor(page: Page) {
        super(page);
    }
    /**
     * Кнопка "Добавить"
     */
    private readonly addButton: Locator = this.page.locator("//span[text()='Добавить']")
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
     * Поле "Примечание"
     */
    private readonly note: Locator = this.page.locator("//textarea[@name='note']")
    /**
     * Поле "Комментарий"
     */
    private readonly comment: Locator = this.page.locator("//textarea[@name='comment']")
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
     * Кнопка "Редактировать"(иконка карандащ)
     */
    private readonly editButton: Locator = this.page.locator("//span[contains(@class,'IconEdit')]")
    /**
     * Кнопка "Отменить инструкцию"
     */
    private readonly cancelInstructionButton: Locator = this.page.locator("//button[text()='Отменить инструкцию']")
    /**
     * Действие "На доработку" выпадающего списка возможных действий с инструкцией
     */
    private readonly forRevisionAction: Locator = this.page.locator("//div[contains(text(),'На доработку')]")
    /**
     * Действие "Отменить" выпадающего списка возможных действий с инструкцией
     */
    private readonly cancelAction: Locator = this.page.locator("//div[contains(text(),'Отменить')]")
    /**
     * Иконка удаления(корзина)
     */
    private readonly deleteIcon: Locator = this.page.locator("//span[contains(@class,'IconTrash')]")
    /**
     * Кнопка "Отправить"
     */
    private readonly sendButton: Locator = this.page.locator("//button[text()='Отправить']")
    /**
     * Кнопка "Выполнить"
     */
    private readonly performButton: Locator = this.page.locator("//button[text()='Выполнить']")
    /**
     * Действие "Отклонить" выпадающего списка возможных действий с инструкцией
     */
    private readonly declineAction: Locator = this.page.locator("//div[contains(text(),'Отклонить')]")
    /**
     * Чекбокс "Посредники участвуют как сторона договора"
     */
    private readonly isWithMediators: Locator = this.page.locator("//input[@name='isWithMediators']")
    /**
     * Чекбокс "Настоящим я подтверждаю, футболист пришел свободным агентом и отсутствие третьих лиц"
     */
    private readonly isFreeConfirm: Locator = this.page.locator("//input[@name='isFreeConfirm']")
    /**
     * Действие "Подтвердить" выпадающего списка возможных действий с инструкцией
     */
    private readonly submitAction: Locator = this.page.locator("//div[contains(text(),'Подтвердить')]")
    /**
     * Кнопка "Действия с инструкцией"
     */
    private readonly instructionActionsButton: Locator = this.page.locator("//button[@data-tooltip-content='Действия с инструкцией']")
    /**
     * Получение значения поля "Номер" таблицы списка договоров и доп. соглашений по наименованию
     */
    public numberValueByName(text: string): Locator {
        return this.page.locator("//span[contains(@id,'cell-number')]",{hasText: text})
    }
    /**
     * Выбранное значение выпадающего списка поля "Сторона" блока "Посредники"
     */
    private selectedMediatorSideValue(value: Mediators): Locator {
        return this.page.locator("//div[contains(@class,'mediators.0.side__option')]",{hasText: value});
    }
    /**
     * Статус инструкции
     */
    public instructionState(stateText: InstructionStates): Locator {
        return this.page.locator("//*[contains(@class,'Badge_status')]",{hasText: stateText});
    }
    /**
     * Добавление трудового договора для инструкции
     */
    public async addContract(contactType: ContractType): Promise<void> {
        await this.addButton.click();
        if(contactType == "employmentContact") {
            await this.contractNumber.fill(this.createdContractNumber)
            await DateInput.fillDateInput(this.dateValidityFrom,InputData.currentDate);
            await DateInput.fillDateInput(this.dateValidityTo,InputData.futureDate(5));
        }
        else await this.contractNumber.fill(this.createdAdditionalAgreementNumber);
        await DateInput.fillDateInput(this.dateConclusion,InputData.currentDate);
        await this.note.fill(InputData.randomWord);
        const documentFields = await this.documents.all();
        for(const documentField of documentFields) {
            const index = documentFields.indexOf(documentField);
            (index == 0) ?
                await documentField.setInputFiles(InputData.getTestFiles("one")) :
                await documentField.setInputFiles(InputData.getTestFiles("all"));
        }
        await this.isWithMediators.click();
        await this.addMediator.click();
        await this.side.click();
        await Elements.waitForVisible(this.selectedMediatorSideValue(Mediators.club));
        await this.selectedMediatorSideValue(Mediators.club).click();
        await this.mediator.click();
        await Elements.waitForVisible(this.mediatorValues.first());
        await this.mediatorValues.first().click();
        await this.saveButton.click();
    }
    /**
     * Редактирование трудового договора
     */
    public async editContract(): Promise<void> {
        await this.editButton.click();
        this.createdContractNumber = InputData.randomWord;
        await this.contractNumber.fill(this.createdContractNumber);
        await DateInput.fillDateInput(this.dateConclusion,InputData.futureDate(5));
        await DateInput.fillDateInput(this.dateValidityFrom,InputData.futureDate(5));
        await DateInput.fillDateInput(this.dateValidityTo,InputData.futureDate(10));
        await this.addMediator.click();
        await this.side.click();
        await Elements.waitForVisible(this.selectedMediatorSideValue(Mediators.player));
        await this.selectedMediatorSideValue(Mediators.player).click();
        await this.mediator.click();
        await Elements.waitForVisible(this.mediatorValues.first());
        await this.mediatorValues.first().click();
        await this.saveButton.click();
    }
    public async deleteAdditionalAgreement(): Promise<void> {
        await this.deleteIcon.click();
        await this.deleteButton.click();
    }
    /**
     * Редактирование трудового договора
     */
    public async updateInstructionState(state: InstructionStateIds): Promise<void> {
        switch (state) {
            case InstructionStateIds.cancelled:
                await this.cancelInstructionButton.click();
                break;
            case InstructionStateIds.onRegistration:
                await dbHelper.updateInstructionState(
                    InstructionStateIds.draft,
                    (this.instructionIds.length > 1) ? this.instructionIds[1] : this.instructionIds[0]
                );
                await this.page.reload({waitUntil: "domcontentloaded"});
                await this.isFreeConfirm.click();
                await this.sendButton.click();
                break;
            case InstructionStateIds.underRevision:
                await this.instructionActionsButton.click();
                await Elements.waitForVisible(this.forRevisionAction);
                await this.forRevisionAction.click();
                await this.addCommentAndDocToAction();
                break;
            case InstructionStateIds.registerCancelled:
                await this.isFreeConfirm.click();
                await this.sendButton.click();
                await this.instructionActionsButton.click();
                await Elements.waitForVisible(this.cancelAction);
                await this.cancelAction.click();
                await this.addCommentAndDocToAction();
                break;
            case InstructionStateIds.declined:
                await dbHelper.updateInstructionState(
                    InstructionStateIds.onRegistration,
                    (this.instructionIds.length > 1) ? this.instructionIds[1] : this.instructionIds[0]
                );
                await this.page.reload({waitUntil: "domcontentloaded"});
                await this.instructionActionsButton.click();
                await Elements.waitForVisible(this.declineAction);
                await this.declineAction.click();
                await this.addCommentAndDocToAction();
                break;
            case InstructionStateIds.registered:
                await dbHelper.updateInstructionState(
                    InstructionStateIds.onRegistration,
                    (this.instructionIds.length > 1) ? this.instructionIds[1] : this.instructionIds[0]
                );
                await this.page.reload({waitUntil: "domcontentloaded"});
                await this.instructionActionsButton.click();
                await Elements.waitForVisible(this.submitAction);
                await this.submitAction.click();
                await this.addCommentAndDocToAction();
                break;
        }
    }
    /**
     * Добавление комментария, документов и выполнение выбранного решения по инструкции
     */
    private async addCommentAndDocToAction(): Promise<void> {
        await this.comment.fill(InputData.randomWord);
        await this.documents.setInputFiles(InputData.getTestFiles("all"));
        await Elements.waitForVisible(this.docIcon);
        await Elements.waitForVisible(this.xlsxIcon);
        await this.performButton.click();
    }
}