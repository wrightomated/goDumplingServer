import * as io from "socket.io";
import { Player } from "./model/player";
import { PlayerConnection } from "./model/playerConnection";
import { Table } from "./model/table";
import { GameService } from "./service/gameService";
const server = io.listen(3000);
const gameService: GameService = new GameService();
let countDownStarted: boolean = false;
let timeleft = 10;
let numberOfPlayersNeeded = 5;

// middleware
server.use((socket, next) => {
  let insecureToken: string = socket.handshake.query.token;
  console.log("connection", insecureToken);
  if (!insecureToken) {
    return next(new Error("No token"));
  }
  const playerIndex = gameService.playerInGame(socket.id, insecureToken);
  const playerConnection = new PlayerConnection(socket.id, insecureToken);

  if (playerIndex >= 0) {
    gameService.updatePlayer(playerIndex, playerConnection);
    return next();
  } else if (playerIndex === -1 && timeleft > 0) {
    gameService.addPlayer(playerConnection);
    return next();
  }
});

server.on("connection", (socket) => {
  socket.emit("welcome", socket.id);
  socket.on("cardSelected", (cardId) => {
    const player = gameService.gameState.players.find(
      (x) => x.playerConnection.socketId === socket.id
    );
    gameService.offerCard(player, cardId);
    socket.emit("updateHand", player.hand);
    if (gameService.playingPlayers.every((p) => p.playedThisTurn)) {
      gameService.nextTurn();
      updateHands();
      updateTable();
    }
    if (gameService.gameState.gameEnded) {
      setTimeout(() => {
        gameService.newGame();
      }, 30000);
    }
  });
  socket.on("ready", (playerName: string) => {
    console.log("yahoo");
    const player = gameService.playerBySocketId(socket.id);
    if (timeleft < 0 && !player.playerReady) {
      socket.emit("countdown", timeleft);
      return;
    }
    if (player.playerReady) {
      reconnectPlayer(player, socket.id);
      server.sockets.emit("playersReady", gameService.numberOfReadyPlayers);
    } else {
      gameService.playerReady(socket.id, playerName);
      server.sockets.emit("playersReady", gameService.numberOfReadyPlayers);
    }
    attemptToStartGame();
  });
  socket.on("disconnect", (socket) => {
    const player = gameService.playerBySocketId(socket.id);
    if (player) {
      player.playerConnection.connected = false;
    }
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
  gameService.playingPlayers.forEach((x, i) => {
    server
      .to(x.playerConnection.socketId)
      .emit("updateHand", gameService.playingPlayers[i].hand);
  });
}

// function updatePlayArea() {
//   const playArea = gameService.playingPlayers.map((p) => {
//     return p.playSpace;
//   });
//   server.sockets.emit("playArea", playArea);
// }

function updateTable() {
  // const table = new Table(gameService.gameState);
  const table = gameService.currentTable;
  server.sockets.emit("table", table);
}

function reconnectPlayer(player: Player, socketId: string) {
  if (timeleft === -1) {
    server.sockets.emit("countdown", timeleft);
    server.to(socketId).emit("updateHand", player.hand);
    server.to(socketId).emit("table", new Table(gameService.gameState));
  }
}
