import { logger } from "@mykyta-isai/node-utils";

import { handleOcpp16Message } from "./ocpp16";
import { handleOcpp2Message } from "./ocpp2";
import { CsMessageReceivedPayload, OcppProtocol } from "./types";

const ocppProtocolHandlers = {
  [OcppProtocol.OCPP16]: handleOcpp16Message,
  [OcppProtocol.OCPP20]: handleOcpp2Message,
  [OcppProtocol.OCPP21]: handleOcpp2Message,
  [OcppProtocol.OCPP201]: handleOcpp2Message,
};

const validateCsMessage = (payload: CsMessageReceivedPayload): boolean => {
  const { message, identity, ipAddress, protocol, timestamp } = payload;

  const isValidMessage = !!message && typeof message === "string";
  const isValidIdentity = !!identity && typeof identity === "string";
  const isValidIpAddress = !!ipAddress && typeof ipAddress === "string";
  const isValidProtocol = !!protocol && Object.values(OcppProtocol).includes(protocol as OcppProtocol);
  const isValidTimestamp = !!timestamp && typeof timestamp === "number";

  return isValidMessage && isValidIdentity && isValidIpAddress && isValidProtocol && isValidTimestamp;
};

export const handleCsMessage = async (payload: CsMessageReceivedPayload): Promise<void> => {
  logger.info(`CS message received: ${JSON.stringify(payload)}`);

  if (!validateCsMessage(payload)) {
    logger.error(`Invalid CS message: ${JSON.stringify(payload)}`);
    return;
  }

  if (!ocppProtocolHandlers[payload.protocol]) {
    logger.error(`Recieved message with invalid protocol`);
    return;
  }

  await ocppProtocolHandlers[payload.protocol](payload);
};
