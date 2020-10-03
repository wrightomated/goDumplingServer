import { Card, CardType } from "../model/card";
import { Player } from "../model/player";
import { PlayerOverview } from "../model/table";

export class ScoringService {
  private reducer = (accumulator: number, currentValue: number) =>
    accumulator + currentValue;

  private cardToScore: Map<CardType, number> = new Map()
    .set("champagne", 0)
    .set("birthday", 0)
    .set("pork", 1)
    .set("beef", 2)
    .set("prawn", 3)
    .set("ice", 1)
    .set("bowl", 0)
    .set("chilli", 2)
    .set("vinegar", 3)
    .set("puddin", 0);

  score(players: Player[]): void {
    const champagnes = this.findChampagnes(players);
    players.forEach((p, i) => {
      p.totalScore += this.dumplingSet(p);
      p.totalScore += this.bowlAndSauce(p);
      p.totalScore += this.ice(p.playSpace);
      p.totalScore = p.playSpace
        .map((c, j) => this.calculateScore(c.type, champagnes[i]))
        .reduce(this.reducer, p.totalScore);
      console.log("SCORE", p.playSpace, p.totalScore);
    });
  }

  scorePuddins(players: Player[]) {
    const sorted: Player[] = players.sort((a, b) => {
      return a.puddins - b.puddins;
    });
    console.log(sorted);
    const lowestPudding: number = sorted[0].puddins;
    // players.find(
    //   (p) => p.id === sorted[sorted.length - 1].id
    // ).totalScore += -12;
    players.forEach((p) => {
      if (p.puddins === lowestPudding) {
        p.totalScore -= 12;
      }
      p.totalScore += Math.floor(p.puddins / 3);
    });
  }

  scoreDumplings(players: Player[]) {
    const beef: number = players.sort((a, b) => {
      return a.beef + b.beef;
    })[0].beef;
    const pork: number = players.sort((a, b) => {
      return a.pork + b.pork;
    })[0].pork;
    const prawn: number = players.sort((a, b) => {
      return a.prawn + b.prawn;
    })[0].prawn;
    players.forEach((p) => {
      if (p.prawn === prawn) {
        p.totalScore += 9;
      }
      if (p.beef === beef) {
        p.totalScore += 6;
      }
      if (p.pork === pork) {
        p.totalScore += 3;
      }
    });
  }

  calculateScore(cardType: CardType, champagnes: number): number {
    if (cardType === "champagne" && champagnes > 1) {
      return 2 * champagnes;
    }
    return this.cardToScore.get(cardType);
  }

  findChampagnes(players: Player[]): number[] {
    const playedCardsLength = players[0].playSpace.length;
    const champagnes = [];
    for (let i = 0; i < playedCardsLength; i++) {
      const champs = players
        .map((p) => {
          return p.playSpace[i].type === "champagne" ? 1 : 0;
        })
        .reduce(this.reducer, 0);

      champagnes.push(champs);
    }
    return champagnes;
  }

  dumplingSet(p: Player): number {
    if (
      p.playSpace.some((c) => c.type === "prawn") &&
      p.playSpace.some((c) => c.type === "beef") &&
      p.playSpace.some((c) => c.type === "pork")
    ) {
      return 4;
    }
    return 0;
  }

  bowlAndSauce(p: Player): number {
    let temp = 0;
    const bowlArray = this.sliceOnCardType(p.playSpace, "bowl");
    if (bowlArray.length > 0) {
      const vArray = this.sliceOnCardType(bowlArray, "vinegar");
      const cArray = this.sliceOnCardType(bowlArray, "chilli");
      temp += this.addDumplings(vArray, 1);
      temp += this.addDumplings(cArray, 1);
    }
    return temp;
  }

  sliceOnCardType(cards: Card[], type: CardType): Card[] {
    const i = cards.findIndex((c) => c.type === type);
    return i > -1 ? cards.slice(i) : [];
  }

  addDumplings(cards: Card[], dumplingWorth: number): number {
    return cards
      .map((c) => {
        return c.type === "prawn" || c.type === "beef" || c.type === "pork"
          ? dumplingWorth
          : 0;
      })
      .reduce(this.reducer, 0);
  }

  ice(cards: Card[]) {
    if (cards[cards.length - 1].type === "ice") {
      return -5;
    }
    return 0;
  }
}

//Bowl:
// Hot sauce, Vinegar

// Bowl: 0
// Hot sauce: 2 pts, if bowl 2 pts per dumpling
// Vinegar: 2 pts, if bowl 2 pts per dumpling

// Mango Pudding:
