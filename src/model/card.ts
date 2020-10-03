export class Card {
  type: CardType;
  id: number;
  offered?: boolean;
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
  | "beam"
  | "prawn";

export const cardToScore: Map<CardType, number> = new Map()
  .set("champagne", 2)
  .set("birthday", 10)
  .set("pork", 1)
  .set("beef", 2)
  .set("prawn", 3);
