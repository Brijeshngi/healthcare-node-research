import { producer, connectKafka } from "../config/kafka.js";

const run = async () => {
  await connectKafka();

  // Example simulated vital events
  const vitals = [
    {
      patientId: "650f1a...45",
      vitalType: "HeartRate",
      valueNumeric: 130,
      unit: "bpm",
    },
    {
      patientId: "650f1a...45",
      vitalType: "SpO2",
      valueNumeric: 85,
      unit: "%",
    },
    {
      patientId: "650f1a...45",
      vitalType: "BloodPressure",
      systolic: 160,
      diastolic: 100,
      unit: "mmHg",
    },
  ];

  for (const v of vitals) {
    await producer.send({
      topic: "vitals-stream",
      messages: [{ value: JSON.stringify(v) }],
    });
    console.log("📤 Produced vital:", v);
  }

  await producer.disconnect();
};

run().catch(console.error);
