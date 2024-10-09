import {CreateInstructionPage} from "./CreateInstructionPage";
import {Locator, Page} from "@playwright/test";
import {Mediators} from "../helpers/enums/Mediators";
import {Elements} from "../framework/elements/elements";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {logger} from "../logger/logger";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {CreateInstructionOptionsType} from "../helpers/types/CreateInstructionOptionsType";
import {randomInt} from "crypto";
import {dbHelper} from "../db/DbHelper";
import {TransferAgreementSubTypes} from "../helpers/enums/TransferAgreementSubTypes";
import {TransferAgreementRentSubTypes} from "../helpers/enums/TransferAgreementRentSubTypes";
import {TransferContractType} from "../helpers/enums/TransferContractType";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {SelectedFilesType} from "../helpers/types/SelectedFilesType";
import {PlayerStates} from "../helpers/enums/PlayerStates";
import {RegistrationTypes} from "../helpers/enums/RegistrationTypes";
import {IntTransferSubTypes} from "../helpers/enums/IntTransferSubTypes";

export class InstructionPage extends CreateInstructionPage {
    public prevContractStopDateValue: string = ''
    public prevContractRestartDateValue: string = ''
    public additionalAgreementDateEndByDs: string = ''
    public readonly createdContractNumber: string = InputData.randomWord
    public readonly additionalAgreementWithChangeDate: string = InputData.randomWord
    public readonly additionalAgreementWithoutChangeDate: string = InputData.randomWord
    public readonly additionalAgreementForTk: string = InputData.randomWord
    public readonly createdTransferAgreementNumber: string = InputData.randomWord
    private readonly registerComment: string = InputData.randomWord
    public readonly contractDurationDays: number = 30
    public readonly extendContractCountDays: number = 5
    public readonly prevContractNewClubStartDate: string
    public readonly prevContractNewClubEndDate: string
    public readonly prevContractPrevClubStartDate: string
    public readonly prevContractPrevClubEndDate: string
    public readonly newContractStartDate: string
    public readonly newContractEndDate: string
    public readonly earlyFinishPrevContractStartDate: string = InputData.currentDate
    public readonly earlyFinishPrevContractEndDate: string
    constructor(page: Page) {
        super(page);
        this.earlyFinishPrevContractEndDate = InputData.futureDate(this.contractDurationDays,this.earlyFinishPrevContractStartDate)
        this.prevContractNewClubEndDate = InputData.futureDate(-1,this.earlyFinishPrevContractStartDate)
        this.prevContractNewClubStartDate = InputData.futureDate(-this.contractDurationDays,this.prevContractNewClubEndDate)
        this.prevContractPrevClubEndDate = InputData.futureDate(-1,this.prevContractNewClubStartDate)
        this.prevContractPrevClubStartDate = InputData.futureDate(-this.contractDurationDays,this.prevContractPrevClubEndDate)
        this.newContractStartDate = InputData.futureDate(1,this.earlyFinishPrevContractEndDate)
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
     * Значение поля "Номер контракта"
     */
    private readonly transferNumber: Locator = this.page.locator("//input[@name='transferNumber']")
    /**
     * Значение поля "Дата заключения контракта"
     */
    private readonly signingDate: Locator = this.page.locator("//input[@name='conclusionDate']")
    /**
     * Значение поля "Дата завершения ТД в предыдущем клубе"
     */
    public readonly prevContractStopDate: Locator = this.page.locator("//input[@name='prevContractStopDate']")
    /**
     * Значение поля "Дата заключения" или "Дата выдачи МТС"
     */
    private readonly dateConclusion: Locator = this.page.locator("//input[@name='dateConclusion' or @name='conclusionDate']")
    /**
     * Значение поля "Комментарий к регистрации"
     */
    public readonly registerCommentValue: Locator = this.page.locator(`//*[text()='${this.registerComment}']`)
    /**
     * Значение поля "Дата возобновления ТД с предыдущим клубом"
     */
    private readonly prevContractRestartDate: Locator = this.page.locator("//input[@name='prevContractRestartDate']")
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
     * Поле "Комментарий к регистрации"
     */
    private readonly commentForRegister: Locator = this.page.locator("//textarea[@name='regNote']")
    /**
     * Поле "Документы"
     */
    private readonly documents: Locator = this.page.locator("//input[@type='file' and not(@disabled)]")
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
     * Поле "Новый срок действия ТД по ДС"
     */
    private readonly dateEndByDS: Locator = this.page.locator("//input[@name='dateEndByDS']")
    /**
     * Заголовок поля "Комментарий к регистрации"
     */
    private readonly commentForRegistrationTitle: Locator = this.page.locator("//*[text()='Комментарий к регистрации']")
    /**
     * Поле "Причина"
     */
    private readonly reason: Locator = this.page.locator("//*[contains(@class,'reason__indicators')]")
    /**
     * Уведомление "Сведения о международном переходе сохранены"
     */
    public readonly mtsSavedNotification: Locator = this.page.locator("//*[text()='Сведения о международном переходе сохранены']")
    /**
     * Значения выпадающего списка поля "Причина"
     */
    private readonly reasonValues: Locator = this.page.locator("//*[contains(@class,'reason__option')]")
    /**
     * Поле "ID перехода"
     */
    private readonly transitionId: Locator = this.page.locator("//input[@name='transitionNumber']")
    /**
     * Поле "Дисциплина"
     */
    private readonly discipline: Locator = this.page.locator("//*[contains(@class,'discipline__dropdown')]")
    /**
     * Значения выпадающего списка поля "Дисциплина"
     */
    private readonly disciplineValues: Locator = this.page.locator("//*[contains(@class,'discipline__option')]")
    /**
     * Поле "Особая отметка МТС"
     */
    private readonly specialMarkMts: Locator = this.page.locator("//*[contains(@class,'specialMark__dropdown')]")
    /**
     * Значения выпадающего списка поля "Особая отметка МТС"
     */
    private readonly specialMarkMtsValues: Locator = this.page.locator("//*[contains(@class,'specialMark__option')]")
    /**
     * Радиобаттон "Без изменения срока действия ТД"
     */
    private readonly withoutDeadlinesChangeDS: Locator = this.page.locator("//span[text()='Без изменения срока действия ТД']")
    /**
     * Радиобаттон "С изменением срока действия ТД"
     */
    private readonly withDeadlinesChangeDS: Locator = this.page.locator("//span[text()='С изменением срока действия ТД']")
    /**
     * Кнопка "Добавить ДС"
     */
    private readonly addAdditionalAgreementButton: Locator = this.page.locator("//button[not(@disabled)]//span[text()='Добавить ДС']")
    /**
     * Кнопка "Добавить ДС для ТК"
     */
    private readonly addAdditionalAgreementForTkButton: Locator = this.page.locator("//span[text()='Трансферный контракт на условиях «аренды»']//..//following-sibling::button[not(@disabled)]//span[text()='Добавить ДС']")
    /**
     * Кнопка "Далее"
     */
    private readonly onwardButton: Locator = this.page.locator("//button[text()='Далее']")
    /**
     * Кнопка "Сформировать МТС"
     */
    private readonly formMtsButton: Locator = this.page.locator("//button[text()='Сформировать МТС' and not(@disabled)]")
    /**
     * Название сформированного МТС файла
     */
    private readonly intTransferFileName: Locator = this.page.locator("//*[contains(text(),'International_Transfer_Certificate')]")
    /**
     * Чекбокс "Не записывать в историю переходов"
     */
    private readonly skipHistoryChangeCheckBox: Locator = this.page.locator("//input[@name='skipHistoryChange']")
    /**
     * Поле "% от будущей выплаты"
     */
    private readonly resalePercent: Locator = this.page.locator("//input[@name='Resale.0.percent']")
    /**
     * Радио баттон "Да" для поля "Футбольный агент(ы), представляющий клуб и/или футболиста в связи с подписанием трудового договора?"
     */
    private readonly withMediatorsRadio: Locator = this.page.locator("//input[@name='withMediatorsType']//following-sibling::span[@class='Radio-Label' and text()='Да']")
    /**
     * Радио баттон "С приостановлением ТД" поля "Тип арендного контракта"
     */
    private readonly withSuspensionContractRadio: Locator = this.page.locator("//span[@class='Radio-Label' and text()='с приостановлением ТД']")
    /**
     * Радио баттон "С разрывом ТД" поля "Тип арендного соглашения"
     */
    private readonly withTerminationContractRadio: Locator = this.page.locator("//span[@class='Radio-Label' and text()='с разрывом ТД']")
    /**
     * Получение значения поля "Номер" таблицы списка договоров и доп. соглашений по наименованию
     */
    public numberValueByName(text: string): Locator {
        return this.page.locator("//span[contains(@id,'cell-number')]",{hasText: text})
    }
    /**
     * Заголовок с выбранным типом инструкции
     */
    public instructionTypeTitle(instructionType: InstructionTypes): Locator {
        return this.page.locator(`//section[@id='content']//*//*[text()='${instructionType}']`);
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
     * Иконка файла выбранного формата
     */
    public fileIcon(format: SelectedFilesType): Locator {
        const formatWithRegister: string = format[0].toUpperCase()+format.slice(1).toLowerCase();
        return this.page.locator(`//*[contains(@class,'FileIcon${formatWithRegister}')]//..//..//..//following-sibling::button`);
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
     * Радиобаттон "Статус футболиста в прежней национальной ассоциации"
     */
    private prevAssociationPlayerStateRadio(playerState: PlayerStates): Locator {
        return (playerState == PlayerStates.professional) ?
            this.page.locator("//input[@name='isPrevProfessionalOption']//following-sibling::span[text()='Профессионал']") :
            this.page.locator("//input[@name='isPrevProfessionalOption']//following-sibling::span[text()='Любитель']");
    }
    /**
     * Радиобаттон "Спортивные (дисциплинарные) санкции"
     */
    private isWithSportSanctionsRadio(isWithSanction: boolean): Locator {
        return (isWithSanction) ?
            this.page.locator("//input[@name='isWithSportSanctionsOption']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isWithSportSanctionsOption']//following-sibling::span[text()='Нет']");
    }
    /**
     * Радиобаттон "МТС"
     */
    private isWithMts(isWithMts: boolean): Locator {
        return (isWithMts) ?
            this.page.locator("//input[@name='isWithMtsOption']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isWithMtsOption']//following-sibling::span[text()='Нет']");
    }
    /**
     * Радиобаттон "Сформировать МТС?"
     */
    private isFormMts(isFormMts: boolean): Locator {
        return (isFormMts) ?
            this.page.locator("//input[@name='isWithGenerationOption']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isWithGenerationOption']//following-sibling::span[text()='Нет']");
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
        if (await this.instructionTypeTitle(InstructionTypes.internationalTransfer).isVisible())
            await this.addButton.first().click();
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
        if (isWithChangeDates) {
            try {
                await this.addAdditionalAgreementButton.first().click();
            }
            catch (error) {}
            await this.withDeadlinesChangeDS.click();
            await DateInput.fillDateInput(this.dateEndByDS,InputData.futureDate(this.contractDurationDays+this.extendContractCountDays));
            const dateEndByDsValue: string | null = await this.dateEndByDS.getAttribute("value");
            if (dateEndByDsValue) this.additionalAgreementDateEndByDs = dateEndByDsValue;
            if (await this.reason.isVisible()) {
                await this.reason.click();
                await this.reasonValues.first().click();
            }
            await this.contractNumber.fill(this.additionalAgreementWithChangeDate);
        }
        else {
            await this.addAdditionalAgreementButton.click();
            if (await this.withoutDeadlinesChangeDS.isVisible()) await this.withoutDeadlinesChangeDS.click();
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
     * Добавление дополнительного соглашения для трансферного контракта
     */
    public async addAdditionalAgreementForTk(): Promise<void> {
        await this.addAdditionalAgreementForTkButton.click();
        await this.transferNumber.fill(this.additionalAgreementForTk);
        await DateInput.fillDateInput(this.dateConclusion,InputData.currentDate);
        const prevContractRestartDateValue: string | null = await this.prevContractRestartDate.last().getAttribute("value");
        if (prevContractRestartDateValue) this.prevContractRestartDateValue = prevContractRestartDateValue;
        const prevContractStopDateValue: string | null = await this.prevContractStopDate.last().getAttribute("value");
        if (prevContractStopDateValue) this.prevContractStopDateValue = prevContractStopDateValue;
        await this.noteTitle.click();
        await this.note.fill(InputData.randomWord);
        await this.addContractDocuments();
        await this.addMediators();
        await this.onwardButton.click();
    }
    /**
     * Добавление трансферного соглашения
     */
    public async addTransferAgreement(transferContractType?: TransferContractType, isTransferForEarlyFinish?: boolean): Promise<void> {
        await this.addButton.click();
        switch (transferContractType) {
            case TransferContractType.withTermination:
                await this.withTerminationContractRadio.click();
                break;
            case TransferContractType.withSuspension:
                await this.withSuspensionContractRadio.click();
        }
        await this.transferNumber.fill(this.createdTransferAgreementNumber);
        await DateInput.fillDateInput(this.signingDate,InputData.currentDate);
        if (await this.reason.isVisible()) {
            await this.reason.click();
            await this.reasonValues.first().click();
        }
        if (transferContractType == TransferContractType.withSuspension && !await this.instructionTypeTitle(InstructionTypes.internationalTransfer).isVisible()) {
            /*
            * Для ТК "С приостановкой" заполняем поле "Дата возобновления ТД с пред. клубом" датой: -1 день от даты окончания пред. договора
            * c пред. клубом для обхода коллизии "Дата возобновления старого ТД не меньше срока его окончания"
            * */
            (isTransferForEarlyFinish) ?
                await DateInput.fillDateInput(this.prevContractRestartDate,InputData.futureDate(-1,this.earlyFinishPrevContractEndDate)) :
                await DateInput.fillDateInput(this.prevContractRestartDate,InputData.futureDate(-1,this.prevContractPrevClubEndDate));
            const prevContractRestartDateValue: string | null = await this.prevContractRestartDate.last().getAttribute("value");
            if (prevContractRestartDateValue) this.prevContractRestartDateValue = prevContractRestartDateValue;
        }
        const prevContractStopDateValue: string | null = await this.prevContractStopDate.last().getAttribute("value");
        if (prevContractStopDateValue) this.prevContractStopDateValue = prevContractStopDateValue;
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
     * Добавление документов для контрактов, доп. соглашений, трансферных соглашений и МТС
     */
    private async addContractDocuments(): Promise<void> {
        const documentFields = await this.documents.all();
        for(const documentField of documentFields) {
            const index = documentFields.indexOf(documentField);
            if (index == 0) continue
            else if (index == 1) {
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
     * Регистрация инструкции
     */
    public async registrationInstruction(playerState?: PlayerStates): Promise<void> {
        if (playerState == PlayerStates.amateur) {
            await DateInput.fillDateInput(this.regBeginDate,this.newContractStartDate);
            await DateInput.fillDateInput(this.regEndDate,this.newContractEndDate);
        }
        await this.commentForRegistrationTitle.click();
        await this.addRegistrationCommentAndDocs();
        if (await this.isOtherMemberAssociationRadio(false).isVisible())
            await this.isOtherMemberAssociationRadio(false).click();
        await this.skipHistoryChangeCheckBox.click();
        await this.registerButton.click();
    }
    /**
     * Добавление комментария, документов и выполнение выбранного решения по инструкции
     */
    private async addRegistrationCommentAndDocs(): Promise<void> {
        await this.commentForRegistrationTitle.click();
        await this.documents.first().setInputFiles(InputData.getTestFiles("png"));
        await Elements.waitForVisible(this.fileIcon("png"));
        await this.commentForRegister.fill(this.registerComment);
    }
    /**
     * Добавление трансферного контракта со случайными параметрами типа ТК (С приостановленим, С разрывом)
     */
    public async addRandomTransferContract(): Promise<void> {
        if (await this.registrationType(RegistrationTypes.permanent).isChecked())
            await this.addTransferAgreement()
        else {
            const transferTypeRandomNumber: number = randomInt(0,2);
            (transferTypeRandomNumber == 0) ?
                await this.addTransferAgreement(TransferContractType.withTermination) :
                await this.addTransferAgreement(TransferContractType.withSuspension);
        }
    }
    /**
     * Добавление выплат для инструкций
     */
    public async addPayments(): Promise<void> {
        await this.isInstructionWithPayments(true).click();
        await this.isWithBuyout(true).click();
        for(const paymentType of Object.values(PaymentTypes)) {
            if (paymentType != PaymentTypes.resalePayment) {
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
     * Создание и регистрация тестовой инструкции для сценария проверки инструкций других типов
     */
    public async addTestInstruction(createOptions: CreateInstructionOptionsType): Promise<void> {
        await this.createInstruction({
            type: createOptions.type,
            subType: createOptions.subType,
            clubId: createOptions.clubId
        });
        if (createOptions.clubId == this.clubId) await this.addContract(this.prevContractNewClubStartDate,this.prevContractNewClubEndDate);
        else if (createOptions.clubId == this.srcClubId) await this.addContract(this.prevContractPrevClubStartDate,this.prevContractPrevClubEndDate);
        else await this.addContract(this.earlyFinishPrevContractStartDate,this.earlyFinishPrevContractEndDate);
        await Elements.waitForVisible(this.numberValueByName(this.createdContractNumber));
        if (createOptions.type == InstructionTypes.transferAgreementOnRentTerms) {
            (createOptions.isInstructionForEarlyFinish) ?
            await this.addTransferAgreement(TransferContractType.withSuspension,true) :
            await this.addTransferAgreement(TransferContractType.withSuspension);
            await this.isInstructionWithPayments(false).click();
        }
        await this.registrationInstruction();
        await Elements.waitForVisible(this.instructionState(InstructionStates.registered));
    }
    /**
     * Добавление МТС
     */
    public async addMts(intTransferSubType?: IntTransferSubTypes): Promise<void> {
        await this.isWithMts(true).click();
        if (intTransferSubType == IntTransferSubTypes.giveAwayAmateurPlayer ||
           intTransferSubType == IntTransferSubTypes.giveAwayProfessionalPlayer) await this.isFormMts(true).click();
        await this.isWithSportSanctionsRadio(true).click();
        await this.addContractDocuments();
        await this.transitionId.fill(InputData.randomWord);
        await this.discipline.click();
        await this.disciplineValues.first().click();
        await this.specialMarkMts.click();
        await this.specialMarkMtsValues.first().click();
        await DateInput.fillDateInput(this.dateConclusion,InputData.currentDate);
        if (intTransferSubType == IntTransferSubTypes.giveAwayAmateurPlayer ||
           intTransferSubType == IntTransferSubTypes.giveAwayProfessionalPlayer) {
            await DateInput.fillDateInput(this.prevContractStopDate,this.prevContractNewClubStartDate);
            await this.formMtsButton.click();
            await Elements.waitForVisible(this.intTransferFileName);
        }
        await this.prevAssociationPlayerStateRadio(PlayerStates.professional).click();
        await this.saveButton.click();
    }
    /**
     * Метод проверки изменения дат для предыдущих договоров с предыдущим и новым клубами
     */
    public async checkPrevContractsDateChanges(
        transferAgreementSubType: TransferAgreementSubTypes | TransferAgreementRentSubTypes,
        transferContractType?: TransferContractType): Promise<boolean> {
        const prevContractPrevClub: any[] =
            (transferAgreementSubType == TransferAgreementRentSubTypes.earlyFinishRentWithNewContract ||
             transferAgreementSubType == TransferAgreementRentSubTypes.earlyFinishRentWithoutNewContract) ?
            await dbHelper.getPreviousContract(this.personId,this.srcClubId,true) :
            await dbHelper.getPreviousContract(this.personId,this.srcClubId,false);
        let prevContractPrevClubStopDate: string = '';
        let prevContractPrevClubEndDate: string = '';
        let prevContractPrevClubRestartDate: string = '';
        if (prevContractPrevClub.length > 0) {
            prevContractPrevClubStopDate = prevContractPrevClub[0]["stop_date"].toLocaleDateString();
            prevContractPrevClubEndDate = prevContractPrevClub[0]["actual_end_date"].toLocaleDateString();
            if (prevContractPrevClub[0]["restart_date"]) prevContractPrevClubRestartDate = prevContractPrevClub[0]["restart_date"].toLocaleDateString();
        }
        const prevContractNewClub: any[] = await dbHelper.getPreviousContract(this.personId,this.clubId,true);
        let prevContractNewClubRestartDate: string = '';
        let prevContractNewClubEndDate: string = '';
        if (prevContractNewClub.length > 0) {
            prevContractNewClubEndDate = prevContractNewClub[0]["actual_end_date"].toLocaleDateString();
            if (prevContractNewClub[0]["restart_date"]) prevContractNewClubRestartDate = prevContractNewClub[0]["restart_date"].toLocaleDateString();
        }
        if (transferAgreementSubType == TransferAgreementSubTypes.withoutBuyoutFromRent) {
            logger.info(`Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, введено: ${this.prevContractStopDateValue}`);
            return prevContractPrevClubStopDate == this.prevContractStopDateValue;
        }
        else if (transferAgreementSubType == TransferAgreementSubTypes.buyoutFromRentWithNewContract ||
                transferAgreementSubType == TransferAgreementRentSubTypes.earlyFinishRentWithNewContract) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: actual_end_date: ${prevContractPrevClubEndDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: actual_end_date: ${prevContractNewClubEndDate}, указано: ${this.newContractStartDate}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    prevContractNewClubEndDate == this.newContractStartDate)
        }
        else if (transferAgreementSubType == TransferAgreementSubTypes.buyoutFromRentWithoutNewContract) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: actual_end_date: ${prevContractPrevClubEndDate}, указано: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: actual_end_date: ${prevContractNewClubEndDate}, указано: ${this.additionalAgreementDateEndByDs}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    prevContractNewClubEndDate == this.additionalAgreementDateEndByDs)
        }
        else if (transferAgreementSubType == TransferAgreementRentSubTypes.toRent && transferContractType == TransferContractType.withTermination) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, введено: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: end_date: ${prevContractPrevClubEndDate}, введено: ${this.prevContractStopDateValue}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue)
        }
        else if (transferAgreementSubType == TransferAgreementRentSubTypes.toRent && transferContractType == TransferContractType.withSuspension) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, введено: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: restart_date: ${prevContractPrevClubRestartDate}, введено: ${this.prevContractRestartDateValue}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubRestartDate == this.prevContractRestartDateValue)
        }
        else if ((transferAgreementSubType == TransferAgreementRentSubTypes.prolongationNewContractNewTransfer ||
                 transferAgreementSubType ==  TransferAgreementRentSubTypes.prolongationNewContract) &&
                transferContractType == TransferContractType.withSuspension) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, введено: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: restart_date: ${prevContractPrevClubRestartDate}, введено: ${this.prevContractRestartDateValue}
                 Пред. договор с нов. клубом: actual_end_date: ${prevContractNewClubEndDate}, введено: ${this.newContractStartDate}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubRestartDate == this.prevContractRestartDateValue &&
                    prevContractNewClubEndDate == this.newContractStartDate)
        }
        else if (transferAgreementSubType == TransferAgreementRentSubTypes.prolongationNewTransfer ||
                transferAgreementSubType == TransferAgreementRentSubTypes.prolongationWithoutNewContracts) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, введено: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: restart_date: ${prevContractPrevClubRestartDate}, введено: ${this.prevContractRestartDateValue}
                 Пред. договор с нов. клубом: actual_end_date: ${prevContractNewClubEndDate}, введено: ${this.additionalAgreementDateEndByDs}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubRestartDate == this.prevContractRestartDateValue &&
                    prevContractNewClubEndDate == this.additionalAgreementDateEndByDs)
        }
        else if (transferAgreementSubType == TransferAgreementRentSubTypes.earlyFinishRentWithoutNewContract) {
            const prevContractPrevClubEndDatePlusOneDay: string = InputData.futureDate(1,prevContractPrevClubEndDate);
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: ${prevContractPrevClubStopDate}, введено: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: restart_date: ${prevContractPrevClubEndDate}, введено: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: actual_end_date: ${prevContractNewClubRestartDate}, введено: ${prevContractPrevClubEndDatePlusOneDay}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    prevContractNewClubRestartDate == prevContractPrevClubEndDatePlusOneDay)
        }
        else throw new Error("Неверно указаны параметры метода")
    }
}
