/* eslint-disable import/order */
import * as dotenv from "dotenv";

dotenv.config();

import { logger } from "@mykyta-isai/logger";

import { KAFKA_TOPICS } from "./constants";
import { KafkaConsumer } from "./kafka";
import { EachMessagePayload } from "kafkajs";
import { ProtocolService } from "./protocol";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;
const KAFKA_BROKER_URL = process.env.KAFKA_BROKER_URL;

const kafkaConsumer = new KafkaConsumer({
  topics: [KAFKA_TOPICS.CS_MESSAGE_RECEIVED],
  brokers: [KAFKA_BROKER_URL],
  clientId: KAFKA_CLIENT_ID,
  groupId: KAFKA_GROUP_ID,
  readFromBeginning: false
});

const protocolService = new ProtocolService();

const messageHandler = async (payload: EachMessagePayload): Promise<void> => {
  const { message, topic } = payload;
  const parsedMessage = message.value.toString();

  logger.info(`New message received: topic - ${topic}, message - ${parsedMessage}`);

  switch (topic) {
  case KAFKA_TOPICS.CS_MESSAGE_RECEIVED:
    await protocolService.handleCsMessage(parsedMessage);
    return;
  default:
    logger.error(`Received message from uknown topic: topic - ${topic}, message - ${parsedMessage}`);
    return;
  }
};

kafkaConsumer.connect(messageHandler);

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
