import { Card, cardToScore } from "../model/card";
import { Game } from "../model/game";
import { NumberOfPlayers, Player } from "../model/player";
import { PlayerConnection } from "../model/playerConnection";
import { DeckService } from "./deckService";

export class GameService {
  gameState: Game = new Game();
  deckService: DeckService = new DeckService();
  socketIds: string[] = [];
  playerConnections: PlayerConnection[] = [];

  public get numberOfPlayers(): number {
    return this.gameState.players.length;
  }

  public get numberOfReadyPlayers(): number {
    return this.gameState.players.filter((p) => p.playerReady).length;
  }

  addPlayer(socketId: string, insecureToken: string): boolean {
    const socketInUse = this.gameState?.players.find(
      (p) => p.playerConnection.socketId === socketId
    );

    // I can't imagine this happening.
    if (socketInUse) {
      console.log("socketInUse");
      return false;
    }

    const playerIndex = this.gameState.players.findIndex(
      (p) => p.playerConnection.insecureToken === insecureToken
    );

    const playerConnection: PlayerConnection = {
      socketId: socketId,
      insecureToken: insecureToken,
    };
    playerIndex === -1
      ? this.gameState.players.push(
          new Player(this.numberOfPlayers, playerConnection)
        )
      : (this.gameState.players[
          playerIndex
        ].playerConnection = playerConnection);

    return true;
  }

  playerBySocketId(socketId: string): Player {
    return this.gameState.players.find(
      (p) => p.playerConnection.socketId === socketId
    );
  }

  init() {
    this.gameState.deck = this.deckService.createDeck();
    this.gameState.round = 0;
  }

  nextRound() {
    if (this.gameState.round === 3) {
      //endgame
      console.log("end");
      return;
    }
    this.gameState.deck = this.deckService.shuffleArray(this.gameState.deck);
    this.gameState.round++;
    this.gameState.roundTurn = 1;
    this.gameState.discardPile = this.gameState.discardPile.concat(
      this.gameState.players.flatMap((p) => p.playSpace)
    );
    let hands = this.deckService.dealCards(
      this.gameState.deck,
      this.gameState.players.length as NumberOfPlayers
    );
    this.gameState.players.forEach((p) => {
      p.hand = hands[p.id];
      p.playSpace = [];
    });
  }

  nextTurn() {
    const heldHand = [...this.gameState.players[0].hand].filter(
      (c) => !c.offered
    );
    this.gameState.players.forEach((p, i, a) => {
      const offeredCard = p.hand.find((c) => c.offered);
      p.playSpace.push(offeredCard);
      // p.offeredCard = undefined;
      p.playedThisTurn = false;
      p.hand =
        p.id < a.length - 1
          ? [...a[i + 1].hand].filter((c) => !c.offered)
          : heldHand;
    });
    if (this.gameState.players[0].hand.length === 0) {
      this.score();
      this.nextRound();
    }
  }

  offerCard(player: Player, cardId: number) {
    const card = player.hand.find((c) => c.id === cardId);
    if (!card) {
      console.log("bad");
      return;
    }

    player.hand = player.hand.map((card: Card) => {
      return { ...card, offered: card.id !== cardId ? false : true };
    });
    player.playedThisTurn = true;
  }

  score() {
    const reducer = (accumulator: number, currentValue: number) =>
      accumulator + currentValue;
    this.gameState.players.forEach(
      (p) =>
        (p.totalScore = p.hand
          .map((c) => cardToScore.get(c.type))
          .reduce(reducer, p.totalScore))
    );
  }

  playerReady(socketId: string, name: string) {
    const player = this.playerBySocketId(socketId);
    player.playerReady = true;
    player.name = name ?? `Player ${player.id}`;
  }
}
