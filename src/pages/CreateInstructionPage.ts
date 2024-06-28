import {MainPage} from "./MainPage";
import {Locator, Page} from "@playwright/test";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {Elements} from "../framework/elements/elements";
import {CreateInstructionOptionsType} from "../helpers/types/CreateInstructionOptionsType";
import {TransferAgreementSubTypes} from "../helpers/enums/TransferAgreementSubTypes";

export class CreateInstructionPage extends MainPage {
    private readonly person: string = "Автотест Трансфер"
    public readonly clubId: number = 279720
    public readonly srcClubId: number = 282970
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
     * Значение выпадающего списка поля "Клуб, из которого переходит футболист"
     */
    private readonly srcClubValue: Locator = this.page.locator(`//*[contains(@class,'srcClub__option')]//div//div[contains(text(),'${this.srcClubId}')]`)
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
     * Наименование инструкции
     */
    public readonly instructionName: Locator = this.page.locator("//a[contains(text(),'Инструкция')]")
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
     * Радиобаттон поля "Является ли этот переход выкупом из аренды?"
     */
    private isTsWithBuyout(isWithBuyout: boolean): Locator {
        return (isWithBuyout) ?
            this.page.locator(`//input[@name='isTsWithBuyoutQuestion']//following-sibling::span[text()='Да']`) :
            this.page.locator(`//input[@name='isTsWithBuyoutQuestion']//following-sibling::span[text()='Нет']`);
    }
    /**
     * Радиобаттон поля "Заключался ли новый трудовой договор с футболистом в связи с переходом на постоянной основе?"
     */
    private isTsWithNewTd(isTsWithNewTd: boolean): Locator {
        return (isTsWithNewTd) ?
            this.page.locator(`//input[@name='isTsWithNewTdQuestion']//following-sibling::span[text()='Да']`) :
            this.page.locator(`//input[@name='isTsWithNewTdQuestion']//following-sibling::span[text()='Нет']`);
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
        if(createOptions.type == InstructionTypes.transferAgreement || createOptions.type == InstructionTypes.transferAgreementOnRentTerms) {
            await this.clubInput.fill(String(this.clubId))
            await this.clubValue(this.clubId).click();
            await this.srcClub.click();
            await this.srcClubInput.fill(String(this.srcClubId));
            await Elements.waitForVisible(this.srcClubValue);
            await this.srcClubValue.click();
            if(createOptions.type == InstructionTypes.transferAgreement) {
                switch (createOptions.subType) {
                    case TransferAgreementSubTypes.withoutBuyoutFromRent:
                        await this.isTsWithBuyout(false).click();
                        break;
                    case TransferAgreementSubTypes.buyoutFromRentWithNewContract:
                        await this.isTsWithBuyout(true).click();
                        await this.isTsWithNewTd(true).click();
                        break;
                    case TransferAgreementSubTypes.buyoutFromRentWithoutNewContract:
                        await this.isTsWithBuyout(true).click();
                        await this.isTsWithNewTd(false).click();
                }
            }
        }
        else {
            await this.clubInput.fill(String(createOptions.clubId));
            switch (createOptions.clubId) {
                case this.clubId:
                    await this.clubValue(this.clubId).click();
                    break;
                case this.srcClubId:
                    await this.clubValue(this.srcClubId).click();
                    break;
            }
        }
        if(createOptions.type == InstructionTypes.additionalAgreement) await Elements.waitForVisible(this.employmentContractValue);
        await this.createButton.click();
    }
}