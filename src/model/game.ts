import { DeckService } from "../service/deckService";
import { Deck } from "./deck";
import { NumberOfPlayers, Player } from "./player";
import { Table } from "./table";

export class Game {
  round: GameRound;
  roundTurn: number;
  deck: Deck;
  players: Player[];
  gameTable: Table;
  private deckService: DeckService = new DeckService();

  constructor() {}

  init(numberOfPlayers: NumberOfPlayers) {
    this.deck = this.deckService.createDeck();
    this.round = 0;
    this.players = [...Array(numberOfPlayers)].map((_, i) => new Player(i));
  }

  nextRound() {
    if (this.round === 3) {
      //endgame
    }
    this.deck = this.deckService.shuffleArray(this.deck);
    this.round++;
    // deal cards
  }
}

type GameRound = 0 | 1 | 2 | 3;
