/* eslint-disable import/order */
import * as dotenv from "dotenv";

dotenv.config();

import "reflect-metadata";
import express from "express";
import { logger } from "@mykyta-isai/node-utils";

import { kafkaConsumer, kafkaProducer } from "./kafka";
import { valkeyService } from "./valkey";
import { actionsRouter } from "./api";

const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3030;

app.listen(HTTP_PORT, () => {
  logger.info(`App is listening on port ${HTTP_PORT}`);
});

app.use("/api/actions", actionsRouter);

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
