// import io = require("socket.io");
import * as io from "socket.io";
import { DeckService } from "./service/deckService";
const server = io.listen(3000);
const deck: DeckService = new DeckService();

server.on("connection", (socket) => {
  console.log("user connected");
  socket.emit("welcome", "");
  socket.on("emit", (message: unknown) => {
    socket.emit("reply", JSON.stringify(deck.shuffleArray(deck.createDeck())));
  });
});
