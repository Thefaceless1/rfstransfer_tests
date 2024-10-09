import {InstructionTypes} from "../enums/InstructionTypes";
import {TransferAgreementSubTypes} from "../enums/TransferAgreementSubTypes";
import {TransferAgreementRentSubTypes} from "../enums/TransferAgreementRentSubTypes";
import {IntTransferSubTypes} from "../enums/IntTransferSubTypes";

export type CreateInstructionOptionsType = {
    type: InstructionTypes
    clubId?: number,
    subType?: TransferAgreementSubTypes | TransferAgreementRentSubTypes | IntTransferSubTypes,
    isInstructionForEarlyFinish?: boolean
}