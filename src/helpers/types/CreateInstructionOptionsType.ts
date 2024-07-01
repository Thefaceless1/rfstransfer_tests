import {InstructionTypes} from "../enums/InstructionTypes";
import {TransferAgreementSubTypes} from "../enums/TransferAgreementSubTypes";
import {TransferAgreementRentSubTypes} from "../enums/TransferAgreementRentSubTypes";

export type CreateInstructionOptionsType = {
    type: InstructionTypes
    clubId?: number,
    subType?: TransferAgreementSubTypes | TransferAgreementRentSubTypes
}