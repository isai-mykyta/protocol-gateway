import { KafkaConsumer, logger } from "@mykyta-isai/node-utils";
import { EachMessagePayload, KafkaMessage } from "kafkajs";

import { KAFKA_TOPICS } from "../constants";
import { handleCsMessage } from "../protocol";

export const kafkaConsumer = new KafkaConsumer({
  topics: [KAFKA_TOPICS.CS_MESSAGE_IN],
  brokers: [process.env.KAFKA_CONSUMER_BROKER_URL],
  clientId: process.env.KAFKA_CONSUMER_CLIENT_ID,
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
  readFromBeginning: false
});

const handleCsMessageIn = async (message: KafkaMessage): Promise<void> => {
  try {
    const parsedMessage = message.value.toString();
    const headers = message.headers || {};
  
    const identity = headers.identity?.toString("utf-8");
    const ipAddress = headers.ipAddress?.toString("utf-8");
    const protocol = headers.protocol?.toString("utf-8");
    const timestamp = headers.timestamp?.toString("utf-8");
  
    await handleCsMessage({
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
};

const messageHandler = async (payload: EachMessagePayload): Promise<void> => {
  const { message, topic } = payload;
  logger.info(`New message received: topic - ${topic}`);

  switch (topic) {
  case KAFKA_TOPICS.CS_MESSAGE_IN:
    await handleCsMessageIn(message);
    return;
  default:
    logger.error(`Received message from uknown topic: topic - ${topic}`);
    return;
  }
};

kafkaConsumer.connect(messageHandler)
  .catch((error) => {
    logger.error("Failed to start kafka consumer:", error);
    process.exit(1);
  });
