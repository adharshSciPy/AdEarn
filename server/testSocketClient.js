// testSocketClient.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const userId = "682ab2653d30856b564e93a8"; // Replace with a real user ID

socket.on("connect", () => {
  console.log("🟢 Connected as test client:", socket.id);
  socket.emit("register", userId);
});

socket.on("notification", (data) => {
  console.log("🔔 Notification received on socket:", data);
});
