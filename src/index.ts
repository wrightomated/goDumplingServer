import * as io from "socket.io";
import { Table } from "./model/table";
import { GameService } from "./service/gameService";
const server = io.listen(3000);
const gameService: GameService = new GameService();
let countDownStarted: boolean = false;
let timeleft = 2;
let numberOfPlayersNeeded = 2;

// middleware
server.use((socket, next) => {
  let insecureToken: string = socket.handshake.query.token;
  console.log("connection");
  const playerConnected = gameService.addPlayer(socket.id, insecureToken);
  if (playerConnected) {
    console.log(`Added ${insecureToken} on socket ${socket.id}`);
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
      updateTable();
    }
  });
  socket.on("ready", (playerName: string) => {
    gameService.playerReady(socket.id, playerName);
    server.sockets.emit("playersReady", gameService.numberOfReadyPlayers);
    attemptToStartGame();
  });
});

function attemptToStartGame() {
  if (countDownStarted) {
    return;
  }
  if (gameService.numberOfReadyPlayers >= numberOfPlayersNeeded) {
    tickCountdown();
  }
}

function tickCountdown() {
  countDownStarted = true;
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
  server.sockets.emit("playArea", playArea);
}

function updateTable() {
  const table = new Table(gameService.gameState);
  server.sockets.emit("table", table);
}
