import { Card, CardType } from "../model/card";
import { Deck } from "../model/deck";
import { DeckStructure } from "../model/deckStructure";
import { NumberOfPlayers } from "../model/player";

export class DeckService {
  private deckStructure: DeckStructure = {
    cards: [
      {
        cardType: "birthday",
        amount: 1,
      },
      {
        cardType: "champagne",
        amount: 5,
      },
      {
        cardType: "pork",
        amount: 15,
      },
      {
        cardType: "beef",
        amount: 15,
      },
    ],
  };

  private playerToCardMap: Map<NumberOfPlayers, number> = new Map()
    .set(3, 9)
    .set(4, 8)
    .set(5, 7);

  createDeck(): Deck {
    let id = 1;
    const arrays = this.deckStructure.cards.map((x) => {
      return [...Array(x.amount)].map(() => new Card(x.cardType, id++));
    });
    return [].concat.apply([], arrays);
  }

  dealCards(deck: Deck, players: NumberOfPlayers) {}

  shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
}
