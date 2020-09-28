import { Card } from "../model/card";
import { Game } from "../model/game";
import { NumberOfPlayers, Player } from "../model/player";
import { DeckService } from "./deckService";

export class GameService {
  gameState: Game = new Game();
  deckService: DeckService = new DeckService();
  numberOfPlayers: number = 0;
  socketIds: string[] = [];

  addPlayer(socketId: string) {
    this.socketIds[this.numberOfPlayers] = socketId;
    this.numberOfPlayers++;
  }

  init() {
    this.gameState.deck = this.deckService.createDeck();
    this.gameState.round = 0;
    this.gameState.players = [...Array(this.numberOfPlayers)].map(
      (_, i) => new Player(i, this.socketIds[i])
    );
  }

  nextRound() {
    if (this.gameState.round === 3) {
      //endgame
    }
    this.gameState.deck = this.deckService.shuffleArray(this.gameState.deck);
    this.gameState.round++;
    this.gameState.roundTurn = 1;
    let hands = this.deckService.dealCards(
      this.gameState.deck,
      this.gameState.players.length as NumberOfPlayers
    );
    this.gameState.players.forEach((p) => {
      p.hand = hands[p.id];
    });
    // console.log(JSON.stringify(this.gameState, null, 2));
  }

  nextTurn() {
    const heldHand = [...this.gameState.players[0].hand].filter(
      (c) => !c.offered
    );
    this.gameState.players.forEach((p, i, a) => {
      p.playSpace.push(p.offeredCard);
      p.offeredCard = undefined;
      p.playedThisTurn = false;
      p.hand =
        p.id < a.length - 1
          ? [...a[i + 1].hand].filter((c) => !c.offered)
          : heldHand;
    });
  }

  offerCard(player: Player, cardId: number) {
    if (player.playedThisTurn) {
      return;
    }
    const card = player.hand.find((c) => c.id === cardId);
    if (!card) {
      console.log("bad");
      return;
    }
    // player.hand = player.hand.filter((card) => card.id !== cardId);
    player.hand = player.hand.map((card: Card) => {
      if (card.id !== cardId) {
        return card;
      }
      return { ...card, offered: true };
    });
    player.offeredCard = card;
    player.playedThisTurn = true;
  }
}
