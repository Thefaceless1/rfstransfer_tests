import {InstructionTypes} from "../enums/InstructionTypes";
import {TransferSubTypeIds} from "../enums/transferSubTypeIds";
import {TransferRentSubTypeIds} from "../enums/transferRentSubTypeIds";
import {IntTransferSubTypes} from "../enums/IntTransferSubTypes";

export type CreateInstructionOptionsType = {
    type: InstructionTypes
    clubId?: number,
    subType?: TransferSubTypeIds | TransferRentSubTypeIds | IntTransferSubTypes,
    isInstructionForEarlyFinish?: boolean
}