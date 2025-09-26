import { kafka } from "../config/kafka.js";
import { ENV } from "../config/env.js";
import LabResult from "../models/LabResult.js";
import { generateAdvice } from "../services/adviceEngine.js";

const consumer = kafka.consumer({ groupId: "lab-consumer-group" });

export const startLabConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: ENV.LAB_TOPIC });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const labData = JSON.parse(message.value.toString());
      labData.advice = generateAdvice(labData.testName, labData.value);

      const newResult = new LabResult(labData);
      await newResult.save();

      console.log("📥 Stored Lab Result:", labData);
    },
  });
};
