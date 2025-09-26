import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "healthcare-platform",
  brokers: ["localhost:9092"], // adjust if using Docker/K8s cluster
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "vitals-consumer-group" });

export const connectKafka = async () => {
  await producer.connect();
  await consumer.connect();
  console.log("✅ Kafka connected");
};
