import { Card } from "./card";
import { Game } from "./game";

export class Table {
  players: PlayerOverview[];
  round: number;
  deckSize: number;
  discardSize: number;

  constructor(gameState: Game) {
    this.round = gameState.round;
    this.deckSize = gameState.deck.length;
    this.discardSize = gameState.discardPile.length;
    this.players = gameState.players
      .filter((p) => p.isPlaying)
      .map((p) => {
        return {
          playArea: p.playSpace,
          playerName: p.name,
          playerScore: p.totalScore,
        };
      });
  }
}

export class PlayerOverview {
  playArea: Card[];
  playerName: string;
  playerScore: number;
}
