import { Deck } from "./deck";
import { Player } from "./player";
import { Table } from "./table";

export class Game {
  round: GameRound;
  roundTurn: number;
  deck: Deck;
  discardPile: Deck = [];
  players: Player[] = [];
  gameTable: Table;
  gameEnded: boolean = false;
}

type GameRound = 0 | 1 | 2 | 3;
