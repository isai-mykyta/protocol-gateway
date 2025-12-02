import { KafkaProducer } from "@mykyta-isai/node-utils";

export const kafkaProducer = new KafkaProducer({
  clientId: process.env.KAFKA_PRODUCER_CLIENT_ID, 
  brokers: [process.env.KAFKA_PRODUCER_BROKER_URL] 
});
