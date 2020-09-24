export class Card {
  type: CardType;
  id: number;
  constructor(cardType: CardType, id: number) {
    this.type = cardType;
    this.id = id;
  }
}

export type CardType =
  | "champagne"
  | "birthday"
  | "beef"
  | "pork"
  | "greens"
  | "puddin"
  | "beam";
