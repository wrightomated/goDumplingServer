import { Card } from "./card";

export class Player {
  id: number;
  totalScore: number = 0;
  playedThisTurn: boolean = false;
  offeredCard: Card;
  hand: Card[];
  playSpace: Card[];

  constructor(id: number) {
    this.id = id;
  }
}

export type NumberOfPlayers = 3 | 4 | 5;
