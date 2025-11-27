/* eslint-disable import/order */
import * as dotenv from "dotenv";

dotenv.config();

import { logger } from "@mykyta-isai/logger";

import { KAFKA_TOPICS } from "./constants";
import { KafkaConsumer } from "./kafka";

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;
const KAFKA_BROKER_URL = process.env.KAFKA_BROKER_URL;

const topics = [
  KAFKA_TOPICS.WS_CONNECTION_CLOSE, 
  KAFKA_TOPICS.WS_CONNECTION_OPEN, 
  KAFKA_TOPICS.WS_MESSAGE_RECEIVED
];

const kafkaConsumer = new KafkaConsumer({
  topics,
  brokers: [KAFKA_BROKER_URL],
  clientId: KAFKA_CLIENT_ID,
  groupId: KAFKA_GROUP_ID,
  readFromBeginning: false
});

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
