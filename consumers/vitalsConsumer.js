import { consumer, connectKafka } from "../config/kafka.js";
import { VitalRecord } from "../models/VitalRecord.js";
import { generateVitalsAdvice } from "../services/vitalsAdviceEngine.js";
import mongoose from "mongoose";

const run = async () => {
  await connectKafka();
  await consumer.subscribe({ topic: "vitals-stream", fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const data = JSON.parse(message.value.toString());
        console.log("📥 Consumed vital:", data);

        const advice = generateVitalsAdvice(
          data.vitalType,
          data.valueNumeric,
          data.systolic,
          data.diastolic
        );

        await VitalRecord.create({
          patient: data.patientId, // must be ObjectId of user
          vitalType: data.vitalType,
          valueNumeric: data.valueNumeric,
          systolic: data.systolic,
          diastolic: data.diastolic,
          unit: data.unit,
          deviceId: data.deviceId,
          deviceType: data.deviceType,
          source: data.source || "stream",
          advice,
        });

        console.log("✅ Saved vital to DB with advice:", advice);
      } catch (err) {
        console.error("❌ Error processing vital:", err.message);
      }
    },
  });
};

run().catch(console.error);
