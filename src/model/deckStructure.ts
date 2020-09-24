import { CardType } from "./card";

export interface DeckStructure {
  cards: CardCount[];
}

export interface CardCount {
  cardType: CardType;
  amount: number;
}
