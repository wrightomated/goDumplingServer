const io = require("socket.io");
const server = io.listen(3000);

server.on("connection", function (socket) {
  console.log("user copmnnected");
  socket.emit("welcome", "GOOO DUMPLING!");
});
