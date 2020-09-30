import { timeStamp } from "console";
// import io = require("socket.io");
import * as io from "socket.io";
import { DeckService } from "./service/deckService";
import { GameService } from "./service/gameService";
const server = io.listen(3000);
const deck: DeckService = new DeckService();
const gameService: GameService = new GameService();
let countDown: boolean = false;
let timeleft = 2;

// middleware
server.use((socket, next) => {
  let insecureToken: string = socket.handshake.query.token;
  if (gameService.addPlayer(socket.id, insecureToken)) {
    return next();
  }
  return next(new Error("Error adding player"));
});

server.on("connection", (socket) => {
  socket.emit("welcome", socket.id);
  socket.on("cardSelected", (cardId) => {
    const player = gameService.gameState.players.find(
      (x) => x.playerConnection.socketId === socket.id
    );
    gameService.offerCard(player, cardId);
    socket.emit("updateHand", player.hand);
    if (gameService.gameState.players.every((p) => p.playedThisTurn)) {
      gameService.nextTurn();
      updateHands();
      updatePlayArea();
    }
  });
  socket.on("ready", () => {
    console.log(`${socket.id} is ready`);

    server.sockets.emit("playersReady", gameService.numberOfPlayers);
    questionStartGame();
  });
});

function questionStartGame() {
  if (countDown) {
    return;
  }
  if (gameService.numberOfPlayers > 1) {
    tickCountdown();
  }
}

function tickCountdown() {
  countDown = true;
  if (timeleft >= 0) {
    setTimeout(() => {
      console.log("tick");
      server.sockets.emit("countdown", timeleft--);
      tickCountdown();
    }, 1000);
  } else {
    startGame();
  }
}

function startGame() {
  gameService.init();
  gameService.nextRound();
  updateHands();
  // server.emit("updateHand", gameService.gameState.players[0].hand);
}

function updateHands() {
  gameService.gameState.players.forEach((x, i) => {
    server
      .to(x.playerConnection.socketId)
      .emit("updateHand", gameService.gameState.players[i].hand);
  });
}

function updatePlayArea() {
  const playArea = gameService.gameState.players.map((p) => {
    return p.playSpace;
  });
  console.log(playArea);
  server.sockets.emit("playArea", playArea);
}
