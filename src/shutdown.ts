import { logger } from "@mykyta-isai/node-utils";

import { kafkaConsumer, kafkaProducer } from "./kafka";
import { valkeyService } from "./valkey";

const disconnectKafkaConsumer = async (): Promise<void> => {
  if (kafkaConsumer.isConnected) {
    try {
      logger.info("Disconnecting Kafka consumer...");
      await kafkaConsumer.disconnect();
    } catch (error) {
      logger.error("[Kafka] Error disconnecting consumer:", error);
      process.exit(1);
    }
  }
};

const disconnectKafkaProducer = async (): Promise<void> => {
  if (kafkaProducer.isConnected) {
    try {
      logger.info("Disconnecting Kafka producer...");
      await kafkaProducer.disconnect();
    } catch (error) {
      logger.error("[Kafka] Error disconnecting producer:", error);
      process.exit(1);
    }
  }
};

const disconnectValkeyClient = async (): Promise<void> => {
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

export const shutdown = async () => {
  logger.info("Shutting down gracefully...");

  await disconnectKafkaConsumer();
  await disconnectKafkaProducer();
  await disconnectValkeyClient();
};
