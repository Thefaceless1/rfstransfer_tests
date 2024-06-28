import {CreateInstructionPage} from "./CreateInstructionPage";
import {Locator, Page} from "@playwright/test";
import {Mediators} from "../helpers/enums/Mediators";
import {Elements} from "../framework/elements/elements";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {logger} from "../logger/logger";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {CreateInstructionOptionsType} from "../helpers/types/CreateInstructionOptionsType";
import {randomInt} from "crypto";
import {dbHelper} from "../db/DbHelper";
import {InstructionSubTypes} from "../helpers/enums/InstructionSubTypes";

export class InstructionPage extends CreateInstructionPage {
    public prevContractStopDateValue: string= ''
    public additionalAgreementDateEndByDs: string= ''
    public readonly createdContractNumber: string = InputData.randomWord
    public readonly additionalAgreementWithChangeDate: string = InputData.randomWord
    public readonly additionalAgreementWithoutChangeDate: string = InputData.randomWord
    public readonly createdTransferAgreementNumber: string = InputData.randomWord
    private readonly correctionReason: string = InputData.randomWord
    private readonly registerComment: string = InputData.randomWord
    public readonly contractDurationDays: number = 30
    public readonly extendContractCountDays: number = 5
    public readonly prevContractPrevClubStartDate: string
    public readonly prevContractPrevClubEndDate: string
    public readonly prevContractNewClubStartDate: string = InputData.currentDate
    public readonly prevContractNewClubEndDate: string
    public readonly newContractStartDate: string
    public readonly newContractEndDate: string
    constructor(page: Page) {
        super(page);
        this.prevContractPrevClubEndDate = InputData.futureDate(-1,this.prevContractNewClubStartDate)
        this.prevContractPrevClubStartDate = InputData.futureDate(-this.contractDurationDays,this.prevContractPrevClubEndDate)
        this.prevContractNewClubEndDate = InputData.futureDate(this.contractDurationDays,this.prevContractNewClubStartDate)
        this.newContractStartDate = InputData.futureDate(1,this.prevContractNewClubEndDate)
        this.newContractEndDate = InputData.futureDate(this.contractDurationDays,this.newContractStartDate)
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
     * Значение поля "Номер соглашения"
     */
    private readonly transferNumber: Locator = this.page.locator("//input[@name='transferNumber']")
    /**
     * Значение поля "Дата заключения контракта"
     */
    private readonly signingDate: Locator = this.page.locator("//input[@name='conclusionDate']")
    /**
     * Значение поля "Дата завершения ТД в предыдущем клубе"
     */
    private readonly prevContractStopDate: Locator = this.page.locator("//input[@name='prevContractStopDate']")
    /**
     * Значение поля "Дата заключения"
     */
    private readonly dateConclusion: Locator = this.page.locator("//input[@name='dateConclusion']")
    /**
     * Значение поля "Причина отклонения"
     */
    public readonly correctionReasonValue: Locator = this.page.locator(`//*[text()='${this.correctionReason}']`)
    /**
     * Значение поля "Комментарий к регистрации"
     */
    public readonly registerCommentValue: Locator = this.page.locator(`//*[text()='${this.registerComment}']`)
    /**
     * Значение поля "Дата подписания соглашения"
     */
    private readonly signingAgreementDate: Locator = this.page.locator("//input[@name='conclusionDate']")
    /**
     * Значение поля "Срок действия с"
     */
    private readonly contractStartDate: Locator = this.page.locator("//input[@name='dateValidityFrom']")
    /**
     * Значение поля "Срок действия по"
     */
    private readonly contractEndDate: Locator = this.page.locator("//input[@name='dateValidityTo']")
    /**
     * Поле "Примечание"
     */
    private readonly note: Locator = this.page.locator("//textarea[@name='note']")
    /**
     * Заголовок поля "Примечание"
     */
    private readonly noteTitle: Locator = this.page.locator("//*[text()='Примечание']")
    /**
     * Поле "Дата начала регистрации"
     */
    public readonly regBeginDate: Locator = this.page.locator("//input[@name='regBeginDate']")
    /**
     * Поле "Дата окончания регистрации"
     */
    public readonly regEndDate: Locator = this.page.locator("//input[@name='regEndDate']")
    /**
     * Поле "Комментарий"
     */
    private readonly comment: Locator = this.page.locator("//input[@name='comment']")
    /**
     * Поле "Комментарий к регистрации"
     */
    private readonly commentForRegister: Locator = this.page.locator("//textarea[@name='regNote']")
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
     * Кнопка "Зарегистрировать"
     */
    private readonly registerButton: Locator = this.page.locator("//span[text()='Зарегистрировать']")
    /**
     * Кнопка "На исправление"
     */
    private readonly forCorrectionButton: Locator = this.page.locator("//button[text()='На исправление']")
    /**
     * Иконка удаления(корзина)
     */
    private readonly deleteIcon: Locator = this.page.locator("//span[contains(@class,'IconTrash')]")
    /**
     * Поле "Новый срок действия ТД по ДС"
     */
    private readonly dateEndByDS: Locator = this.page.locator("//input[@name='dateEndByDS']")
    /**
     * Заголовок поля "Комментарий к регистрации"
     */
    private readonly commentForRegistrationTitle: Locator = this.page.locator("//*[text()='Комментарий к регистрации']")
    /**
     * Иконка критичной коллизии
     */
    private readonly criticalCollisionIcon: Locator = this.page.locator("//span[contains(@class,'IconAlert')]")
    /**
     * Иконка некритичной коллизии
     */
    private readonly notCriticalCollisionIcon: Locator = this.page.locator("//span[contains(@class,'IconWarning')]")
    /**
     * Поле "Причина"
     */
    private readonly reason: Locator = this.page.locator("//*[contains(@class,'reason__indicators')]")
    /**
     * Значения выпадающего списка поля "Причина"
     */
    private readonly reasonValues: Locator = this.page.locator("//*[contains(@class,'reason__option')]")
    /**
     * Кнопка "Отправить"
     */
    private readonly sendButton: Locator = this.page.locator("//span[text()='Отправить']")
    /**
     * Радиобаттон "Без изменения срока действия ТД"
     */
    private readonly withoutDeadlinesChangeDS: Locator = this.page.locator("//span[text()='Без изменения срока действия ТД']")
    /**
     * Радиобаттон "С изменением срока действия ТД"
     */
    private readonly withDeadlinesChangeDS: Locator = this.page.locator("//span[text()='С изменением срока действия ТД']")
    /**
     * Текущий пользователь
     */
    public readonly currentUser: Locator = this.page.locator("(//*[contains(@class,'Avatar')]//following-sibling::*//p)[1]")
    /**
     * Текущий пользователь
     */
    public readonly nominatedUser: Locator = this.page.locator("//div[text()='Ответственный РФС']/..//following-sibling::*//*//a")
    /**
     * Кнопка "Добавить ДС"
     */
    private readonly addAdditionalAgreementButton: Locator = this.page.locator("//button[not(@disabled)]//span[text()='Добавить ДС']")
    /**
     * Кнопка "Далее"
     */
    private readonly onwardButton: Locator = this.page.locator("//button[text()='Далее']")
    /**
     * Поле "% от будущей выплаты"
     */
    private readonly resalePercent: Locator = this.page.locator("//input[@name='Resale.0.percent']")
    /**
     * Кнопка "Назначить на себя"
     */
    private readonly nominateYourselfButton: Locator = this.page.locator("//button[text()='Назначить на себя']")
    /**
     * Радио баттон "Да" для поля "Футбольный агент(ы), представляющий клуб и/или футболиста в связи с подписанием трудового договора?"
     */
    private readonly withMediatorsRadio: Locator = this.page.locator("//input[@name='withMediatorsType']//following-sibling::span[@class='Radio-Label' and text()='Да']")
    /**
     * Радио баттон "С приостановлением ТД" поля "Тип арендного соглашения"
     */
    private readonly withSuspensionContractRadio: Locator = this.page.locator("//span[@class='Radio-Label' and text()='С приостановлением ТД']")
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
     * Значение столбца "Тип платежа" в таблице добавленных платежей
     */
    public paymentTypeColumnValue(paymentType: PaymentTypes): Locator {
        return this.page.locator("//*[@col-id='type']//*//span",{hasText: paymentType});
    }
    /**
     * Радиобаттон "Проходил ли футболист спортивную подготовку в другой НА?"
     */
    private isOtherMemberAssociationRadio(isOtherMemberAssociation: boolean): Locator {
        return (isOtherMemberAssociation) ?
            this.page.locator("//input[@name='isOtherMemberAssociation']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isOtherMemberAssociation']//following-sibling::span[text()='Нет']");
    }
    /**
     * Радиобаттон "Были ли согласованы какие-либо платежи за переход?"
     */
    private isInstructionWithPayments(isWithPayments: boolean): Locator {
        return (isWithPayments) ?
            this.page.locator("//input[@name='isInstructionWithPayments']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isInstructionWithPayments']//following-sibling::span[text()='Нет']");
    }
    /**
     * Радиобаттон "Плата за выпуск (выкуп)"
     */
    private isWithBuyout(isWithBuyout: boolean): Locator {
        return (isWithBuyout) ?
            this.page.locator("//input[@name='isWithBuyout']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isWithBuyout']//following-sibling::span[text()='Нет']");
    }
    /**
     * Поле "Общая сумма" выбранного типа платежа
     */
    private totalAmount(paymentType: PaymentTypes): Locator {
        switch (paymentType) {
            case PaymentTypes.fixedPayment: return this.page.locator("//input[@name='Fix.0.summa']");
            case PaymentTypes.conditionalPayment: return this.page.locator("//input[@name='Conditional.0.summa']");
            case PaymentTypes.ransomPayment: return this.page.locator("//input[@name='Buyout.0.summa']");
            default: throw new Error("Поле 'Общая сумма' не существует для указанного типа платежа'");
        }
    }
    /**
     * Поле "Сумма платежа" выбранного типа платежа
     */
    private paymentAmount(paymentType: PaymentTypes): Locator {
        switch (paymentType) {
            case PaymentTypes.fixedPayment: return this.page.locator("//input[@name='Fix.0.parts.0.summa']");
            case PaymentTypes.conditionalPayment: return this.page.locator("//input[@name='Conditional.0.parts.0.summa']");
            case PaymentTypes.ransomPayment: return this.page.locator("//input[@name='Buyout.0.parts.0.summa']");
            default: throw new Error("Поле 'Сумма платежа' не существует для указанного типа платежа'");
        }
    }
    /**
     * Поле "Валюта" выбранного типа платежа
     */
    private currency(paymentType: PaymentTypes): Locator {
        switch (paymentType) {
            case PaymentTypes.fixedPayment: return this.page.locator("//*[contains(@class,'Fix.0.currency__indicators')]");
            case PaymentTypes.conditionalPayment: return this.page.locator("//*[contains(@class,'Conditional.0.currency__indicators')]");
            case PaymentTypes.ransomPayment: return this.page.locator("//*[contains(@class,'Buyout.0.currency__indicators')]");
            default: throw new Error("Поле 'Валюта' не существует для указанного типа платежа'");
        }
    }
    /**
     * Значения выпадающего списка поля "Валюта" выбранного типа платежа
     */
    private currencyValues(paymentType: PaymentTypes): Locator {
        switch (paymentType) {
            case PaymentTypes.fixedPayment: return this.page.locator("//*[contains(@class,'Fix.0.currency__option')]");
            case PaymentTypes.conditionalPayment: return this.page.locator("//*[contains(@class,'Conditional.0.currency__option')]");
            case PaymentTypes.ransomPayment: return this.page.locator("//*[contains(@class,'Buyout.0.currency__option')]");
            default: throw new Error("Поле 'Список валют' не существует для указанного типа платежа'");
        }
    }
    /**
     * Поле "Примечание" выбранного типа платежа
     */
    private paymentNote(paymentType: PaymentTypes): Locator {
        switch (paymentType) {
            case PaymentTypes.fixedPayment: return this.page.locator("//textarea[@name='Fix.0.note']");
            case PaymentTypes.conditionalPayment: return this.page.locator("//textarea[@name='Conditional.0.note']");
            case PaymentTypes.ransomPayment: return this.page.locator("//textarea[@name='Buyout.0.note']");
            case PaymentTypes.resalePayment: return this.page.locator("//textarea[@name='Resale.0.note']");
        }
    }
    /**
     * Поле "Дата" выбранного типа платежа
     */
    private paymentDate(paymentType: PaymentTypes): Locator {
        switch (paymentType) {
            case PaymentTypes.fixedPayment: return this.page.locator("//input[@name='Fix.0.parts.0.planeDate']");
            case PaymentTypes.conditionalPayment: return this.page.locator("//input[@name='Conditional.0.parts.0.planeDate']");
            case PaymentTypes.ransomPayment: return this.page.locator("//input[@name='Buyout.0.parts.0.planeDate']");
            default: throw new Error("Поле 'Дата' не существует для указанного типа платежа'");
        }
    }
    /**
     * Добавление контракта
     */
    public async addContract(startDate: string, endDate: string): Promise<void> {
        await this.contractNumber.fill(this.createdContractNumber)
        await DateInput.fillDateInput(this.contractStartDate,startDate);
        await DateInput.fillDateInput(this.contractEndDate,endDate);
        await DateInput.fillDateInput(this.dateConclusion,startDate);
        await this.noteTitle.click();
        await this.note.fill(InputData.randomWord);
        await this.addContractDocuments();
        await this.addMediators();
        await this.onwardButton.click();
    }
    /**
     * Добавление дополнительного соглашения
     */
    public async addAdditionalAgreement(isWithChangeDates: boolean, conclusionDate: string): Promise<void> {
        if(isWithChangeDates) {
            if(await this.addAdditionalAgreementButton.isVisible()) await this.addAdditionalAgreementButton.click();
            await this.withDeadlinesChangeDS.click();
            await DateInput.fillDateInput(this.dateEndByDS,InputData.futureDate(this.contractDurationDays+this.extendContractCountDays));
            const dateEndByDsValue: string | null = await this.dateEndByDS.getAttribute("value");
            if(dateEndByDsValue) this.additionalAgreementDateEndByDs = dateEndByDsValue;
            if(await this.reason.isVisible()) {
                await this.reason.click();
                await this.reasonValues.first().click();
            }
            await this.contractNumber.fill(this.additionalAgreementWithChangeDate);
        }
        else {
            await this.addAdditionalAgreementButton.click();
            if(await this.withoutDeadlinesChangeDS.isVisible()) await this.withoutDeadlinesChangeDS.click();
            await this.contractNumber.fill(this.additionalAgreementWithoutChangeDate);
        }
        await DateInput.fillDateInput(this.dateConclusion,conclusionDate);
        await this.noteTitle.click();
        await this.note.fill(InputData.randomWord);
        await this.addContractDocuments();
        await this.addMediators();
        await this.onwardButton.click();
    }
    /**
     * Добавление трансферного соглашения
     */
    public async addTransferAgreement(instructionSubType: InstructionSubTypes): Promise<void> {
        await this.addButton.click();
        await this.transferNumber.fill(this.createdTransferAgreementNumber);
        await DateInput.fillDateInput(this.signingDate,InputData.currentDate);
        if(instructionSubType == InstructionSubTypes.tsWithBuyoutAndTermination) {
            await this.reason.click();
            await this.reasonValues.first().click();
        }
        const prevContractStopDateValue: string | null = await this.prevContractStopDate.getAttribute("value");
        if(prevContractStopDateValue) this.prevContractStopDateValue = prevContractStopDateValue;
        /*await this.addButton.click();
        await this.transferNumber.fill(this.createdTransferAgreementNumber);
        await this.withSuspensionContractRadio.click();
        await DateInput.fillDateInput(this.signingAgreementDate,InputData.currentDate);*/
        await this.addContractDocuments();
        await this.addMediators();
        await this.onwardButton.click();
    }
    /**
     * Добавление посредников
     */
    private async addMediators(): Promise<void> {
        await this.withMediatorsRadio.click();
        await this.side.click();
        await Elements.waitForVisible(this.selectedMediatorSideValue(Mediators.player));
        await this.selectedMediatorSideValue(Mediators.player).click();
        await this.mediator.click();
        await Elements.waitForVisible(this.mediatorValues.first());
        await this.mediatorValues.first().click();
    }
    /**
     * Добавление документов для контрактов, доп. соглашение и трансферных соглашений
     */
    private async addContractDocuments(): Promise<void> {
        const documentFields = await this.documents.all();
        for(const documentField of documentFields) {
            const index = documentFields.indexOf(documentField);
            (index == 0) ?
                await documentField.setInputFiles(InputData.getTestFiles("pdf")) :
                await documentField.setInputFiles(InputData.getTestFiles("all"));
        }
    }
    /**
     * Удаление дополнительного соглашения
     */
    public async deleteAdditionalAgreement(): Promise<void> {
        await this.deleteIcon.click();
        await this.yesButton.click();
    }
    /**
     * Изменение статуса для инструкции
     */
    public async updateInstructionState(state: InstructionStateIds): Promise<void> {
        switch (state) {
            case InstructionStateIds.onRegistration:
                await this.sendButton.click();
                break;
            case InstructionStateIds.onCorrection:
                await this.forCorrectionButton.click();
                await this.addCommentAndDocsToAction(InstructionStates.onCorrection);
                break;
            case InstructionStateIds.registered:
                await this.sendButton.click();
                await this.commentForRegistrationTitle.click();
                await this.addCommentAndDocsToAction(InstructionStates.registered);
                if(await this.criticalCollisionIcon.isVisible() || await this.notCriticalCollisionIcon.isVisible())
                    logger.warn("В инструкции присутствует коллизия");
                if(await this.isOtherMemberAssociationRadio(false).isVisible())
                    await this.isOtherMemberAssociationRadio(false).click();
                await this.registerButton.click();
                break;
        }
    }
    /**
     * Добавление комментария, документов и выполнение выбранного решения по инструкции
     */
    private async addCommentAndDocsToAction(expectedInstructionState: InstructionStates): Promise<void> {
        if(expectedInstructionState == InstructionStates.registered) {
            await this.commentForRegistrationTitle.click();
            await this.documents.setInputFiles(InputData.getTestFiles("all"));
            await this.commentForRegister.fill(this.registerComment);
        }
        else {
            await this.documents.last().setInputFiles(InputData.getTestFiles("all"));
            if(expectedInstructionState == InstructionStates.onCorrection) await this.comment.fill(this.correctionReason);
        }
        if(expectedInstructionState != InstructionStates.registered) await this.sendButton.click();
    }
    /**
     * Назначение себя ответственным за инструкцию
     */
    public async nominationYourselfForInstruction(): Promise<void> {
        await this.nominateYourselfButton.click();
    }
    /**
     * Добавление выплат для инструкций
     */
    public async addPayments(): Promise<void> {
        await this.isInstructionWithPayments(true).click();
        await this.isWithBuyout(true).click();
        for(const paymentType of Object.values(PaymentTypes)) {
            if(paymentType != PaymentTypes.resalePayment) {
                const paymentAmount: number = randomInt(10,10000);
                await this.totalAmount(paymentType).fill(String(paymentAmount));
                await this.paymentAmount(paymentType).fill(String(paymentAmount));
                await this.currency(paymentType).click();
                await this.currencyValues(paymentType).first().click();
                await this.paymentNote(paymentType).fill(InputData.randomWord);
                await DateInput.fillDateInput(this.paymentDate(paymentType),InputData.currentDate);
            }
            else {
                await this.resalePercent.fill(String(randomInt(1,100)));
                await this.paymentNote(paymentType).fill(InputData.randomWord);
            }
        }
        await this.onwardButton.click();
    }
    /**
     * Создание и регистрация тестовой инструкций 'Новый трудовой договор' для сценария проверки инструкций других типов
     */
    public async addTestEmploymentContract(createOptions: CreateInstructionOptionsType): Promise<void> {
        await this.createInstruction({
            type: createOptions.type,
            clubId: createOptions.clubId
        });
        (createOptions.clubId == this.clubId) ?
            await this.addContract(this.prevContractNewClubStartDate,this.prevContractNewClubEndDate) :
            await this.addContract(this.prevContractPrevClubStartDate,this.prevContractPrevClubEndDate);
        await this.updateInstructionState(InstructionStateIds.registered);
        await Elements.waitForVisible(this.instructionState(InstructionStates.registered));
    }
    /**
     * Метод проверки изменения дат для предыдущих договоров с предыдущим и новым клубами
     */
    public async checkPrevContractsDateChanges(instructionSubType: InstructionSubTypes): Promise<boolean> {
        const prevContractPrevClub = await dbHelper.getPreviousContract(this.personId,this.srcClubId);
        const prevContractNewClub = await dbHelper.getPreviousContract(this.personId,this.clubId);
        const prevContractPrevClubStopDate: string = prevContractPrevClub[0]["stop_date"].toLocaleDateString();
        const prevContractPrevClubEndDate: string = prevContractPrevClub[0]["actual_end_date"].toLocaleDateString();
        //const prevContractNewClubStopDate: string = prevContractNewClub[0]["stop_date"].toLocaleDateString();
        const prevContractNewClubEndDate: string = prevContractNewClub[0]["actual_end_date"].toLocaleDateString();
        switch (instructionSubType) {
            case InstructionSubTypes.tsWithoutBuyout:
                logger.info(`
                 ${InstructionSubTypes.tsWithoutBuyout}:
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, введено: ${this.prevContractStopDateValue}
                `);
                return prevContractPrevClubStopDate == this.prevContractStopDateValue;
            case InstructionSubTypes.tsWithBuyoutAndTermination:
                logger.info(`
                 ${InstructionSubTypes.tsWithBuyoutAndTermination}:
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: actual_end_date: ${prevContractPrevClubEndDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: actual_end_date: ${prevContractNewClubEndDate}, указано: ${this.newContractStartDate}
                `);
                return (
                    prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    prevContractNewClubEndDate == this.newContractStartDate
                )
            case InstructionSubTypes.tsWithBuyoutWithoutTermination:
                logger.info(`
                 ${InstructionSubTypes.tsWithBuyoutAndTermination}:
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: actual_end_date: ${prevContractPrevClubEndDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: actual_end_date: ${prevContractNewClubEndDate}, указано: ${this.additionalAgreementDateEndByDs}
                `);
                return (
                    prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    prevContractNewClubEndDate == this.additionalAgreementDateEndByDs
                )
        }
    }
}