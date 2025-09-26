import { kafka } from "../config/kafka.js";
import { ENV } from "../config/env.js";

const producer = kafka.producer();

export const sendLabResult = async (labData) => {
  await producer.connect();
  await producer.send({
    topic: ENV.LAB_TOPIC,
    messages: [{ value: JSON.stringify(labData) }],
  });
  console.log("📤 Sent Lab Data:", labData);
  await producer.disconnect();
};

// Run a simulation
if (process.argv[2] === "simulate") {
  setInterval(() => {
    const data = {
      patientId: `P${Math.floor(Math.random() * 1000)}`,
      testName: "Blood Sugar",
      value: Math.floor(Math.random() * 300),
      unit: "mg/dL",
    };
    sendLabResult(data);
  }, 5000);
}
