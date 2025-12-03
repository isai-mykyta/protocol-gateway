/* eslint-disable import/order */
import * as dotenv from "dotenv";

dotenv.config();

import "reflect-metadata";

import { logger } from "@mykyta-isai/node-utils";
import { kafkaConsumer, kafkaProducer } from "./kafka";
import { valkeyService } from "./valkey";

const shutdown = async (): Promise<void> => {
  if (kafkaProducer.isConnected) {
    logger.info("Disconnecting Kafka producer...");
    await kafkaProducer.disconnect();
  }

  if (kafkaConsumer.isConnected) {
    logger.info("Disonnecting Kafka consumer...");
    await kafkaConsumer.disconnect();
  }

  if (valkeyService.isConnected) {
    logger.info("Disconnecting Valkey client...");
    await valkeyService.destroy();
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
