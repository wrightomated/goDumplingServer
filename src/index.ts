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
  let token = socket.handshake.query.token;
  console.log(token);
  if (true) {
    return next();
  }
  return next(new Error("authentication error"));
});

server.on("connection", (socket) => {
  socket.emit("welcome", socket.id);
  socket.on("cardSelected", (cardId) => {
    const player = gameService.gameState.players.find(
      (x) => x.socketId === socket.id
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
    gameService.addPlayer(socket.id);
    server.sockets.emit("playersReady", gameService.numberOfPlayers);
    questionStartGame();
    // gameService.init(2);
    // gameService.nextRound();
    // socket.emit("updateHand", gameService.gameState.players[0].hand);
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
  if (timeleft > 0) {
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
      .to(x.socketId)
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
