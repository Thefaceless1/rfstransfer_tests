import {Page} from "@playwright/test";
import {TransferSubTypeIds} from "../enums/transferSubTypeIds";
import {TransferRentSubTypeIds} from "../enums/transferRentSubTypeIds";
import {InstructionTypeIds} from "../enums/InstructionTypeIds";

export type CreateInstructionParamsType = {
    page: Page,
    typeId: InstructionTypeIds,
    subTypeId?: TransferSubTypeIds | TransferRentSubTypeIds
    clubId: number,
    srcClubId: number | null,
    personId: number
}