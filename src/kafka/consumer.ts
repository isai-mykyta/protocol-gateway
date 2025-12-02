import { KafkaConsumer } from "@mykyta-isai/node-utils";

import { KAFKA_TOPICS } from "../constants";

export const kafkaConsumer = new KafkaConsumer({
  topics: [KAFKA_TOPICS.CS_MESSAGE_IN],
  brokers: [process.env.KAFKA_CONSUMER_BROKER_URL],
  clientId: process.env.KAFKA_CONSUMER_CLIENT_ID,
  groupId: process.env.KAFKA_CONSUMER_GROUP_ID,
  readFromBeginning: false
});
