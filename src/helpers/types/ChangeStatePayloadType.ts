export type ChangeStatePayloadType = {
    stateId: number
    comment: string,
    files: [],
    ignoreNonFatalCollisions: boolean,
    isOtherMemberAssociation: boolean,
    skipHistoryChange: boolean,
    regBeginDate: string,
    regEndDate: string,
    prevContractStopDate: string | null,
    possibleRegEndDate: string | null,
    checkCollisionsOnly: boolean
}