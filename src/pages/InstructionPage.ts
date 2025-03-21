import {CreateInstructionPage} from "./CreateInstructionPage";
import {expect, Locator, Page} from "@playwright/test";
import {Mediators} from "../helpers/enums/Mediators";
import {Elements} from "../framework/elements/Elements";
import {InputData} from "../helpers/InputData";
import {DateInput} from "../framework/elements/DateInput";
import {InstructionStates} from "../helpers/enums/InstructionStates";
import {logger} from "../logger/logger";
import {PaymentTypes} from "../helpers/enums/PaymentTypes";
import {randomInt} from "crypto";
import {TransferSubTypeIds} from "../helpers/enums/transferSubTypeIds";
import {TransferRentSubTypeIds} from "../helpers/enums/transferRentSubTypeIds";
import {TransferContractTypeIds} from "../helpers/enums/TransferContractTypeIds";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {PlayerStates} from "../helpers/enums/PlayerStates";
import {IntTransferSubTypes} from "../helpers/enums/IntTransferSubTypes";
import {CreateTransferOptionsType} from "../helpers/types/CreateTransferOptionsType";
import {PaymentStates} from "../helpers/enums/PaymentStates";
import Process from "process";
import {CollisionIds} from "../helpers/enums/CollisionIds";
import {FifaSendingActionTypes} from "../helpers/enums/FifaSendingActionTypes";
import {ContractStates} from "../helpers/enums/ContractStates";
import {InstructionTypeIds} from "../helpers/enums/InstructionTypeIds";
import {ApiService} from "../api/ApiService";
import {RegPrelimInstructionParamsType} from "../helpers/types/RegPrelimInstructionParamsType";
import {GetInstructionResponseType} from "../helpers/types/GetInstructionResponseType";
import {dbService} from "../db/DbService";

export class InstructionPage extends CreateInstructionPage {
    public prevContractStopDateValue: string = ''
    public prevContractRestartDateValue: string = ''
    public additionalAgreementDateEndByDs: string = ''
    public readonly employmentContractNumber: string = InputData.randomWord
    public readonly additionalAgreementWithChangeDate: string = InputData.randomWord
    public readonly additionalAgreementWithoutChangeDate: string = InputData.randomWord
    public readonly additionalAgreementForTk: string = InputData.randomWord
    public readonly transferContractNumber: string = InputData.randomWord
    private readonly registerComment: string = InputData.randomWord
    private readonly cancelRegistrationComment: string = InputData.randomWord
    public readonly contractDurationDays: number = 365
    public readonly extendContractCountDays: number = 5
    public readonly daysCountBetweenContracts: number = 30
    public readonly prevContractPrevClubStartDate: string = InputData.futureDate(-this.daysCountBetweenContracts,InputData.currentDate)
    public readonly prevContractPrevClubEndDate: string = InputData.futureDate(this.contractDurationDays,this.prevContractPrevClubStartDate)
    public readonly prevContractNewClubStartDate: string
    public readonly prevContractNewClubEndDate: string
    public readonly newContractStartDate: string
    public readonly newContractEndDate: string
    constructor(page: Page) {
        super(page);
        this.prevContractNewClubStartDate = InputData.futureDate(this.daysCountBetweenContracts,this.prevContractPrevClubStartDate)
        this.prevContractNewClubEndDate = InputData.futureDate(this.contractDurationDays/2,this.prevContractNewClubStartDate)
        this.newContractStartDate = InputData.futureDate(this.daysCountBetweenContracts,this.prevContractNewClubEndDate)
        this.newContractEndDate = InputData.futureDate(-this.daysCountBetweenContracts,this.prevContractPrevClubEndDate)
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
     * Поле "Причина отмены регистрации"
     */
    public readonly cancelRegistrationReason: Locator = this.page.locator(`//input[@name='comment']`)
    /**
     * Поле "Причина отмены регистрации" с заполненным значением после отмены регистрации
     */
    public readonly cancelRegistrationReasonValue: Locator = this.page.locator(`//div[text()='Причина отмены регистрации']//following-sibling::div//div[text()='${this.cancelRegistrationComment}']`)
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
     * Поле "Сторона"
     */
    private readonly side: Locator = this.page.locator("//div[contains(@class,'mediators.0.side__indicators')]")
    /**
     * Поле "Посредники"
     */
    private readonly mediator: Locator = this.page.locator("//div[contains(@class,'mediators.0.person__indicators')]")
    /**
     * Кнопка "Отменить регистрацию"
     */
    private readonly cancelRegistrationButton: Locator = this.page.locator("//button[text()='Отменить регистрацию']")
    /**
     * Значения выпадающего списка поля "Посредники"
     */
    private readonly mediatorValues: Locator = this.page.locator("//div[contains(@class,'mediators.0.person__option')]")
    /**
     * Кнопка "Зарегистрировать"
     */
    private readonly registerButton: Locator = this.page.locator("//span[text()='Зарегистрировать']")
    /**
     * Кнопка "Зарегистрировать" на модальном окне подтверждения действия
     */
    private readonly submitWindowRegisterButton: Locator = this.page.locator("//button[text()='Зарегистрировать']")
    /**
     * Поле "Новый срок действия ТД по ДС"
     */
    private readonly dateEndByDS: Locator = this.page.locator("//input[@name='dateEndByDS']")
    /**
     * Кнопка "Да"
     */
    private readonly yesButton: Locator = this.page.locator("//button[text()='Да']")
    /**
     * Кнопка формирования печатной формы инструкции
     */
    private readonly printInstructionButton: Locator = this.page.locator("//span[contains(@class,'IconPrinterStroked')]")
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
     * Поле "Причина отмены"
     */
    private readonly cancelReason: Locator = this.page.locator("//div[@class='flex justify-between'][.//div[text()='Причина отмены']]//following-sibling::div//input")
    /**
     * Значения выпадающего списка поля "Причина"
     */
    private readonly submitPerformButton: Locator = this.page.locator("//button[text()='Подтвердить выполнение' and not(@disabled)]")
    /**
     * Поле "ID перехода"
     */
    private readonly transitionId: Locator = this.page.locator("//input[@name='transitionNumber']")
    /**
     * Кнопка управления статусами выплат
     */
    private readonly paymentStateManagementButton: Locator = this.page.locator("//button[.//span[contains(@class,'IconKebab ')]]")
    /**
     * Кнопка "Управление фактическими платежами"
     */
    private readonly managementFactPaymentsButton: Locator = this.page.locator("//button[@data-tooltip-content='Управление фактическими платежами']")
    /**
     * Поле "Дисциплина"
     */
    private readonly discipline: Locator = this.page.locator("//*[contains(@class,'discipline__dropdown')]")
    /**
     * Всплывающее окно уведомления при отмене регистрации, когда договор текущей инструкций менялся в рамках последующих инструкций
     */
    private readonly hasContractDependenciesAlert: Locator = this.page.locator("//div[@role='alert']//div[text()='Инструкция не может быть отменена т.к. существуют зависимости на базе других инструкций']")
    /**
     * Кнопка "Отменить выплату"
     */
    private readonly cancelPaymentButton: Locator = this.page.locator("//div[text()='Отменить выплату']")
    /**
     * Кнопка "Вернуть предыдущий статус"
     */
    private readonly returnPreviousState: Locator = this.page.locator("//div[text()='Вернуть предыдущий статус']")
    /**
     * Значения выпадающего списка поля "Дисциплина"
     */
    private readonly disciplineValues: Locator = this.page.locator("//*[contains(@class,'discipline__option')]")
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
     * Поле "Получатель"
     */
    private readonly recipient: Locator = this.page.locator("//input[@class='Buyout.0.srcClub__input']")
    /**
     * Значения выпадающего списка поля "Получатель"
     */
    private readonly recipientValues: Locator = this.page.locator("//div[contains(@class,'Buyout.0.srcClub__option')]")
    /**
     * Чекбокс "Не записывать в историю переходов"
     */
    private readonly skipHistoryChangeCheckBox: Locator = this.page.locator("//input[@name='skipHistoryChange']")
    /**
     * Поле "% от будущей выплаты"
     */
    private readonly resalePercent: Locator = this.page.locator("//textarea[@name='Resale.0.percent']")
    /**
     * Чекбокс "Футбольный агент(ы), представляющий клуб и/или футболиста в связи с подписанием трудового договора?"
     */
    private readonly withMediatorsCheckbox: Locator = this.page.locator("//input[@name='withMediatorsTypeInternational']")
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
     * Чекбокс "МТС"
     */
    private readonly mtsCheckbox: Locator = this.page.locator("//input[@name='isWithMtsOption']")
    /**
     * Чекбокс "Спортивные (дисциплинарные) санкции"
     */
    private readonly sportSanctionCheckbox: Locator = this.page.locator("//input[@name='isWithSportSanctionsOption']")
    /**
     * Получение значения поля "Номер" таблицы списка договоров и доп. соглашений по наименованию
     */
    public numberValueByName(text: string): Locator {
        return this.page.locator("//span[contains(@id,'cell-number')]",{hasText: text});
    }
    /**
     * Получение подтипа международного перехода
     */
    private intTransferSubType(subType: IntTransferSubTypes): Locator {
        return (subType == IntTransferSubTypes.acceptProfessionalPlayer || subType == IntTransferSubTypes.acceptAmateurPlayer) ?
            this.page.locator("//div[text()='Международный переход']//following-sibling::div[text()='Взять футболиста']"):
            this.page.locator("//div[text()='Международный переход']//following-sibling::div[text()='Отдать футболиста']");
    }
    /**
     * Если не указано наименование коллизии, то возвращет все коллизии в инструкции, если указан - то коллизию с указанным наименованием
     */
    private collisions(collisionName?: string): Locator {
        return (collisionName) ?
            this.page.locator(`//div[@col-id='description']//span[@class='ag-cell-value' and text()='${collisionName}']`):
            this.page.locator("//div[@col-id='description']//span[@class='ag-cell-value']");
    }
    /**
     * Выбранный тип выплаты с указанным статусом
     */
    public paymentState(paymentType: PaymentTypes, paymentState: PaymentStates): Locator {
        if (paymentType == PaymentTypes.ransomPayment || paymentType == PaymentTypes.fixedPayment)
            return this.page.locator(`//div[@row-index='0']//div[text()='${paymentState}']`);
        else if (paymentType == PaymentTypes.conditionalPayment)
            return this.page.locator(`//div[@row-index='1']//div[text()='${paymentState}']`);
        else return this.page.locator(`//div[@row-index='2']//div[text()='${paymentState}']`);
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
     * Радиобаттон "Проходил ли футболист спортивную подготовку в другой НА?"
     */
    private isOtherMemberAssociationRadio(isOtherMemberAssociation: boolean): Locator {
        return (isOtherMemberAssociation) ?
            this.page.locator("//input[@name='isOtherMemberAssociation']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isOtherMemberAssociation']//following-sibling::span[text()='Нет']");
    }
    /**
     * Радиобаттон "Были ли согласованы какие-либо платежи за переход?" в инструкции "Переход на постоянной/временной основе"
     * или "Производилась ли выплата бывшему клубу футболиста за расторжение контракта между этим клубом и футболистом?"
     * в инструкции "Новый ТД"
     */
    private isInstructionWithPayments(isWithPayments: boolean): Locator {
        return (isWithPayments) ?
            this.page.locator("//input[@name='isInstructionWithPayments']//following-sibling::span[text()='Да']") :
            this.page.locator("//input[@name='isInstructionWithPayments']//following-sibling::span[text()='Нет']");
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
            case PaymentTypes.fixedPayment: return this.page.locator("//textarea[@name='Fix.0.summa']");
            case PaymentTypes.conditionalPayment: return this.page.locator("//textarea[@name='Conditional.0.summa']");
            case PaymentTypes.ransomPayment: return this.page.locator("//textarea[@name='Buyout.0.summa']");
            default: throw new Error("Поле 'Общая сумма' не существует для указанного типа платежа'");
        }
    }
    /**
     * Поле "Сумма платежа" выбранного типа платежа
     */
    private paymentAmount(paymentType: PaymentTypes, isFactPayment?: boolean): Locator {
        if (isFactPayment) return this.page.locator("//input[@name='Facts.0.summa']");
        else {
            switch (paymentType) {
                case PaymentTypes.fixedPayment: return this.page.locator("//input[@name='Fix.0.parts.0.summa']");
                case PaymentTypes.conditionalPayment: return this.page.locator("//input[@name='Conditional.0.parts.0.summa']");
                case PaymentTypes.ransomPayment: return this.page.locator("//input[@name='Buyout.0.parts.0.summa']");
                default: throw new Error("Поле 'Сумма платежа' не существует для указанного типа платежа'");
            }
        }
    }
    /**
     * Поле "Валюта" выбранного типа платежа
     */
    private currency(paymentType: PaymentTypes, isFactPayment?: boolean): Locator {
        if (isFactPayment) return this.page.locator("//*[contains(@class,'Facts.0.currency__indicators')]");
        else {
            switch (paymentType) {
                case PaymentTypes.fixedPayment: return this.page.locator("//*[contains(@class,'Fix.0.currency__indicators')]");
                case PaymentTypes.conditionalPayment: return this.page.locator("//*[contains(@class,'Conditional.0.currency__indicators')]");
                case PaymentTypes.ransomPayment: return this.page.locator("//*[contains(@class,'Buyout.0.currency__indicators')]");
                default: throw new Error("Поле 'Валюта' не существует для указанного типа платежа'");
            }
        }
    }
    /**
     * Значения выпадающего списка поля "Валюта" выбранного типа платежа
     */
    private currencyValues(paymentType: PaymentTypes, isFactPayment?: boolean): Locator {
        if (isFactPayment) return this.page.locator("//*[contains(@class,'Facts.0.currency__option')]");
        else {
            switch (paymentType) {
                case PaymentTypes.fixedPayment: return this.page.locator("//*[contains(@class,'Fix.0.currency__option')]");
                case PaymentTypes.conditionalPayment: return this.page.locator("//*[contains(@class,'Conditional.0.currency__option')]");
                case PaymentTypes.ransomPayment: return this.page.locator("//*[contains(@class,'Buyout.0.currency__option')]");
                default: throw new Error("Поле 'Список валют' не существует для указанного типа платежа'");
            }
        }
    }
    /**
     * Поле "Примечание" выбранного типа платежа
     */
    private paymentNote(paymentType: PaymentTypes, isFactPayment?: boolean): Locator {
        if (isFactPayment) return this.page.locator("//textarea[@name='Facts.0.note']");
        else {
            switch (paymentType) {
                case PaymentTypes.fixedPayment: return this.page.locator("//textarea[@name='Fix.0.note']");
                case PaymentTypes.conditionalPayment: return this.page.locator("//textarea[@name='Conditional.0.note']");
                case PaymentTypes.ransomPayment: return this.page.locator("//textarea[@name='Buyout.0.note']");
                case PaymentTypes.resalePayment: return this.page.locator("//textarea[@name='Resale.0.note']");
            }
        }
    }
    /**
     * Поле "Дата" выбранного типа платежа
     */
    private paymentDate(paymentType: PaymentTypes, isFactPayment?: boolean): Locator {
        if (isFactPayment) return this.page.locator("//input[@name='Facts.0.factDate']");
        else {
            switch (paymentType) {
                case PaymentTypes.fixedPayment: return this.page.locator("//input[@name='Fix.0.parts.0.planeDate']");
                case PaymentTypes.conditionalPayment: return this.page.locator("//input[@name='Conditional.0.parts.0.planeDate']");
                case PaymentTypes.ransomPayment: return this.page.locator("//input[@name='Buyout.0.parts.0.planeDate']");
                default: throw new Error("Поле 'Дата' не существует для указанного типа платежа'");
            }
        }
    }
    /**
     * Добавление контракта
     */
    public async addContract(startDate: string, endDate: string): Promise<void> {
        if (await this.instructionTypeTitle(InstructionTypes.internationalTransfer).isVisible())
            await this.addButton.first().click();
        await this.contractNumber.fill(this.employmentContractNumber)
        await DateInput.fillDateInput(this.contractStartDate,startDate);
        await DateInput.fillDateInput(this.contractEndDate,endDate);
        await DateInput.fillDateInput(this.dateConclusion,startDate);
        await this.noteTitle.click();
        await this.note.fill(InputData.randomWord);
        await this.addContractDocuments(false);
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
        await this.addContractDocuments(false);
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
        await this.addContractDocuments(false);
        await this.addMediators();
        await this.onwardButton.click();
    }
    /**
     * Добавление трансферного соглашения
     */
    public async addTransferAgreement(createTransferOptions: CreateTransferOptionsType): Promise<void> {
        await this.addButton.click();
        switch (createTransferOptions.transferContractType) {
            case TransferContractTypeIds.withTermination:
                await this.withTerminationContractRadio.click();
                break;
            case TransferContractTypeIds.withSuspension:
                await this.withSuspensionContractRadio.click();
        }
        await this.transferNumber.fill(this.transferContractNumber);
        await DateInput.fillDateInput(this.signingDate,InputData.currentDate);
        if (createTransferOptions.transferContractType == TransferContractTypeIds.withSuspension &&
            !await this.instructionTypeTitle(InstructionTypes.internationalTransfer).isVisible()) {
            const prevContractRestartDateValue: string | null = await this.prevContractRestartDate.last().getAttribute("value");
            if (prevContractRestartDateValue) this.prevContractRestartDateValue = prevContractRestartDateValue;
        }
        /*
            * Для инструкции "Досрочное завершение аренды с изменением ТД" заполняем значение в поле "Дата завершения ТД с предыдущим клубом"
            * значением , которое находится в диапазоне дат пред. договора с новым клубом
            * для обхода коллизии "Дата прекращения старого ТД находится не в диапазоне дат возобновляемого ТД аренды"
        */
        if (createTransferOptions.instructionSubType == TransferRentSubTypeIds.earlyFinishRentWithoutNewContract)
            await DateInput.fillDateInput(this.prevContractStopDate.last(),InputData.futureDate(-1,this.prevContractNewClubEndDate));
        const prevContractStopDateValue: string | null = await this.prevContractStopDate.last().getAttribute("value");
        if (prevContractStopDateValue) this.prevContractStopDateValue = prevContractStopDateValue;
        await this.addContractDocuments(false);
        await this.addMediators();
        await this.onwardButton.click();
    }
    /**
     * Добавление посредников
     */
    private async addMediators(): Promise<void> {
        (await this.withMediatorsCheckbox.isVisible()) ?
            await this.withMediatorsCheckbox.click():
            await this.withMediatorsRadio.click();
        await this.side.click();
        await Elements.waitForVisible(this.selectedMediatorSideValue(Mediators.player));
        await this.selectedMediatorSideValue(Mediators.player).click();
        await this.mediator.click();
        await Elements.waitForVisible(this.mediatorValues.first());
        await this.mediatorValues.first().click();
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
        if (Process.env.BRANCH == "preprod") {
            const isIntTransferGiveAwayPlayer: boolean = await this.intTransferSubType(IntTransferSubTypes.giveAwayAmateurPlayer).isVisible();
            await Elements.waitForVisible(this.collisions(await dbService.getCollisionDescription(CollisionIds.missingPlayerFifaId)));
            if (!isIntTransferGiveAwayPlayer)
                await Elements.waitForVisible(this.collisions(await dbService.getCollisionDescription(CollisionIds.restrictRegisterPlayers)));
            const expectedCollisionCount: number = (isIntTransferGiveAwayPlayer) ? 1 : 2;
            if (await this.collisions().count() != expectedCollisionCount) throw new Error("Количество коллизий превышает ожидаемое");
            if (await this.isOtherMemberAssociationRadio(false).isVisible())
                await this.isOtherMemberAssociationRadio(false).click();
            if (await this.isInstructionWithPayments(false).isVisible()) await this.isInstructionWithPayments(false).click();
            await this.addRegistrationCommentAndDocs();
            await this.registerButton.click();
            await this.submitWindowRegisterButton.click();
        }
    }
    public async cancelRegistration(): Promise<void> {
        await this.cancelRegistrationButton.click();
        await this.cancelRegistrationReason.fill(this.cancelRegistrationComment);
        await this.sendButton.click();
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
     * Добавление плановых выплат для инструкций
     */
    public async addPayments(instructionType: InstructionTypes): Promise<void> {
        await this.isInstructionWithPayments(true).click();
        for (const paymentType of Object.values(PaymentTypes)) {
            if ((instructionType == InstructionTypes.newEmploymentContract && paymentType != PaymentTypes.ransomPayment) ||
                (instructionType != InstructionTypes.newEmploymentContract && paymentType == PaymentTypes.ransomPayment))
                continue;
            if (paymentType != PaymentTypes.resalePayment) {
                const paymentAmount: number = randomInt(10,10000);
                await this.totalAmount(paymentType).fill(String(paymentAmount));
                await this.paymentAmount(paymentType).fill(String(paymentAmount));
                await this.currency(paymentType).click();
                await this.currencyValues(paymentType).first().click();
                await this.paymentNote(paymentType).fill(InputData.randomWord);
                await DateInput.fillDateInput(this.paymentDate(paymentType),InputData.currentDate);
                if (instructionType == InstructionTypes.newEmploymentContract) {
                    await this.recipient.fill(String(this.clubId));
                    await this.recipientValues.first().click();
                }
            }
            else {
                await this.resalePercent.fill(String(randomInt(1,100)));
                await this.paymentNote(paymentType).fill(InputData.randomWord);
            }
        }
        await this.onwardButton.click();
    }
    /**
     * Добавление фактических платежей
     */
    public async addFactPayments(instructionType: InstructionTypes): Promise<void> {
        for (const paymentType of Object.values(PaymentTypes)) {
            if ((instructionType == InstructionTypes.newEmploymentContract && paymentType != PaymentTypes.ransomPayment) ||
                (instructionType != InstructionTypes.newEmploymentContract && paymentType == PaymentTypes.ransomPayment))
                continue;
            else {
                const paymentAmount: number = randomInt(10,10000);
                if (paymentType == PaymentTypes.fixedPayment || paymentType == PaymentTypes.ransomPayment)
                    await this.managementFactPaymentsButton.first().click();
                else if (paymentType == PaymentTypes.conditionalPayment)
                    await this.managementFactPaymentsButton.nth(1).click();
                else await this.managementFactPaymentsButton.last().click();
                await this.documents.first().setInputFiles(InputData.getTestFiles("pdf"));
                await Elements.waitForVisible(this.fileIcon("pdf"));
                await this.paymentAmount(paymentType,true).fill(String(paymentAmount));
                await this.currency(paymentType,true).click();
                await this.currencyValues(paymentType,true).first().click();
                await this.paymentNote(paymentType,true).fill(InputData.randomWord);
                await DateInput.fillDateInput(this.paymentDate(paymentType,true),InputData.currentDate);
                await this.submitPerformButton.click();
                await this.submitButton.click();
            }
        }
    }
    /**
     * Отмена выплаты
     */
    public async cancelPayment(): Promise<void> {
        await this.paymentStateManagementButton.first().click();
        await this.cancelPaymentButton.click();
        await this.cancelReason.fill(InputData.randomWord);
        await this.cancelButton.click();
    }
    /**
     * Возврат выплаты в предыдущий статус
     */
    public async returnPaymentToPrevState(): Promise<void> {
        const paymentsCount: number = await this.paymentStateManagementButton.count();
        for (let i = 0; i < paymentsCount; i++) {
            await this.paymentStateManagementButton.nth(i).click();
            await this.returnPreviousState.last().click();
            await this.yesButton.click();
        }
    }
    /**
     * Проверка отправки сведений в ФИФА
     */
    public async checkFifaSending(actionType: FifaSendingActionTypes): Promise<void> {
        await dbService.getFifaSendingFlagState();
        if (await dbService.getFifaSendingFlagState() == "false") logger.info("Отправка сведений в ФИФА отключена");
        else if (Process.env.BRANCH != "preprod" && actionType == FifaSendingActionTypes.firstProRegistration) return;
        else {
            let result: any[] = await dbService.getFifaSendingData(this.instructionId,actionType);
            /**
             * Проверяем до 30 секунд дал ли ФИФА сервис ответ на запрос и появилась ли запись в БД модуля
             */
            if (result.length == 0) {
                const maxWaitingTime: number = 30000;
                const checkIntervalTime: number = 1000;
                for (let i = 0; i < maxWaitingTime; i+=checkIntervalTime) {
                    await this.page.waitForTimeout(checkIntervalTime);
                    const fifaSendingData: any[] = await dbService.getFifaSendingData(this.instructionId,actionType);
                    if (fifaSendingData.length != 0) {
                        result = fifaSendingData;
                        break;
                    }
                }
            }
            switch (actionType) {
                case FifaSendingActionTypes.proofOfPayment:
                    if (result.length == 0) throw new Error("Данные о подтверждении платежа не отправлены в ФИФА");
                    else if (result.some(value => value.error != "")) {
                        result.forEach(row => {
                            if (row.error != "") logger.warn(`Ошибка при отправке сведений о платеже: ${row.error}`);
                        });
                    }
                    else logger.info("Отправка сведений прошла успешно");
                    break;
                case FifaSendingActionTypes.transferDeclaration:
                    if (result.length == 0) throw new Error("Данные о декларации ТК не отправлены в ФИФА");
                    else if (result[0].error != "") logger.warn(`Ошибка при отправке сведений о декларации ТК: ${result[0].error}`);
                    else logger.info("Отправка сведений прошла успешно");
                    break;
                case FifaSendingActionTypes.firstProRegistration:
                    if (result.length == 0) throw new Error("Данные о смене статуса не отправлены в ФИФА");
                    else if (result[0].error != "") logger.warn(`Ошибка при отправке сведений о смене статуса: ${result[0].error}`);
                    else logger.info("Отправка сведений прошла успешно");
            }
        }
    }
    /**
     * Добавление МТС
     */
    public async addMts(intTransferSubType?: IntTransferSubTypes): Promise<void> {
        await this.mtsCheckbox.click();
        if (intTransferSubType == IntTransferSubTypes.giveAwayAmateurPlayer ||
           intTransferSubType == IntTransferSubTypes.giveAwayProfessionalPlayer) await this.isFormMts(true).click();
        await this.sportSanctionCheckbox.click();
        await this.addContractDocuments(false);
        await this.transitionId.fill(InputData.randomWord);
        await this.discipline.click();
        await this.disciplineValues.first().click();
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
        transferAgreementSubType: TransferSubTypeIds | TransferRentSubTypeIds,
        transferContractType?: TransferContractTypeIds): Promise<boolean> {
        const prevContractPrevClub: any[] = (transferAgreementSubType == TransferRentSubTypeIds.earlyFinishRentWithNewContract ||
                                             transferAgreementSubType == TransferRentSubTypeIds.earlyFinishRentWithoutNewContract) ?
            await dbService.getPreviousContract(this.personId,this.srcClubId,true) :
            await dbService.getPreviousContract(this.personId,this.srcClubId,false);
        let prevContractPrevClubStopDate: string = '';
        let prevContractPrevClubEndDate: string = '';
        let prevContractPrevClubRestartDate: string = '';
        if (prevContractPrevClub.length > 0) {
            prevContractPrevClubStopDate = prevContractPrevClub[0]["stop_date"].toLocaleDateString('ru-RU');
            prevContractPrevClubEndDate = prevContractPrevClub[0]["actual_end_date"].toLocaleDateString('ru-RU');
            if (prevContractPrevClub[0]["restart_date"]) prevContractPrevClubRestartDate = prevContractPrevClub[0]["restart_date"].toLocaleDateString('ru-RU');
        }
        const prevContractNewClub: any[] = (transferAgreementSubType == TransferRentSubTypeIds.earlyFinishRentWithNewContract ||
                                            transferAgreementSubType == TransferRentSubTypeIds.earlyFinishRentWithoutNewContract ||
                                            transferAgreementSubType == TransferSubTypeIds.buyoutFromRentWithoutNewContract) ?
            await dbService.getPreviousContract(this.personId,this.clubId,false):
            await dbService.getPreviousContract(this.personId,this.clubId,true);
        let prevContractNewClubRestartDate: string = '';
        let prevContractNewClubEndDate: string = '';
        if (prevContractNewClub.length > 0) {
            prevContractNewClubEndDate = prevContractNewClub[0]["actual_end_date"].toLocaleDateString('ru-RU');
            if (prevContractNewClub[0]["restart_date"]) prevContractNewClubRestartDate = prevContractNewClub[0]["restart_date"].toLocaleDateString('ru-RU');
        }
        //Для особых инструкций предыдущий договор с новым клубом должен завершаться датой нового ТД - 1 день
        const newEndDatePrevContractNewClub: string = InputData.futureDate(1,prevContractNewClubEndDate);
        if (transferAgreementSubType == TransferSubTypeIds.buyoutFromRentWithNewContract) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: факт: ${prevContractPrevClubStopDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: actual_end_date: факт: ${prevContractPrevClubEndDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: actual_end_date: факт: ${newEndDatePrevContractNewClub}, ожидание: ${this.newContractStartDate}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    newEndDatePrevContractNewClub == this.newContractStartDate)
        }
        else if (transferAgreementSubType == TransferSubTypeIds.buyoutFromRentWithoutNewContract) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: факт: ${prevContractPrevClubStopDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: actual_end_date: факт: ${prevContractPrevClubEndDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: actual_end_date: факт: ${prevContractNewClubEndDate}, ожидание: ${this.additionalAgreementDateEndByDs}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    prevContractNewClubEndDate == this.additionalAgreementDateEndByDs)
        }
        else if ((transferAgreementSubType == TransferRentSubTypeIds.toRent && transferContractType == TransferContractTypeIds.withTermination) ||
                  transferAgreementSubType == TransferSubTypeIds.withoutBuyoutFromRent ||
                  transferAgreementSubType == TransferRentSubTypeIds.earlyFinishRentWithNewContract) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: факт: ${prevContractPrevClubStopDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: end_date: факт: ${prevContractPrevClubEndDate}, ожидание: ${this.prevContractStopDateValue}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue)
        }
        else if (transferAgreementSubType == TransferRentSubTypeIds.toRent && transferContractType == TransferContractTypeIds.withSuspension) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: факт: ${prevContractPrevClubStopDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: restart_date: факт: ${prevContractPrevClubRestartDate}, ожидание: ${this.prevContractRestartDateValue}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubRestartDate == this.prevContractRestartDateValue)
        }
        else if ((transferAgreementSubType == TransferRentSubTypeIds.prolongationNewContractNewTransfer ||
                  transferAgreementSubType ==  TransferRentSubTypeIds.prolongationNewContract) &&
                 transferContractType == TransferContractTypeIds.withSuspension) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: факт: ${prevContractPrevClubStopDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: restart_date: факт: ${prevContractPrevClubRestartDate}, ожидание: ${this.prevContractRestartDateValue}
                 Пред. договор с нов. клубом: actual_end_date: факт: ${newEndDatePrevContractNewClub}, ожидание: ${this.newContractStartDate}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubRestartDate == this.prevContractRestartDateValue &&
                    newEndDatePrevContractNewClub == this.newContractStartDate)
        }
        else if (transferAgreementSubType == TransferRentSubTypeIds.prolongationNewTransfer ||
                 transferAgreementSubType == TransferRentSubTypeIds.prolongationWithoutNewContracts) {
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: факт: ${prevContractPrevClubStopDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: restart_date: факт: ${prevContractPrevClubRestartDate}, ожидание: ${this.prevContractRestartDateValue}
                 Пред. договор с нов. клубом: actual_end_date: факт: ${prevContractNewClubEndDate}, ожидание: ${this.additionalAgreementDateEndByDs}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubRestartDate == this.prevContractRestartDateValue &&
                    prevContractNewClubEndDate == this.additionalAgreementDateEndByDs)
        }
        else if (transferAgreementSubType == TransferRentSubTypeIds.earlyFinishRentWithoutNewContract) {
            const prevContractStopDatePlusOneDay: string = InputData.futureDate(1,this.prevContractStopDateValue);
            logger.info(`
                 Пред. договор с пред. клубом: stop_date: факт: ${prevContractPrevClubStopDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с пред. клубом: actual_end_date: факт: ${prevContractPrevClubEndDate}, ожидание: ${this.prevContractStopDateValue}
                 Пред. договор с нов. клубом: restart_date: факт: ${prevContractNewClubRestartDate}, ожидание: ${prevContractStopDatePlusOneDay}
                `);
            return (prevContractPrevClubStopDate == this.prevContractStopDateValue &&
                    prevContractPrevClubEndDate == this.prevContractStopDateValue &&
                    prevContractNewClubRestartDate == prevContractStopDatePlusOneDay)
        }
        else throw new Error("Неверно указаны параметры метода");
    }
    /**
     * Формирование и загрузка файла с печатной формой инструкции
     */
    public async printInstructionReport(): Promise<[string, string]> {
        const downloadPromise = this.page.waitForEvent('download');
        await this.printInstructionButton.click();
        const download = await downloadPromise;
        let expectedReportFile: string = "Отчет_по_инструкции_";
        expectedReportFile+=String(this.instructionId)+".pdf";
        if (await download.failure()) throw new Error(`Ошибка при загрузке файла: ${await download.failure()}`);
        return [download.suggestedFilename(),expectedReportFile];
    }
    /**
     * Получение id текущей инструкции
     */
    public get instructionId(): number {
        const regExpData: RegExpMatchArray | null  = this.page.url().match(/\d+/);
        if (!regExpData) throw new Error("Отсутствует значение после применение рег. выражения к url");
        return Number(regExpData[0]);
    }
    /**
     * Проверка действий, которые должны произойти при отмене регистрации инструкции
     */
    public async checkCancelRegistrationRequirements(instructionId: number): Promise<void> {
        if (await dbService.isContractChangedByAnotherInstruction(this.instructionId)) {
            await expect(this.hasContractDependenciesAlert).toBeVisible();
        }
        else {
            await expect(this.instructionState(InstructionStates.registerCancelled)).toBeVisible();
            await expect(this.cancelRegistrationReasonValue).toBeVisible();
            const instructionContracts: any[] = await dbService.getInstructionContracts(instructionId);
            if (instructionContracts.length > 0) {
                const isAllInstructionContractsDrafts: boolean = instructionContracts.every(contract => contract["state_id"] == ContractStates.draft);
                if (!isAllInstructionContractsDrafts) throw new Error("Контракты текущей инструкции не перешли в статус 'Черновик'");
            }
            const previousContractsIds: number[] = await dbService.getUserContractsUndo(this.personId);
            if (previousContractsIds.length > 0) {
                for (const contractId of previousContractsIds) {
                    const contractUndoRecordId: number = await dbService.getLastContractUndoRecordId(contractId);
                    const isContractInPreviousState: boolean = await dbService.isContractInPreviousState(contractUndoRecordId);
                    if (!isContractInPreviousState) throw new Error(`Контракт ${contractId} не находится в предыдущем состоянии`);
                }
            }
        }
    }
    /**
     * Создание и регистрация предварительных инструкций
     */
    public async registerPreliminaryInstruction(params: RegPrelimInstructionParamsType): Promise<void> {
        const xCsrfToken: string = await this.pageCookie("XSRF-TOKEN");
        const jSessionId: string = await this.pageCookie("JSESSIONID");
        const apiService = new ApiService(xCsrfToken,jSessionId);
        let response: GetInstructionResponseType;
        if (params.typeId == InstructionTypeIds.newEmploymentContract) {
            response = await apiService.createInstruction({
                page: this.page,
                clubId: (params.isForEarlyFinish) ? this.clubId : this.srcClubId,
                personId: this.personId,
                srcClubId: null,
                typeId: params.typeId
            });
        }
        else {
            response  = await apiService.createInstruction({
                page: this.page,
                clubId: (params.isForEarlyFinish) ? this.srcClubId : this.clubId,
                personId: this.personId,
                srcClubId: (params.isForEarlyFinish) ? this.clubId : this.srcClubId,
                typeId: params.typeId,
                subTypeId: params.subTypeId
            });
        }
        const instructionId: number = response.data.id;
        switch (params.typeId) {
            case InstructionTypeIds.newEmploymentContract:
                await apiService.addContract({
                    page: this.page,
                    instructionId: instructionId,
                    startDate: this.prevContractPrevClubStartDate,
                    endDate: this.prevContractPrevClubEndDate,
                    contractNumber: this.employmentContractNumber
                });
                await apiService.registerInstruction({
                    page: this.page,
                    instructionId: instructionId,
                    regBeginDate: this.prevContractPrevClubStartDate,
                    regEndDate: this.prevContractPrevClubEndDate,
                    prevContractStopDate: null
                });
                break;
            case InstructionTypeIds.transferAgreementOnRentTerms:
                await apiService.addContract({
                    page: this.page,
                    instructionId: instructionId,
                    startDate: this.prevContractNewClubStartDate,
                    endDate: this.prevContractNewClubEndDate,
                    contractNumber: this.employmentContractNumber
                });
                const contractStopDate: string = await apiService.addTransfer({
                    page: this.page,
                    instructionId: instructionId,
                    type: (params.isEarlyFinishWithNewContract) ?
                        TransferContractTypeIds.withTermination :
                        TransferContractTypeIds.withSuspension,
                    contractBeginDate: this.prevContractNewClubStartDate,
                    contractEndDate: this.prevContractNewClubEndDate,
                    transferNumber: this.transferContractNumber
                });
                await apiService.registerInstruction({
                    page: this.page,
                    instructionId: instructionId,
                    regBeginDate: this.prevContractNewClubStartDate,
                    regEndDate: this.prevContractNewClubEndDate,
                    prevContractStopDate: contractStopDate
                });
        }
    }
}
