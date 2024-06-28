import {InstructionTypes} from "../enums/InstructionTypes";
import {TransferAgreementSubTypes} from "../enums/TransferAgreementSubTypes";

export type CreateInstructionOptionsType = {
    type: InstructionTypes
    clubId?: number,
    subType?: TransferAgreementSubTypes
}