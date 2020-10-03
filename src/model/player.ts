import { Card } from "./card";
import { PlayerConnection } from "./playerConnection";

export class Player {
  id: number;
  playerConnection: PlayerConnection;
  totalScore: number = 0;
  playedThisTurn: boolean = false;
  playerReady: boolean = false;
  hand: Card[];
  playSpace: Card[] = [];
  name: string;
  isPlaying: boolean = false;
  desserts: Card[] = [];

  constructor(id: number, playerConnection: PlayerConnection) {
    this.id = id;
    this.playerConnection = playerConnection;
  }
}

export type NumberOfPlayers = 2 | 3 | 4 | 5;
