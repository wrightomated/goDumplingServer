import { Card } from "./card";

export class Player {
  id: number;
  socketId: string;
  totalScore: number = 0;
  playedThisTurn: boolean = false;
  offeredCard: Card;
  hand: Card[];
  playSpace: Card[] = [];

  constructor(id: number, socketId: string) {
    this.id = id;
    this.socketId = socketId;
  }
}

export type NumberOfPlayers = 2 | 3 | 4 | 5;
