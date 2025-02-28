import {APIResponse, Page} from "@playwright/test";
import config from "../../playwright.config";
import {CreateInstructionPayloadType} from "../helpers/types/CreateInstructionPayloadType";
import {InputData} from "../helpers/InputData";
import * as fs from "fs";
import {UploadFileResponseType} from "../helpers/types/UploadFileResponseType";
import {AddContractPayloadType} from "../helpers/types/AddContractPayloadType";
import {ChangeStatePayloadType} from "../helpers/types/ChangeStatePayloadType";
import {InstructionStateIds} from "../helpers/enums/InstructionStateIds";
import {AddTransferPayloadType} from "../helpers/types/AddTransferPayloadType";
import {TransferContractTypeIds} from "../helpers/enums/TransferContractTypeIds";
import {AddTransferParamsType} from "../helpers/types/AddTransferParamsType";
import {CreateInstructionParamsType} from "../helpers/types/CreateInstructionParamsType";
import {AddContractParamsType} from "../helpers/types/AddContractParamsType";
import {RegInstructionParamsType} from "../helpers/types/RegInstructionParamsType";
import {GetInstructionResponseType} from "../helpers/types/GetInstructionResponseType";

export class ApiService {
    private readonly xCsrfToken: string
    private readonly jSessionId: string
    constructor(xCsrfToken: string, jSessionId: string) {
        this.xCsrfToken = xCsrfToken
        this.jSessionId = jSessionId
    }
    /**
     * Api создания инструкции
     */
    private readonly createInstructionApi: string = "api/rest/instructions"
    /**
     * Api загрузки файла
     */
    private readonly upLoadFileApi: string = "api/rest/uploadFile"
    /**
     * Api добавления ТД,ДС
     */
    private addContractApi = (instructionId: number): string => `/api/rest/instructions/${instructionId}/contracts`
    /**
     * Api изменения статуса инструкции
     */
    private changeStateApi = (instructionId: number): string => `/api/rest/instructions/${instructionId}/state`
    /**
     * Api добавления ТК
     */
    private addTransferApi = (instructionId: number): string => `/api/rest/instructions/${instructionId}/transfers`
    /**
     * Запись данных в хедеры
     */
    private headers(xCsrfToken: string, jSessionId: string): {[p: string]: string} {
        return {
            'x-csrf-token': `${xCsrfToken}`,
            'Cookie': `XSRF-TOKEN=${xCsrfToken}; JSESSIONID=${jSessionId}`
        }
    }
    /**
     * Создание инструкции
     */
    public async createInstruction(params: CreateInstructionParamsType): Promise<GetInstructionResponseType> {
        const url: string = config.use?.baseURL + this.createInstructionApi;
        const payload: CreateInstructionPayloadType = {
            typeId: params.typeId,
            clubId: params.clubId,
            srcClubId: params.srcClubId,
            destNAId: null,
            srcNAId: null,
            personId: params.personId
        }
        if (params.subTypeId) payload.subTypeId = params.subTypeId;
        const response: APIResponse = await params.page.request.post(
            url,
            {
                data: payload,
                headers: this.headers(this.xCsrfToken, this.jSessionId)
            });
        if (!response.ok()) throw new Error(`Ошибка при api создании предварительной инструкции: ${await response.text()}`);
        return response.json();
    }
    /**
     * Добавление контракта
     */
    public async addContract(params: AddContractParamsType): Promise<void> {
        const url: string = config.use?.baseURL + this.addContractApi(params.instructionId);
        const storageId: string = await this.uploadFile(params.page).then(response => response.data);
        const payload: AddContractPayloadType = {
            number: params.contractNumber,
            conclusionDate: InputData.isoFormatDate(params.startDate),
            beginDate: InputData.isoFormatDate(params.startDate),
            endDate: InputData.isoFormatDate(params.endDate),
            files: [{fileName: InputData.randomWord + '.pdf',storageId: storageId, isMain: true}],
            isParentContractChange: false,
            mediators: [],
            note: "",
            parentContractId: null
        }
        const response: APIResponse = await params.page.request.put(
            url,
            {
                headers: this.headers(this.xCsrfToken, this.jSessionId),
                data: payload
            })
        if (!response.ok()) throw new Error(`Ошибка при api добавлении ТД: ${await response.text()}`);
    }
    /**
     * Загрузка файла
     */
    private async uploadFile(page: Page): Promise<UploadFileResponseType> {
        const url: string = config.use?.baseURL + this.upLoadFileApi;
        const pdfFilePath: string = String(InputData.getTestFiles("pdf"));
        const fileBuffer: Buffer = await fs.promises.readFile(pdfFilePath);
        const response: APIResponse = await page.request.post(
            url,{
            headers: this.headers(this.xCsrfToken, this.jSessionId),
            multipart: {
                file: {
                    name: pdfFilePath,
                    mimeType: 'text/plain',
                    buffer: fileBuffer,
                }
            }
        })
        if (!response.ok()) throw new Error(`Ошибка при api загрузке файла: ${await response.text()}`);
        return response.json();
    }
    /**
     * Регистрация инструкции
     */
    public async registerInstruction(params: RegInstructionParamsType): Promise<void> {
        const url: string = config.use?.baseURL + this.changeStateApi(params.instructionId);
        const payload: ChangeStatePayloadType = {
            checkCollisionsOnly: false,
            comment: "",
            files: [],
            ignoreNonFatalCollisions: true,
            isOtherMemberAssociation: false,
            possibleRegEndDate: null,
            prevContractStopDate: params.prevContractStopDate,
            regBeginDate: InputData.isoFormatDate(params.regBeginDate),
            regEndDate: InputData.isoFormatDate(params.regEndDate),
            skipHistoryChange: true,
            stateId: InstructionStateIds.registered
        }
        const response: APIResponse = await params.page.request.put(
            url,
            {
                headers: this.headers(this.xCsrfToken, this.jSessionId),
                data: payload
            }
        )
        if (!response.ok()) throw new Error(`Ошибка при api регистрации инструкции: ${await response.text()}`);
    }
    public async addTransfer(params: AddTransferParamsType): Promise<string> {
        const url: string = config.use?.baseURL + this.addTransferApi(params.instructionId);
        const storageId: string = await this.uploadFile(params.page).then(response => response.data);
        const contractStopDate: string = InputData.isoFormatDate(InputData.futureDate(-1,params.contractBeginDate));
        const payload: AddTransferPayloadType = {
            conclusionDate: InputData.isoFormatDate(InputData.currentDate),
            files: [{
                fileName: InputData.randomWord + '.pdf',
                storageId: storageId,
                isMain: true
            }],
            mediators: [],
            note: "",
            number: params.transferNumber,
            typeId: (params.type == TransferContractTypeIds.withTermination) ?
                TransferContractTypeIds.withTermination :
                TransferContractTypeIds.withSuspension,
            prevContractStopDate: contractStopDate
        }
        if (params.type == TransferContractTypeIds.withSuspension) {
            payload.prevContractRestartDate = InputData.isoFormatDate(InputData.futureDate(1, params.contractEndDate));
        }
        const response: APIResponse = await params.page.request.put(
            url,
            {
                headers: this.headers(this.xCsrfToken, this.jSessionId),
                data: payload
            }
        )
        if (!response.ok()) throw new Error(`Ошибка при api добавлении ТК: ${await response.text()}`);
        return contractStopDate;
    }
}