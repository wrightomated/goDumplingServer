import { Card, CardType } from "../model/card";
import { Player } from "../model/player";
import { PlayerConnection } from "../model/playerConnection";

export const generatePlayer = (id: number) => {
  return new Player(id, new PlayerConnection("1", "2"));
};

export const getCard = (id?: number, type?: CardType) => {
  return new Card(type ?? "prawn", id ?? 0);
};

export class GenPlayerOptions {
  numberOfPlayers: number;
  numberOfCardsInHand: number = 0;
  numberOfCardsInPlay: number = 0;
}

export const generatePlayers = (op: GenPlayerOptions) => {
  const players = [];
  let pId = 0;
  let cId = 0;
  for (let index = 0; index < op.numberOfPlayers; index++) {
    let player = generatePlayer(pId++);
    for (let j = 0; j < op.numberOfCardsInHand; j++) {
      player.hand.push(getCard(cId++));
    }
    for (let j = 0; j < op.numberOfCardsInPlay; j++) {
      player.playSpace.push(getCard(cId++));
    }
    players.push(player);
  }
  return players;
};

// let pId = 0;
// let cId = 0;
// const testPlayer =
// const testCard = new Card("prawn", 0);
// const input = [
//   {
//     ...testPlayer,
//     playSpace: [
//       { ...testCard },
//       { ...testCard, type: "champagne" as const, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//     ],
//   },
//   {
//     ...testPlayer,
//     playSpace: [
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//       { ...testCard, id: cId++ },
//     ],
//   },
// ];
// expect(scoringService.findChampagnes(input)).toEqual([0, 1, 0, 0, 0, 0, 0]);
