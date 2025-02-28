import {InstructionTypeIds} from "../enums/InstructionTypeIds";
import {TransferSubTypeIds} from "../enums/transferSubTypeIds";
import {TransferRentSubTypeIds} from "../enums/transferRentSubTypeIds";

export type RegPrelimInstructionParamsType = {
    typeId: InstructionTypeIds,
    subTypeId?: TransferSubTypeIds | TransferRentSubTypeIds,
    isForEarlyFinish?: boolean,
    isEarlyFinishWithNewContract?: boolean
}