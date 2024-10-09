import {MainPage} from "./MainPage";
import {Locator, Page} from "@playwright/test";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {Elements} from "../framework/elements/elements";
import {CreateInstructionOptionsType} from "../helpers/types/CreateInstructionOptionsType";
import {TransferAgreementSubTypes} from "../helpers/enums/TransferAgreementSubTypes";
import {TransferAgreementRentSubTypes} from "../helpers/enums/TransferAgreementRentSubTypes";
import {IntTransferSubTypes} from "../helpers/enums/IntTransferSubTypes";
import {PlayerStates} from "../helpers/enums/PlayerStates";
import {RegistrationTypes} from "../helpers/enums/RegistrationTypes";
import {randomInt} from "crypto";

export class CreateInstructionPage extends MainPage {
    private readonly person: string = "Автотест Трансфер"
    public readonly clubId: number = 279720
    public readonly srcClubId: number = 282970
    public readonly earlyFinishSrcClubId: number = 280610
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
    public readonly acceptPlayerRadio: Locator = this.page.locator("//span[text()='Привлечь футболиста']")
    /**
     * Радиобаттон "Отдать футболиста"
     */
    public readonly giveAwayPlayerRadio: Locator = this.page.locator("//span[text()='Отдать футболиста']")
    /**
     * Значение футболиста в выпадающем списке
     */
    private readonly personValue: Locator = this.page.locator(`//*[text()='${this.person}']`)
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
     * Выбор случайного типа регистрации для трансферного контракта
     */
    private async setRandomRegistrationType(): Promise<void> {
        const randomNumber: number = randomInt(0,2);
        (randomNumber == 0) ?
            await this.registrationType(RegistrationTypes.temporary).click() :
            await this.registrationType(RegistrationTypes.permanent).click();
    }
    /**
     * Создание инструкции с указанным типом
     */
    public async createInstruction(createOptions: CreateInstructionOptionsType): Promise<void> {
        await this.page.goto("/");
        await this.createInstructionButton.click();
        await this.instructionType.click();
        await Elements.waitForVisible(this.selectedInstructionTypeValue(createOptions.type));
        await this.selectedInstructionTypeValue(createOptions.type).click();
        await this.player.click();
        await this.playerInput.fill(this.person);
        await Elements.waitForVisible(this.personValue);
        await this.personValue.click();
        await this.club.click();
        if(createOptions.type == InstructionTypes.transferAgreement ||
           createOptions.type == InstructionTypes.transferAgreementOnRentTerms ||
           createOptions.type == InstructionTypes.internationalTransfer) {
            if(createOptions.clubId == this.earlyFinishSrcClubId) {
                await this.clubInput.fill(String(this.srcClubId))
                await this.clubValue(this.srcClubId).click();
                await this.srcClub.click();
                await this.srcClubInput.fill(String(this.earlyFinishSrcClubId));
                await this.srcClubValue(this.earlyFinishSrcClubId).click();
            }
            else {
                await this.clubInput.fill(String(this.clubId))
                await this.clubValue(this.clubId).click();
                await this.srcClub.click();
                await this.srcClubInput.fill(String(this.srcClubId));
                await this.srcClubValue(this.srcClubId).click();
            }
            if(createOptions.type == InstructionTypes.transferAgreement) {
                switch (createOptions.subType) {
                    case TransferAgreementSubTypes.withoutBuyoutFromRent:
                        await this.isTsWithBuyoutRadio(false).click();
                        break;
                    case TransferAgreementSubTypes.buyoutFromRentWithNewContract:
                        await this.isTsWithBuyoutRadio(true).click();
                        await this.isTsWithNewTdRadio(true).click();
                        break;
                    case TransferAgreementSubTypes.buyoutFromRentWithoutNewContract:
                        await this.isTsWithBuyoutRadio(true).click();
                        await this.isTsWithNewTdRadio(false).click();
                }
            }
            if(createOptions.type == InstructionTypes.transferAgreementOnRentTerms) {
                switch (createOptions.subType) {
                    case TransferAgreementRentSubTypes.toRent:
                        await this.toRentRadio.click();
                        break;
                    case TransferAgreementRentSubTypes.prolongationNewContractNewTransfer:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(true).click();
                        await this.isTsWithNewTkForProlongationRentRadio(true).click();
                        break;
                    case TransferAgreementRentSubTypes.prolongationNewContract:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(true).click();
                        await this.isTsWithNewTkForProlongationRentRadio(false).click();
                        break;
                    case TransferAgreementRentSubTypes.prolongationNewTransfer:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(false).click();
                        await this.isTsWithNewTkForProlongationRentRadio(true).click();
                        break;
                    case TransferAgreementRentSubTypes.prolongationWithoutNewContracts:
                        await this.prolongationRentRadio.click();
                        await this.isTsWithNewTdForProlongationRentRadio(false).click();
                        await this.isTsWithNewTkForProlongationRentRadio(false).click();
                        break;
                    case TransferAgreementRentSubTypes.earlyFinishRentWithNewContract:
                        await this.earlyFinishRentRadio.click();
                        await this.isTsRentFinishWithNewTdRadio(true).click();
                        break;
                    case TransferAgreementRentSubTypes.earlyFinishRentWithoutNewContract:
                        await this.earlyFinishRentRadio.click();
                        await this.isTsRentFinishWithNewTdRadio(false).click();
                }
            }
            if(createOptions.type == InstructionTypes.internationalTransfer) {
                switch(createOptions.subType) {
                    case IntTransferSubTypes.acceptAmateurPlayer:
                        await this.acceptPlayerRadio.click();
                        await this.newClubPlayerStateRadio(PlayerStates.amateur).click();
                        break;
                    case IntTransferSubTypes.acceptProfessionalPlayer:
                        await this.acceptPlayerRadio.click();
                        await this.newClubPlayerStateRadio(PlayerStates.professional).click();
                        await this.setRandomRegistrationType();
                        break;
                    case IntTransferSubTypes.giveAwayAmateurPlayer:
                        await this.giveAwayPlayerRadio.click();
                        await this.newClubPlayerStateRadio(PlayerStates.amateur).click();
                        break;
                    case IntTransferSubTypes.giveAwayProfessionalPlayer:
                        await this.giveAwayPlayerRadio.click();
                        await this.newClubPlayerStateRadio(PlayerStates.professional).click();
                        await this.setRandomRegistrationType();
                }
            }
        }
        else {
            await this.clubInput.fill(String(createOptions.clubId));
            await this.clubValue(createOptions.clubId!).click();
        }
        if(createOptions.type == InstructionTypes.additionalAgreement) await Elements.waitForVisible(this.employmentContractValue);
        await this.createButton.click();
    }
}