/* eslint-disable import/order */
import * as dotenv from "dotenv";

dotenv.config();

import "reflect-metadata";

import { logger } from "@mykyta-isai/node-utils";
import { EachMessagePayload } from "kafkajs";
import { ProtocolService } from "./protocol";
import { kafkaConsumer, kafkaProducer } from "./kafka";
import { KAFKA_TOPICS } from "./constants";
import { valkeyService } from "./valkey";
import { shutdown } from "./shutdown";

const protocolService = new ProtocolService();

const messageHandler = async (payload: EachMessagePayload): Promise<void> => {
  const { message, topic } = payload;
  logger.info(`New message received: topic - ${topic}`);

  switch (topic) {
  case KAFKA_TOPICS.CS_MESSAGE_IN:
    try {
      const parsedMessage = message.value.toString();
      const headers = message.headers || {};

      const identity = headers.identity?.toString("utf-8");
      const ipAddress = headers.ipAddress?.toString("utf-8");
      const protocol = headers.protocol?.toString("utf-8");
      const timestamp = headers.timestamp?.toString("utf-8");

      await protocolService.handleCsMessage({
        message: parsedMessage,
        identity,
        ipAddress,
        protocol,
        timestamp: Number(timestamp)
      });
      return;
    } catch (error) {
      logger.error(`Failed to process message from ${KAFKA_TOPICS.CS_MESSAGE_IN} topic`, error);
      return;
    }
  default:
    logger.error(`Received message from uknown topic: topic - ${topic}`);
    return;
  }
};

valkeyService.init({
  host: process.env.VALKEY_HOST,
  useTls: process.env.VALKEY_USE_TLS === "true",
  isClusterMode: process.env.VALKEY_USE_CLUSTER_MODE === "true",
  clientName: process.env.VALKEY_CLIENT_NAME,
  port: Number(process.env.VALKEY_PORT),
  timeout: Number(process.env.VALKEY_TIMEOUT),
})
  .then(() => kafkaConsumer.connect(messageHandler))
  .then(() => kafkaProducer.connect());

process.on("SIGTERM", async (signal) => {
  logger.warn(`[${signal}] received!`);
  await shutdown();
  process.exit(0);
});

process.on("SIGINT", async (signal) => {
  logger.warn(`[${signal}] received!`);
  await shutdown();
  process.exit(0);
});
