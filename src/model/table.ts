import { Card } from "./card";
import { Game } from "./game";

export class Table {
  players: PlayerOverview[];
  round: number;
  deckSize: number;
  discardSize: number;

  constructor(gameState: Game, winnerIDs?: number[]) {
    this.round = gameState.round;
    this.deckSize = gameState.deck.length;
    this.discardSize = gameState.discardPile.length;
    this.players = gameState.players
      .filter((p) => p.isPlaying)
      .map((p, i) => {
        return {
          playArea: p.playSpace,
          playerName: p.name,
          playerScore: p.totalScore,
          playerPuddins: p.puddins,
          selectedCard: p.playedThisTurn,
          winner: winnerIDs.includes(p.id),
        };
      });
  }
}

export class PlayerOverview {
  playArea: Card[];
  playerName: string;
  playerScore: number;
  playerPuddins: number;
  selectedCard: boolean;
  winner?: boolean = false;
}
