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
  puddins: number = 0;
  pork = 0;
  prawn = 0;
  beef = 0;

  constructor(id: number, playerConnection: PlayerConnection) {
    this.id = id;
    this.playerConnection = playerConnection;
  }

  // reset() {
  //   this.hand = [];
  //   this.playSpace = [];
  //   this.prawn = 0;
  //   this.pork = 0;
  //   this.beef = 0;
  //   this.puddins = 0;
  //   this.isPlaying = false;
  //   this.playerReady = false;
  //   this.totalScore = 0;
  //   this.playedThisTurn = false;
  // }
}

export type NumberOfPlayers = 2 | 3 | 4 | 5;
