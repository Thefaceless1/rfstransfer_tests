import {MainPage} from "./MainPage";
import {Locator, Page} from "@playwright/test";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {Elements} from "../framework/elements/Elements";
import {CreateInstructionOptionsType} from "../helpers/types/CreateInstructionOptionsType";
import {TransferSubTypeIds} from "../helpers/enums/transferSubTypeIds";
import {TransferRentSubTypeIds} from "../helpers/enums/transferRentSubTypeIds";
import {IntTransferSubTypes} from "../helpers/enums/IntTransferSubTypes";
import {PlayerStates} from "../helpers/enums/PlayerStates";
import {RegistrationTypes} from "../helpers/enums/RegistrationTypes";

export class CreateInstructionPage extends MainPage {
    public readonly srcClubId: number = (process.env.BRANCH == "preprod") ? 330620 : 282970
    constructor(page: Page) {
        super(page);
    }
    /**
     * Поле для ввода значения для поиска футболиста
     */
    private readonly playerInput: Locator = this.page.locator("//input[@class='player__input']")
    /**
     * Поле для ввода значения для поиска клуба
     */
    private readonly clubInput: Locator = this.page.locator("//input[@class='club__input']")
    /**
     * Поле для ввода значения для поиска клуба из которого переходит футболист
     */
    private readonly srcClubInput: Locator = this.page.locator("//input[@class='srcClub__input']")
    /**
     * Поле "Футболист"
     */
    private readonly player: Locator = this.page.locator("//*[contains(@class,'player__dropdown-indicator')]")
    /**
     * Поле "Клуб, в который переходит футболист"
     */
    private readonly club: Locator = this.page.locator("//*[contains(@class,'club__dropdown-indicator')]")
    /**
     * Поле "Клуб, из которого переходит футболист"
     */
    private readonly srcClub: Locator = this.page.locator("//*[contains(@class,'srcClub__dropdown-indicator')]")
    /**
     * Поле "Прежняя ассоциация"
     */
    private readonly previousAssociation: Locator = this.page.locator("//*[contains(@class,'srcAssociation__indicators')]")
    /**
     * Значения выпадающего списка поля "Прежняя ассоциация"
     */
    private readonly previousAssociationValues: Locator = this.page.locator("//*[contains(@class,'srcAssociation__option')]")
    /**
     * Поле "Предыдущая ассоциация", заполненное значением "РФС"
     */
    private readonly prevAssociationWithRfsValue: Locator = this.page.locator("//div[contains(@class,'srcAssociation__single-value')]//div[contains(text(),'РФС')]")
    /**
     * Поле "Новая ассоциация"
     */
    private readonly newAssociation: Locator = this.page.locator("//*[contains(@class,'destAssociation__indicators')]")
    /**
     * Значения выпадающего списка поля "Новая ассоциация"
     */
    private readonly newAssociationValues: Locator = this.page.locator("//*[contains(@class,'destAssociation__option')]")
    /**
     * Поле "Новая ассоциация", заполненное значением "РФС"
     */
    private readonly newAssociationWithRfsValue: Locator = this.page.locator("//div[contains(@class,'destAssociation__single-value')]//div[contains(text(),'РФС')]")
    /**
     * Поле "Тип инструкции"
     */
    private readonly instructionType: Locator = this.page.locator("//*[contains(text(),'Выберите тип инструкции')]")
    /**
     * Выбранное значение поля "Трудовой договор"
     */
    private readonly employmentContractValue: Locator = this.page.locator("//div[contains(@class,'contract__single-value')]")
    /**
     * Радиобаттон "Взять в аренду"
     */
    private readonly toRentRadio: Locator = this.page.locator("//span[text()='Взять в аренду']")
    /**
     * Радиобаттон "Продлить аренду"
     */
    private readonly prolongationRentRadio: Locator = this.page.locator("//span[text()='Продлить аренду']")
    /**
     * Радиобаттон "Досрочно завершить аренду"
     */
    private readonly earlyFinishRentRadio: Locator = this.page.locator("//span[text()='Досрочно завершить аренду']")
    /**
     * Наименование инструкции
     */
    public readonly instructionName: Locator = this.page.locator("//a[contains(text(),'Инструкция')]")
    /**
     * Радиобаттон "Привлечь футболиста"
     */
    public readonly acceptPlayerRadio: Locator = this.page.locator("//span[text()='Взять футболиста']")
    /**
     * Радиобаттон "Отдать футболиста"
     */
    public readonly giveAwayPlayerRadio: Locator = this.page.locator("//span[text()='Отдать футболиста']")
    /**
     * Значение футболиста в выпадающем списке
     */
    private readonly playerValue: Locator = this.page.locator(`//*[contains(@class,'player__option')]//*[contains(text(),'${this.person}')]`)
    /**
     * Выбранное значение выпадающего списка поля "Тип инструкции"
     */
    private selectedInstructionTypeValue(selectedType: InstructionTypes): Locator {
        return this.page.locator("//*[contains(@class,'instructionType__option')]",{hasText: selectedType});
    }
    /**
     * Значение выпадающего списка поля "Клуб, в который переходит футболист"
     */
    private clubValue(clubId: number): Locator {
        return this.page.locator(`//*[contains(@class,'club__option')]//div//div[contains(text(),'${clubId}')]`);
    }
    /**
     * Значение выпадающего списка поля "Клуб, в который переходит футболист"
     */
    private srcClubValue(clubId: number): Locator {
        return this.page.locator(`//*[contains(@class,'srcClub__option')]//div//div[contains(text(),'${clubId}')]`);
    }
    /**
     * Радиобаттон поля "Является ли этот переход выкупом из аренды?"
     */
    private isTsWithBuyoutRadio(isWithBuyout: boolean): Locator {
        return (isWithBuyout) ?
            this.page.locator(`//input[@name='isTsWithBuyoutQuestion']//following-sibling::span[text()='Да']`) :
            this.page.locator(`//input[@name='isTsWithBuyoutQuestion']//following-sibling::span[text()='Нет']`);
    }
    /**
     * Радиобаттон поля "Заключался ли новый трудовой договор с футболистом в связи с переходом на постоянной основе?"
     */
    private isTsWithNewTdRadio(isTsWithNewTd: boolean): Locator {
        return (isTsWithNewTd) ?
            this.page.locator(`//input[@name='isTsWithNewTdQuestion']//following-sibling::span[text()='Да']`) :
            this.page.locator(`//input[@name='isTsWithNewTdQuestion']//following-sibling::span[text()='Нет']`);
    }
    /**
     * Радиобаттон поля "Заключался ли новый трудовой договор с футболистом в связи с продлением аренды?"
     */
    private isTsWithNewTdForProlongationRentRadio(isTsWithNewTd: boolean): Locator {
        return (isTsWithNewTd) ?
            this.page.locator(`//input[@name='isTsRentProlongWithNewTdQuestion']//following-sibling::span[text()='Да']`) :
            this.page.locator(`//input[@name='isTsRentProlongWithNewTdQuestion']//following-sibling::span[text()='Нет']`);
    }
    /**
     * Радиобаттон поля "Был ли заключен новый трансферный контракт или продлен ранее заключенный?"
     */
    private isTsWithNewTkForProlongationRentRadio(isTsWithNewTd: boolean): Locator {
        return (isTsWithNewTd) ?
            this.page.locator(`//input[@name='isTsRentProlongWithNewTkQuestion']//following-sibling::span[text()='Заключен новый']`) :
            this.page.locator(`//input[@name='isTsRentProlongWithNewTkQuestion']//following-sibling::span[text()='Продлен предыдущий']`);
    }
    /**
     * Радиобаттон поля "Завершение аренды с заключением нового трудового договора или возобновлением действующего?"
     */
    private isTsRentFinishWithNewTdRadio(isTsWithNewTd: boolean): Locator {
        return (isTsWithNewTd) ?
            this.page.locator(`//input[@name='isTsRentFinishWithNewTdQuestion']//following-sibling::span[text()='Заключение нового трудового договора']`) :
            this.page.locator(`//input[@name='isTsRentFinishWithNewTdQuestion']//following-sibling::span[text()='Возобновление трудового договора']`);
    }
    /**
     * Радиобаттон "Статус футболиста в новом клубе"
     */
    private newClubPlayerStateRadio(playerState: PlayerStates): Locator {
        return (playerState == PlayerStates.professional) ?
            this.page.locator("//input[@name='isProfessionalOption']//following-sibling::span[text()='Профессионал']") :
            this.page.locator("//input[@name='isProfessionalOption']//following-sibling::span[text()='Любитель']");
    }
    /**
     * Радиобаттон "Тип регистрации"
     */
    protected registrationType(regType: RegistrationTypes): Locator {
        return (regType == RegistrationTypes.temporary) ?
            this.page.locator("//span[text()='Временная']//preceding-sibling::input[@name='isTemporaryOption']") :
            this.page.locator("//span[text()='Постоянная']//preceding-sibling::input[@name='isTemporaryOption']");
    }
    /**
     * Создание инструкции с указанным типом
     */
    public async createInstruction(createOptions: CreateInstructionOptionsType): Promise<void> {
        if (!await this.internalTransfersButton.isVisible()) await this.page.goto("/");
        (createOptions.type == InstructionTypes.internationalTransfer) ?
            await this.internationalTransfersButton.click():
            await this.internalTransfersButton.click();
        await this.player.click();
        await this.playerInput.fill(this.person);
        await this.playerValue.click();
        if (createOptions.type == InstructionTypes.internationalTransfer) {
            switch (createOptions.subType) {
                case IntTransferSubTypes.acceptAmateurPlayer:
                    await this.acceptPlayerRadio.click();
                    await this.newClubPlayerStateRadio(PlayerStates.amateur).click();
                    await this.previousAssociation.click();
                    await this.previousAssociationValues.first().click();
                    await Elements.waitForVisible(this.newAssociationWithRfsValue);
                    break;
                case IntTransferSubTypes.acceptProfessionalPlayer:
                    await this.acceptPlayerRadio.click();
                    await this.newClubPlayerStateRadio(PlayerStates.professional).click();
                    await this.registrationType(RegistrationTypes.temporary).click();
                    await this.previousAssociation.click();
                    await this.previousAssociationValues.first().click();
                    await Elements.waitForVisible(this.newAssociationWithRfsValue);
                    break;
                case IntTransferSubTypes.giveAwayAmateurPlayer:
                    await this.giveAwayPlayerRadio.click();
                    await this.newClubPlayerStateRadio(PlayerStates.amateur).click();
                    await this.newAssociation.click();
                    await this.newAssociationValues.first().click();
                    await Elements.waitForVisible(this.prevAssociationWithRfsValue);
                    break;
                case IntTransferSubTypes.giveAwayProfessionalPlayer:
                    await this.giveAwayPlayerRadio.click();
                    await this.newClubPlayerStateRadio(PlayerStates.professional).click();
                    await this.registrationType(RegistrationTypes.temporary).click();
                    await this.newAssociation.click();
                    await this.newAssociationValues.first().click();
                    await Elements.waitForVisible(this.prevAssociationWithRfsValue);
            }
        }
        else {
            await this.instructionType.click();
            await this.selectedInstructionTypeValue(createOptions.type).click();
        }
        await this.club.click();
        if (createOptions.type == InstructionTypes.transferAgreement ||
           createOptions.type == InstructionTypes.transferAgreementOnRentTerms ||
           createOptions.type == InstructionTypes.internationalTransfer) {
           if (createOptions.isInstructionForEarlyFinish) {
               await this.clubInput.fill(String(this.srcClubId))
               await this.clubValue(this.srcClubId).click();
               await this.srcClub.click();
               await this.srcClubInput.fill(String(this.clubId));
               await this.srcClubValue(this.clubId).click();
            }
            else {
               await this.clubInput.fill(String(this.clubId))
               await this.clubValue(this.clubId).click();
               await this.srcClub.click();
               await this.srcClubInput.fill(String(this.srcClubId));
               await this.srcClubValue(this.srcClubId).click();
            }
            if (createOptions.type == InstructionTypes.transferAgreement) {
                switch (createOptions.subType) {
                    case TransferSubTypeIds.withoutBuyoutFromRent:
                        await this.isTsWithBuyoutRadio(false).click();
                        break;
                    case TransferSubTypeIds.buyoutFromRentWithNewContract:
                        await this.isTsWithBuyoutRadio(true).click();
                        await this.isTsWithNewTdRadio(true).click();
                        break;
                    case TransferSubTypeIds.buyoutFromRentWithoutNewContract:
                        await this.isTsWithBuyoutRadio(true).click();
                        await this.isTsWithNewTdRadio(false).click();
                }
            }
            if (createOptions.type == InstructionTypes.transferAgreementOnRentTerms) {
                switch (createOptions.subType) {
                    case TransferRentSubTypeIds.toRent:
                        await this.toRentRadio.click();
                        break;
                    case TransferRentSubTypeIds.prolongationNewContractNewTransfer:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(true).click();
                        await this.isTsWithNewTkForProlongationRentRadio(true).click();
                        break;
                    case TransferRentSubTypeIds.prolongationNewContract:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(true).click();
                        await this.isTsWithNewTkForProlongationRentRadio(false).click();
                        break;
                    case TransferRentSubTypeIds.prolongationNewTransfer:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(false).click();
                        await this.isTsWithNewTkForProlongationRentRadio(true).click();
                        break;
                    case TransferRentSubTypeIds.prolongationWithoutNewContracts:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(false).click();
                        await this.isTsWithNewTkForProlongationRentRadio(false).click();
                        break;
                    case TransferRentSubTypeIds.earlyFinishRentWithNewContract:
                        await this.earlyFinishRentRadio.click();
                        await this.isTsRentFinishWithNewTdRadio(true).click();
                        break;
                    case TransferRentSubTypeIds.earlyFinishRentWithoutNewContract:
                        await this.earlyFinishRentRadio.click();
                        await this.isTsRentFinishWithNewTdRadio(false).click();
                }
            }
        }
        else {
            await this.clubInput.fill(String(createOptions.clubId));
            await this.clubValue(createOptions.clubId!).click();
        }
        if (createOptions.type == InstructionTypes.additionalAgreement) await Elements.waitForVisible(this.employmentContractValue);
        await this.createButton.click();
    }
}