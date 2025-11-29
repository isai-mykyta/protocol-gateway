import { logger } from "@mykyta-isai/logger";
import { ClassConstructor } from "class-transformer";

import { 
  CallErrorMessage,
  CallMessage,
  CallResultMessage,
  CsMessageReceivedPayload, 
  OcppMessage, 
  OcppMessageType
} from "../types";
import { 
  AuthorizeReqDto, 
  BootNotificationReqDto, 
  ChangeConfigurationConfDto, 
  GetConfigurationConfDto,
  MeterValuesReqDto,
  ResetConfDto,
  StartTransactionReqDto,
  StatusNotificationReqDto,
  StopTransactionReqDto
} from "./dtos";
import { 
  OcppErrorCode, 
  OcppMessageAction 
} from "./types";
import { validateDto } from "../../utils";

export class Ocpp16Service {
  private ocppResponseValidator = {
    [OcppMessageAction.CHANGE_CONFIGURATION]: ChangeConfigurationConfDto,
    [OcppMessageAction.GET_CONFIGURATION]: GetConfigurationConfDto,
    [OcppMessageAction.RESET]: ResetConfDto,
  };

  private ocppRequestValidator = {
    [OcppMessageAction.BOOT_NOTIFICATION]: BootNotificationReqDto,
    [OcppMessageAction.AUTHORIZE]: AuthorizeReqDto,
    [OcppMessageAction.METER_VALUES]: MeterValuesReqDto,
    [OcppMessageAction.START_TRANSACTION]: StartTransactionReqDto,
    [OcppMessageAction.STOP_TRANSACTION]: StopTransactionReqDto,
    [OcppMessageAction.STATUS_NOTIFICATION]: StatusNotificationReqDto
  };

  private mapErrorConstraintToErrorCode(constraint: string): OcppErrorCode {
    switch (constraint) {
    case "isEmail":
    case "isUUID":
    case "isDateString":
    case "isUrl":
    case "whitelistValidation":
    case "maxLength":
    case "minLength":
    case "length":
    case "isEnum":
      return OcppErrorCode.FORMATION_VIOLATION;

    case "isInt":
    case "isBoolean":
    case "isString":
    case "isNumber":
      return OcppErrorCode.TYPE_CONSTRAINT_VIOLATION;

    case "isNotEmpty":
      return OcppErrorCode.PROTOCOL_ERROR;
        
    case "customValidation":
      return OcppErrorCode.NOT_IMPLEMENTED;
        
    default:
      return OcppErrorCode.GENERIC_ERROR;
    }
  }

  private validateOcppPayload<P>(payload: P, validator: ClassConstructor<any>): { isValid: boolean, errorCode?: OcppErrorCode } {
    const { isValid, errors } = validateDto(payload, validator);
    return { isValid, errorCode: !isValid ? this.mapErrorConstraintToErrorCode(errors[0].constraint) : undefined };
  };

  private validateOcppMessage(message: OcppMessage<unknown>): boolean {
    const [messageType] = message;
    return Array.isArray(message) && [2, 3, 4].includes(messageType);
  };

  private validateOcppCallMessage(message: CallMessage<unknown>): boolean {
    return message?.[0] === OcppMessageType.CALL && message.length === 4;
  };

  private validateOcppCallResultMessage(message: CallResultMessage<unknown>): boolean {
    return message?.[0] === OcppMessageType.RESULT && message.length === 3;
  };

  private validateOcppRequestPayload<P>(action: OcppMessageAction, payload: P): { isValid: boolean, errorCode?: OcppErrorCode } {
    return !!this.ocppRequestValidator[action] ? this.validateOcppPayload(payload, this.ocppRequestValidator[action]) : { isValid: false, errorCode: OcppErrorCode.NOT_IMPLEMENTED };
  };

  private validateOcppResponsePayload<P>(action: OcppMessageAction, payload: P): { isValid: boolean, errorCode?: OcppErrorCode } {
    return !!this.ocppResponseValidator[action] ? this.validateOcppPayload(payload, this.ocppResponseValidator[action]) : { isValid: true };
  };

  private async handleCallResultMessage(ocppMessage: CallResultMessage): Promise<void> {}
  private async handleCallMessage(ocppMessage: CallMessage): Promise<void> {}
  private async handleCallErrorMessage(ocppMessage: CallErrorMessage): Promise<void> {}

  public async handleOcppMessage(payload: CsMessageReceivedPayload): Promise<void> {
    const { message } = payload;
    const ocppMessage: OcppMessage = JSON.parse(message);
    const isValidOcppMessage = this.validateOcppMessage(ocppMessage);

    if (!isValidOcppMessage) {
      logger.error(`[OCPP1.6]: Invalid OCPP message received: ${message}`);
      return;
    }

    const [ messageType ] = ocppMessage;

    switch (messageType) {
    case OcppMessageType.ERROR:
      this.handleCallErrorMessage(ocppMessage);
      return;
    case OcppMessageType.RESULT:
      this.handleCallResultMessage(ocppMessage);
      return;
    case OcppMessageType.CALL:
      await this.handleCallMessage(ocppMessage);
      return;
    }
  }
}
