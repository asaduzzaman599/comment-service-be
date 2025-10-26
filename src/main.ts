import http from "http";
import app from "./app";
import config from "./app/config";
import { connectDB } from "./db_client";
import { initSocket } from "./socket";

async function main() {
  try {
    await connectDB();

    // Create HTTP server for both Express and Socket.IO
    const server = http.createServer(app);

    // Initialize Socket.IO
    initSocket(server);

    server.listen(config.PORT, () => {
      console.log(`Server listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Server error:", error);
  }
}

main();
