import { Card, CardType } from "../model/card";
import { Player } from "../model/player";
import { PlayerOverview } from "../model/table";

export class ScoringService {
  private reducer = (accumulator: number, currentValue: number) =>
    accumulator + currentValue;

  // make this a config file
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
  private vinegarDumpling = 1;
  private chilliDumping = 2;
  private iceLast = -5;
  private puddingSet = 3;
  private puddingSetScore = 6;
  private leastPuddingScore = -12;
  private dumplingSetScore = 4;
  private mostPrawn = 9;
  private mostBeef = 6;
  private mostPork = 3;
  private champagneMultiplier = 2;

  score(players: Player[]): number[] {
    const champagnes = this.findChampagnes(players);
    return players.map((p, i) => {
      let score = p.totalScore;
      score += this.dumplingSet(p);
      score += this.bowlAndSauce(p);
      score += this.ice(p.playSpace);
      score = p.playSpace
        .map((c, j) => this.calculateScore(c.type, champagnes[j]))
        .reduce(this.reducer, score);
      return score;
    });
  }

  scorePuddins(players: Player[]) {
    const sorted: Player[] = [...players].sort((a, b) => {
      return a.puddins - b.puddins;
    });
    const lowestPudding: number = sorted[0].puddins;

    players.forEach((p) => {
      if (p.puddins === lowestPudding) {
        p.totalScore += this.leastPuddingScore;
      }
      p.totalScore +=
        Math.floor(p.puddins / this.puddingSet) * this.puddingSetScore;
    });
  }

  scoreDumplings(players: Player[]) {
    const endOfArray = players.length - 1;
    const beef: number = [...players].sort((a, b) => {
      return a.beef - b.beef;
    })[endOfArray].beef;
    const pork: number = [...players].sort((a, b) => {
      return a.pork - b.pork;
    })[endOfArray].pork;
    const prawn: number = [...players].sort((a, b) => {
      return a.prawn - b.prawn;
    })[endOfArray].prawn;

    players.forEach((p) => {
      if (p.prawn === prawn) {
        p.totalScore += this.mostPrawn;
      }
      if (p.beef === beef) {
        p.totalScore += this.mostBeef;
      }
      if (p.pork === pork) {
        p.totalScore += this.mostPork;
      }
    });
  }

  calculateScore(cardType: CardType, champagnes: number): number {
    if (cardType === "champagne" && champagnes > 1) {
      console.log(
        "champagne add score: ",
        this.champagneMultiplier * champagnes
      );
      return this.champagneMultiplier * champagnes;
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
      return this.dumplingSetScore;
    }
    return 0;
  }

  bowlAndSauce(p: Player): number {
    let temp = 0;
    const bowlArray = this.sliceOnCardType(p.playSpace, "bowl");
    if (bowlArray.length > 0) {
      const vArray = this.sliceOnCardType(bowlArray, "vinegar");
      const cArray = this.sliceOnCardType(bowlArray, "chilli");
      temp += this.addDumplings(vArray, this.vinegarDumpling);
      temp += this.addDumplings(cArray, this.chilliDumping);
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
      return this.iceLast;
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
