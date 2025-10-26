import { io } from "socket.io-client";

// Connect to your server
const socket = io("http://localhost:5000");

// Fired when connected to server
socket.on("connect", () => {
  console.log("Connected with socket ID:", socket.id);

  // Optional: send a message to server immediately
  socket.emit("message", { text: "Hello server!" });
});

// Listen for messages from server
socket.on("message", (msg) => {
  console.log("New message from server:", msg);
});

// Fired when disconnected
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
