import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("ORDER_CREATED", (data) => {
  console.log("\nORDER_CREATED");
  console.log(data);
});

socket.on("ORDER_UPDATED", (data) => {
  console.log("\nORDER_UPDATED");
  console.log(data);
});

socket.on("ORDER_DELETED", (data) => {
  console.log("\nORDER_DELETED");
  console.log(data);
});
