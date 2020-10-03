import { isRegExp } from "util";
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
      .map((p, i) => {
        return {
          playArea: p.playSpace,
          playerName: p.name,
          playerScore: p.totalScore,
          playerPuddins: p.puddins,
          winner: this.findWinner(gameState, p.totalScore),
        };
      });
  }

  private findWinner(gameState: Game, score: number) {
    if (gameState.gameEnded) {
      return (
        gameState.players
          .filter((p) => p.isPlaying)
          .sort((a, b) => {
            return a.totalScore - b.totalScore;
          })[0].totalScore === score
      );
    }
    return false;
  }
}

export class PlayerOverview {
  playArea: Card[];
  playerName: string;
  playerScore: number;
  playerPuddins: number;
  winner?: boolean = false;
}
