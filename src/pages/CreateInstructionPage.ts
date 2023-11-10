import {MainPage} from "./MainPage";
import {Locator, Page} from "@playwright/test";
import {InstructionTypes} from "../helpers/enums/InstructionTypes";
import {elements} from "../framework/elements/elements";

export class CreateInstructionPage extends MainPage {
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
     * Выбранное значение выпадающего списка поля "Тип инструкции"
     */
    private selectedInstructionTypeValue(selectedType: InstructionTypes): Locator {
        return this.page.locator("//*[contains(@class,'instructionType__option')]",{hasText: selectedType});
    }
    /**
     * Создание инструкции с указанным типом
     */
    public async createInstruction(selectedType: InstructionTypes): Promise<void> {
        await this.page.goto("/");
        await this.createInstructionButton.click();
        await this.instructionType.click();
        await elements.waitForVisible(this.selectedInstructionTypeValue(selectedType));
        await this.selectedInstructionTypeValue(selectedType).click();
        await this.player.click();
        await elements.waitForVisible(this.playerValues.first());
        await this.playerValues.first().click();
        await this.club.click();
        await elements.waitForVisible(this.clubValues.first());
        await this.clubValues.first().click();
        await this.createButton.click();
    }
}