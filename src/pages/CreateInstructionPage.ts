import {MainPage} from "./MainPage";
import {Locator, Page} from "@playwright/test";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {Elements} from "../framework/elements/elements";

export class CreateInstructionPage extends MainPage {
    public instructionIds: number[] = []
    constructor(page: Page) {
        super(page);
    }
    /**
     * Поле "Футболист"
     */
    private readonly player: Locator = this.page.locator("//*[contains(@class,'player__dropdown-indicator')]")
    /**
     * Значения выпадающего списка поля "Футболист"
     */
    private readonly playerValues: Locator = this.page.locator("//*[contains(@class,'player__option')]")
    /**
     * Поле "Клуб"
     */
    private readonly club: Locator = this.page.locator("//*[contains(@class,'club__dropdown-indicator')]")
    /**
     * Значения выпадающего списка поля "Клуб"
     */
    private readonly clubValues: Locator = this.page.locator("//*[contains(@class,'club__option')]")
    /**
     * Поле "Тип инструкции"
     */
    private readonly instructionType: Locator = this.page.locator("//*[contains(text(),'Выберите тип инструкции')]")
    /**
     * Выбранное значение поля "Трудовой договор"
     */
    private readonly employmentContractValue: Locator = this.page.locator("//div[contains(@class,'contract__single-value')]")
    /**
     * Поле "Трудовой договор"
     */
    private readonly employmentContract: Locator = this.page.locator("//div[contains(@class,'contract__dropdown-indicator')]")
    /**
     * Значения выпадающего списка поля "Трудовой договор"
     */
    private readonly employmentContractValues: Locator = this.page.locator("//div[contains(@class,'contract__option')]")
    /**
     * Наименование инструкции
     */
    public readonly instructionName: Locator = this.page.locator("//a[contains(text(),'Инструкция')]")
    /**
     * Выбранное значение выпадающего списка поля "Тип инструкции"
     */
    private selectedInstructionTypeValue(selectedType: InstructionTypes): Locator {
        return this.page.locator("//*[contains(@class,'instructionType__option')]",{hasText: selectedType});
    }
    /**
     * Создание инструкции с указанным типом
     */
    public async createInstruction(selectedType: InstructionTypes): Promise<void> {
        if(selectedType == InstructionTypes.additionalAgreement) await this.page.goto("/");
        await this.createInstructionButton.click();
        await this.instructionType.click();
        await Elements.waitForVisible(this.selectedInstructionTypeValue(selectedType));
        await this.selectedInstructionTypeValue(selectedType).click();
        await this.player.click();
        await Elements.waitForVisible(this.playerValues.first());
        await this.playerValues.first().click();
        await this.club.click();
        await Elements.waitForVisible(this.clubValues.first());
        await this.clubValues.first().click();
        if(selectedType == InstructionTypes.additionalAgreement) {
            await this.page.waitForTimeout(1000);
            if(!await this.employmentContractValue.isVisible()) {
                await this.employmentContract.click();
                await Elements.waitForVisible(this.employmentContractValues.first());
                await this.employmentContractValues.first().click();
            }
        }
        await this.createButton.click();
        await this.addInstructionId();
    }
    /**
     * Получение id инструкции и добавление его в свойство instructionIds
     */
    private async addInstructionId(): Promise<void> {
        await Elements.waitForVisible(this.instructionName);
        const regExp: RegExp = /\d+/;
        this.instructionIds.push(Number(regExp.exec(await this.instructionName.innerText())[0]));
    }
}