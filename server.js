import { ENV } from "./config/env.js";
import { connectDB } from "./config/database.js";
// import { startLabConsumer } from "./consumers/labConsumer.js";
import app from "./app.js";

const startServer = async () => {
  await connectDB();
  // await startLabConsumer();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
};

startServer();
