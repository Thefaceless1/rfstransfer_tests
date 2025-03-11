import {APIResponse, Page} from "@playwright/test";
import config from "../../playwright.config";
import {CreateInstructionPayloadType} from "../helpers/types/CreateInstructionPayloadType";
import {InputData} from "../helpers/InputData";
import * as fs from "fs";
import {ServerResponseType} from "../helpers/types/ServerResponseType";
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
import {AddWorkActivityParamsType} from "../helpers/types/AddWorkActivityParamsType";
import {AddWorkActivityPayloadType} from "../helpers/types/AddWorkActivityPayloadType";
import {RegWorkActivityParamsType} from "../helpers/types/RegWorkActivityParamsType";
import {RegWorkActivityPayloadType} from "../helpers/types/RegWorkActivityPayloadType";
import {PositionDataType} from "../helpers/types/PositionDataType";

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
     * Api добавления трудовой деятельности
     */
    private addEmployeeContract: string = "api/rest/employees/contracts"
    /**
     * Api получения должностей
     */
    private getPositionsApi: string = "api/rest/positions"
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
     * Api регистрации трудовой деятельности
     */
    private registerEmployeeContractApi = (contractId: number): string => `/api/rest/employees/contracts/${contractId}`
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
            });
        if (!response.ok()) throw new Error(`Ошибка при api добавлении ТД: ${await response.text()}`);
    }
    /**
     * Загрузка файла
     */
    private async uploadFile(page: Page): Promise<ServerResponseType> {
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
        });
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
        );
        if (!response.ok()) throw new Error(`Ошибка при api регистрации инструкции: ${await response.text()}`);
    }
    /**
     * Добавление трансфера
     */
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
        );
        if (!response.ok()) throw new Error(`Ошибка при api добавлении ТК: ${await response.text()}`);
        return contractStopDate;
    }
    /**
     * Добавление трудовой деятельности
     */
    public async addWorkActivity(params: AddWorkActivityParamsType): Promise<ServerResponseType> {
        const url: string = config.use?.baseURL + this.addEmployeeContract;
        const payload: AddWorkActivityPayloadType = {
            orgId: params.orgId,
            personId: params.personId
        }
        const response: APIResponse = await params.page.request.post(
            url,
            {
                headers: this.headers(this.xCsrfToken, this.jSessionId),
                data: payload
            }
        );
        if (!response.ok()) throw new Error(`Ошибка при api добавлении трудовой деятельности: ${await response.text()}`);
        return response.json();
    }
    /**
     * Регистрация трудовой деятельности
     */
    public async registerWorkActivity(params: RegWorkActivityParamsType): Promise<void> {
        const positionsData: PositionDataType[] = await this.getPositions(params.page);
        const url: string = config.use?.baseURL + this.registerEmployeeContractApi(params.workActivityId);
        const beginDate: string = InputData.isoFormatDate(InputData.futureDate(-30,InputData.currentDate));
        const endDate: string = InputData.isoFormatDate(InputData.futureDate(30,InputData.currentDate));
        const payload: RegWorkActivityPayloadType = {
            beginDate: beginDate,
            endDate: endDate,
            files: [],
            note: "",
            positionId: positionsData[0].id
        }
        const response: APIResponse = await params.page.request.put(
            url,
            {
                headers: this.headers(this.xCsrfToken, this.jSessionId),
                data: payload
            }
        );
        if (!response.ok()) throw new Error(`Ошибка при api регистрации трудовой деятельности: ${await response.text()}`);
    }
    /**
     * Получение должностей
     */
    private async getPositions(page: Page): Promise<PositionDataType[]> {
        const url: string = config.use?.baseURL + this.getPositionsApi;
        const params: { [key: string]: string | number | boolean; } | URLSearchParams | string = {
            'searchText': '',
            'withSoccerPlayer': true
        }
        const response: APIResponse = await page.request.get(
            url,
            {
                headers: this.headers(this.xCsrfToken, this.jSessionId),
                params: params
            }
        );
        if (!response.ok()) throw new Error(`Ошибка при api получении должностей: ${await response.text()}`);
        const responseData = await response.json();
        return responseData.data;
    }
}