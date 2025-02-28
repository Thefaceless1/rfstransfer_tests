import {Page} from "@playwright/test";
import {TransferContractTypeIds} from "../enums/TransferContractTypeIds";

export type AddTransferParamsType = {
    page: Page,
    type: TransferContractTypeIds,
    instructionId: number,
    transferNumber: string,
    contractBeginDate: string,
    contractEndDate: string
}