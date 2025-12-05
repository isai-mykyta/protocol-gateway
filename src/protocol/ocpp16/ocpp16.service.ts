import { logger } from "@mykyta-isai/node-utils";
import { ClassConstructor } from "class-transformer";

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
  OcppMessageAction,
} from "./types";
import { KAFKA_TOPICS } from "../../constants";
import { kafkaProducer } from "../../kafka";
import { validateDto } from "../../utils";
import { 
  CallErrorMessage,
  CallMessage, 
  CallResultMessage, 
  CsMessageReceivedPayload, 
  OcppMessage, 
  OcppMessageType 
} from "../types";
import { 
  handleAuthorizeReq, 
  handleBootNotificationReq,
  handleMeterValuesReq,
  handleStartTransactionReq,
  handleStatusNotificationReq,
  handleStopTransactionReq
} from "./handlers";

const ocppResponseDtos = {
  [OcppMessageAction.CHANGE_CONFIGURATION]: ChangeConfigurationConfDto,
  [OcppMessageAction.GET_CONFIGURATION]: GetConfigurationConfDto,
  [OcppMessageAction.RESET]: ResetConfDto,
};

const ocppRequestDtos = {
  [OcppMessageAction.BOOT_NOTIFICATION]: BootNotificationReqDto,
  [OcppMessageAction.AUTHORIZE]: AuthorizeReqDto,
  [OcppMessageAction.METER_VALUES]: MeterValuesReqDto,
  [OcppMessageAction.START_TRANSACTION]: StartTransactionReqDto,
  [OcppMessageAction.STOP_TRANSACTION]: StopTransactionReqDto,
  [OcppMessageAction.STATUS_NOTIFICATION]: StatusNotificationReqDto
};

const ocppRequestHandlers = {
  [OcppMessageAction.BOOT_NOTIFICATION]: handleBootNotificationReq,
  [OcppMessageAction.AUTHORIZE]: handleAuthorizeReq,
  [OcppMessageAction.METER_VALUES]: handleMeterValuesReq,
  [OcppMessageAction.START_TRANSACTION]: handleStartTransactionReq,
  [OcppMessageAction.STOP_TRANSACTION]: handleStopTransactionReq,
  [OcppMessageAction.STATUS_NOTIFICATION]: handleStatusNotificationReq
};

const formationViolationConstraints = [
  "isEmail",
  "isUUID",
  "isDateString",
  "isUrl",
  "whitelistValidation",
  "maxLength",
  "minLength",
  "length",
  "isEnum"
];

const typeConstraintViolationConstraints = [
  "isInt",
  "isBoolean",
  "isString",
  "isNumber"
];

const protocolErrrorConstraints = ["isNotEmpty"];
const notImplementedConstraints = ["customValidation"];

const mapErrorConstraintToErrorCode = (constraint: string): OcppErrorCode => {
  if (formationViolationConstraints.includes(constraint)) return OcppErrorCode.FORMATION_VIOLATION;
  if (typeConstraintViolationConstraints.includes(constraint)) return OcppErrorCode.TYPE_CONSTRAINT_VIOLATION;
  if (protocolErrrorConstraints.includes(constraint)) return OcppErrorCode.PROTOCOL_ERROR;
  if (notImplementedConstraints.includes(constraint)) return OcppErrorCode.NOT_IMPLEMENTED;
  return OcppErrorCode.GENERIC_ERROR;
};

const validateOcppPayload = <P>(payload: P, validator: ClassConstructor<any>): { isValid: boolean, errorCode?: OcppErrorCode } => {
  const { isValid, errors } = validateDto(payload, validator);
  return { isValid, errorCode: !isValid ? mapErrorConstraintToErrorCode(errors[0].constraint) : undefined };
};

const validateOcppMessage = (message: OcppMessage<unknown>): boolean => {
  const [messageType] = message;
  return Array.isArray(message) && [2, 3, 4].includes(messageType);
};

const validateOcppCallMessage = (message: CallMessage<unknown>): boolean => {
  return message?.[0] === OcppMessageType.CALL && message.length === 4;
};

const validateOcppCallResultMessage = (message: CallResultMessage<unknown>): boolean => {
  return message?.[0] === OcppMessageType.RESULT && message.length === 3;
};

const validateOcppRequestPayload = <P>(action: OcppMessageAction, payload: P): { isValid: boolean, errorCode?: OcppErrorCode } => {
  return !!ocppRequestDtos[action] ? validateOcppPayload(payload, ocppRequestDtos[action]) : { isValid: false, errorCode: OcppErrorCode.NOT_IMPLEMENTED };
};

const validateOcppResponsePayload = <P>(action: OcppMessageAction, payload: P): { isValid: boolean, errorCode?: OcppErrorCode } => {
  return !!ocppResponseDtos[action] ? validateOcppPayload(payload, ocppResponseDtos[action]) : { isValid: true };
};

const publishOcppResponse = async (resposnse: string, identity: string): Promise<void> => {
  try {
    await kafkaProducer.publish(KAFKA_TOPICS.CS_MESSAGE_OUT, resposnse, identity, { identity });
    return;
  } catch (error) {
    logger.error(`[OCPP1.6]: Failed to publish OCPP response: response - ${resposnse}`, error);
    return;
  }
};

const handleCallResultMessage = async (data: Omit<CsMessageReceivedPayload, "message"> & { message: CallResultMessage }): Promise<void> => {
  const { message } = data;
  const isValidCallResultMessage = validateOcppCallResultMessage(message);

  if (!isValidCallResultMessage) {
    logger.error(`[OCPP1.6]: Invalid OCPP call result message received: ${JSON.stringify(data)}`);
    return;
  }
};

const handleCallErrorMessage = async (payload: Omit<CsMessageReceivedPayload, "message"> & { message: CallErrorMessage }): Promise<void> => {
  logger.warn(`[OCPP1.6]: Call Error message received. ${JSON.stringify(payload)}`);
};

const handleCallMessage = async (data: Omit<CsMessageReceivedPayload, "message"> & { message: CallMessage<OcppMessageAction> }): Promise<void> => {
  const { message, identity } = data;
  const isValidCallMessage = validateOcppCallMessage(message);

  if (!isValidCallMessage) {
    logger.error(`[OCPP1.6]: Invalid OCPP call message received: ${JSON.stringify(data)}`);
    return;
  }

  const [, messageId, action, ocppPayload] = message;
  const { isValid: isValidOcppPayload, errorCode } = validateOcppRequestPayload(action, ocppPayload);

  if (!isValidOcppPayload) {
    logger.error(`[OCPP1.6]: Invalid OCPP call message payload received: ${JSON.stringify(data)}`);
    const response = [OcppMessageType.RESULT, messageId, errorCode, "", "{}"];
    await publishOcppResponse(JSON.stringify(response), identity);
    return;
  }

  if (!ocppRequestHandlers[action]) {
    logger.error(`[OCPP1.6]: Unknow action received: action - ${action}`);
    const response = [OcppMessageType.RESULT, messageId, OcppErrorCode.NOT_IMPLEMENTED, "", "{}"];
    await publishOcppResponse(JSON.stringify(response), identity);
    return;
  }

  const responsePayload = await ocppRequestHandlers[action]({ ...data, message });
  const response = [OcppMessageType.RESULT, messageId, responsePayload];
  await publishOcppResponse(JSON.stringify(response), identity);
};

export const handleOcpp16Message = async (data: CsMessageReceivedPayload): Promise<void> => {
  const { message } = data;
  const ocppMessage: OcppMessage<OcppMessageAction> = JSON.parse(message);
  const isValidOcppMessage = validateOcppMessage(ocppMessage);

  if (!isValidOcppMessage) {
    logger.error(`[OCPP1.6]: Invalid OCPP message received: ${message}`);
    return;
  }

  const [ messageType ] = ocppMessage;

  switch (messageType) {
  case OcppMessageType.ERROR:
    await handleCallErrorMessage({ ...data, message: ocppMessage });
    return;
  case OcppMessageType.RESULT:
    await handleCallResultMessage({ ...data, message: ocppMessage });
    return;
  case OcppMessageType.CALL:
    await handleCallMessage({ ...data, message: ocppMessage });
    return;
  }
};
