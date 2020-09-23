// import io = require("socket.io");
import * as io from "socket.io";
const server = io.listen(3000);

server.on("connection", (socket) => {
  console.log("user connected");
  socket.emit("welcome", "GOOO DUMPLING!");
  socket.on("emit", () => {
    console.log("recieved");
  });
});
