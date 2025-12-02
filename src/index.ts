/* eslint-disable import/order */
import * as dotenv from "dotenv";

dotenv.config();

import "reflect-metadata";

import { KAFKA_TOPICS } from "./constants";
import { 
  KafkaConsumer, 
  logger, 
  ValkeyService 
} from "@mykyta-isai/node-utils";
import { EachMessagePayload } from "kafkajs";
import { ProtocolService } from "./protocol";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;
const KAFKA_BROKER_URL = process.env.KAFKA_BROKER_URL;

const VALKEY_HOST = process.env.VALKEY_HOST;
const VALKEY_USE_TLS = process.env.VALKEY_USE_TLS === "true";
const VALKEY_USE_CLUSTER_MODE = process.env.VALKEY_USE_CLUSTER_MODE === "true";
const VALKEY_CLIENT_NAME = process.env.VALKEY_CLIENT_NAME;
const VALKEY_PORT = Number(process.env.VALKEY_PORT);
const VALKEY_TIMEOUT = Number(process.env.VALKEY_TIMEOUT);

const kafkaConsumer = new KafkaConsumer({
  topics: [KAFKA_TOPICS.CS_MESSAGE_IN],
  brokers: [KAFKA_BROKER_URL],
  clientId: KAFKA_CLIENT_ID,
  groupId: KAFKA_GROUP_ID,
  readFromBeginning: false
});

const valkeyService = new ValkeyService({ clientId: VALKEY_CLIENT_NAME });
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
  host: VALKEY_HOST,
  useTls: VALKEY_USE_TLS,
  isClusterMode: VALKEY_USE_CLUSTER_MODE,
  clientName: VALKEY_CLIENT_NAME,
  port: VALKEY_PORT,
  timeout: VALKEY_TIMEOUT,
}).then(() => kafkaConsumer.connect(messageHandler));

const shutdown = async () => {
  logger.info("Shutting down gracefully...");

  if (kafkaConsumer.isConnected) {
    try {
      logger.info("Disconnecting Kafka producer...");
      await kafkaConsumer.disconnect();
    } catch (error) {
      logger.error("[Kafka] Error disconnecting producer:", error);
      process.exit(1);
    }
  }

  if (valkeyService.isConnected) {
    try {
      logger.info("Disconnecting Valkey client...");
      await valkeyService.destroy();
    } catch (error) {
      logger.error("[Valkey] Error disconnecting client:", error);
      process.exit(1);
    }
  }
};

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
