import { Card } from "../model/card";
import { Deck } from "../model/deck";
import { DeckStructure } from "../model/deckStructure";
import { NumberOfPlayers } from "../model/player";

export class DeckService {
  //goal 107
  private deckStructure: DeckStructure = {
    cards: [
      {
        // These will be added dynamically
        cardType: "birthday",
        amount: 0,
      },
      {
        cardType: "champagne",
        amount: 12,
      },
      {
        cardType: "pork",
        amount: 20,
      },
      {
        cardType: "beef",
        amount: 15,
      },
      {
        cardType: "prawn",
        amount: 15,
      },
      {
        cardType: "chilli",
        amount: 10,
      },
      {
        cardType: "bowl",
        amount: 6,
      },
      {
        cardType: "vinegar",
        amount: 10,
      },
      {
        cardType: "ice",
        amount: 6,
      },
      {
        cardType: "puddin",
        amount: 15,
      },
    ],
  };

  private playerToCardMap: Map<NumberOfPlayers, number> = new Map()
    .set(2, 2)
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

  dealCards(deck: Deck, players: NumberOfPlayers): Card[][] {
    const cardsPerPlayer = this.playerToCardMap.get(players);
    let hands: Card[][] = new Array(players)
      .fill(false)
      .map(() => new Array(cardsPerPlayer).fill(false));

    for (let card = 0; card < cardsPerPlayer; card++) {
      for (let playerId = 0; playerId < players; playerId++) {
        hands[playerId][card] = deck.pop();
      }
    }
    return hands;
  }

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
