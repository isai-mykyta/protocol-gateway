import { randomUUID } from "crypto";

import { logger } from "@mykyta-isai/node-utils";
import { Request, Response } from "express";

import { KAFKA_TOPICS } from "../../constants";
import { kafkaProducer } from "../../kafka";
import { OcppMessageAction, OcppMessageType } from "../../protocol";
import { valkeyService } from "../../valkey";

export const sendOcppRequest = async <P>(
  identity: string, 
  action: OcppMessageAction, 
  payload: P
): Promise<void> => {
  const requestId = randomUUID();
  const ocppRequest = JSON.stringify([OcppMessageType.CALL, requestId, action, payload]);

  await valkeyService.set(`ocpp_req:${requestId}`, ocppRequest, 120);
  logger.info(`[Actions API]: Sending OCPP request: ${ocppRequest}, identity - ${identity}`);
  await kafkaProducer.publish(KAFKA_TOPICS.CS_MESSAGE_OUT, ocppRequest, identity);
};

export const changeConfiguration = async (req: Request, res: Response): Promise<void> => {
  try {
    await sendOcppRequest(req.params.identity, OcppMessageAction.CHANGE_CONFIGURATION, req.body);
    res.send(200);
  } catch (error) {
    logger.error(`[Actions API]: Failed to send OCPP request: action - ${OcppMessageAction.CHANGE_CONFIGURATION}, identity - ${req.params.identity}`, error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getConfiguration = async (req: Request, res: Response): Promise<void> => {
  try {
    await sendOcppRequest(req.params.identity, OcppMessageAction.GET_CONFIGURATION, req.body);
    res.send(200);
  } catch (error) {
    logger.error(`[Actions API]: Failed to send OCPP request: action - ${OcppMessageAction.GET_CONFIGURATION}, identity - ${req.params.identity}`, error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const reset = async (req: Request, res: Response): Promise<void> => {
  try {
    await sendOcppRequest(req.params.identity, OcppMessageAction.RESET, req.body);
    res.send(200);
  } catch (error) {
    logger.error(`[Actions API]: Failed to send OCPP request: action - ${OcppMessageAction.RESET}, identity - ${req.params.identity}`, error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
