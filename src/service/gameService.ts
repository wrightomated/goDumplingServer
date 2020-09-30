import { Card, cardToScore } from "../model/card";
import { Game } from "../model/game";
import { NumberOfPlayers, Player } from "../model/player";
import { PlayerConnection } from "../model/playerConnection";
import { DeckService } from "./deckService";

export class GameService {
  gameState: Game = new Game();
  deckService: DeckService = new DeckService();
  numberOfPlayers: number = 0;
  socketIds: string[] = [];
  playerConnections: PlayerConnection[] = [];

  addPlayer(socketId: string, insecureToken: string): boolean {
    const socketInUse = this.playerConnections.filter(
      (x) => x.socketId === socketId
    );
    // I can't imagine this happening.
    if (socketInUse) {
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

    this.numberOfPlayers = this.playerConnections.length;
    return true;
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
    // if (player.playedThisTurn) {
    //   return;
    // }
    const card = player.hand.find((c) => c.id === cardId);
    if (!card) {
      console.log("bad");
      return;
    }

    player.hand = player.hand.map((card: Card) => {
      if (card.id !== cardId) {
        return card;
      }
      return { ...card, offered: true };
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
}
