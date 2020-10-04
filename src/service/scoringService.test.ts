import { Card } from "../model/card";
import { Player } from "../model/player";
import { PlayerConnection } from "../model/playerConnection";
import { generatePlayer, generatePlayers, getCard } from "../testUtils/helpers";
import { ScoringService } from "./scoringService";

const scoringService = new ScoringService();

describe("Score function", () => {
  test("Big ol component test", () => {
    let id = 0;
    let players: Player[] = generatePlayers({
      numberOfPlayers: 3,
      numberOfCardsInPlay: 0,
      numberOfCardsInHand: 0,
    });
    players[0].playSpace = [
      getCard(id++, "bowl"), // 0
      getCard(id++, "vinegar"), // 3
      getCard(id++, "beef"), // 2 + v1 = 3
      getCard(id++, "pork"), // 1 + v1 = 2
      getCard(id++, "prawn"), // 3 +v1 + set4 = 8
      getCard(id++, "champagne"), // 0 total 16
    ];
    players[1].playSpace = [
      getCard(id++, "champagne"), // 4
      getCard(id++, "vinegar"), // 3
      getCard(id++, "beef"), // 2
      getCard(id++, "pork"), // 1
      getCard(id++, "bowl"), // 0
      getCard(id++, "ice"), // -5 + 1
    ];
    players[2].playSpace = [
      getCard(id++, "champagne"),
      getCard(id++, "vinegar"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
      getCard(id++, "prawn"),
      getCard(id++, "puddin"),
    ];
    expect(scoringService.score(players)).toEqual([16, 6, 17]);
  });
});

describe("Calculate champagne", () => {
  test("Single champagne in two players", () => {
    let pId = 0;
    let cId = 0;
    const testPlayer = new Player(1, new PlayerConnection("1", "2"));
    const testCard = new Card("prawn", 0);
    const input = [
      {
        ...testPlayer,
        playSpace: [
          { ...testCard },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
        ],
      },
      {
        ...testPlayer,
        playSpace: [
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
        ],
      },
    ];
    expect(scoringService.findChampagnes(input)).toEqual([0, 1, 0, 0, 0, 0, 0]);
  });

  test("Multiple Champagnes in three players", () => {
    let pId = 0;
    let cId = 0;
    const testPlayer = new Player(1, new PlayerConnection("1", "2"));
    const testCard = new Card("prawn", 0);
    const input = [
      {
        ...testPlayer,
        playSpace: [
          { ...testCard },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
        ],
      },
      {
        ...testPlayer,
        playSpace: [
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
        ],
      },
      {
        ...testPlayer,
        playSpace: [
          { ...testCard, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, id: cId++ },
          { ...testCard, type: "champagne" as const, id: cId++ },
          { ...testCard, id: cId++ },
        ],
      },
    ];
    expect(scoringService.findChampagnes(input)).toEqual([0, 2, 3, 0, 1, 2, 1]);
  });
});

describe("score puddings", () => {
  test("clear spread of puddings", () => {
    let players: Player[] = generatePlayers({
      numberOfPlayers: 5,
      numberOfCardsInPlay: 0,
      numberOfCardsInHand: 0,
    });
    players[0].puddins = 5;
    players[1].puddins = 7;
    players[2].puddins = 2;
    players[3].puddins = 4;
    players[4].puddins = 6;
    scoringService.scorePuddins(players);
    expect(players[0].totalScore).toBe(6);
    expect(players[1].totalScore).toBe(12);
    expect(players[2].totalScore).toBe(-12);
    expect(players[3].totalScore).toBe(6);
    expect(players[4].totalScore).toBe(12);
  });
});

describe("score dumplings", () => {
  test("clear winner 2 players", () => {
    let players: Player[] = generatePlayers({
      numberOfPlayers: 2,
      numberOfCardsInPlay: 0,
      numberOfCardsInHand: 0,
    });
    players[0] = { ...players[0], beef: 0, pork: 0, prawn: 0 };
    players[1] = { ...players[1], beef: 1, pork: 1, prawn: 1 };
    scoringService.scoreDumplings(players);
    expect(players[0].totalScore).toBe(0);
    expect(players[1].totalScore).toBe(18);
  });
  test("mix 2 players", () => {
    let players: Player[] = generatePlayers({
      numberOfPlayers: 2,
      numberOfCardsInPlay: 0,
      numberOfCardsInHand: 0,
    });
    players[0] = { ...players[0], beef: 1, pork: 0, prawn: 2 };
    players[1] = { ...players[1], beef: 1, pork: 1, prawn: 1 };
    scoringService.scoreDumplings(players);
    expect(players[0].totalScore).toBe(15);
    expect(players[1].totalScore).toBe(9);
  });
  test("mix 5 players", () => {
    let players: Player[] = generatePlayers({
      numberOfPlayers: 5,
      numberOfCardsInPlay: 0,
      numberOfCardsInHand: 0,
    });
    players[0] = { ...players[0], beef: 1, pork: 0, prawn: 2 };
    players[1] = { ...players[1], beef: 1, pork: 4, prawn: 1 };
    players[2] = { ...players[1], beef: 1, pork: 1, prawn: 1 };
    players[3] = { ...players[1], beef: 10, pork: 1, prawn: 1 };
    players[4] = { ...players[1], beef: 1, pork: 4, prawn: 1 };
    scoringService.scoreDumplings(players);
    expect(players[0].totalScore).toBe(9);
    expect(players[1].totalScore).toBe(3);
    expect(players[2].totalScore).toBe(0);
    expect(players[3].totalScore).toBe(6);
    expect(players[4].totalScore).toBe(3);
  });
});

describe("Bowl and sauces", () => {
  it("dumplings before bowl and sauce should not count", () => {
    let player = generatePlayer(1);
    let id = 0;
    player.playSpace = [
      getCard(id++, "beef"),
      getCard(id++, "pork"),
      getCard(id++, "bowl"),
      getCard(id++, "vinegar"),
    ];
    expect(scoringService.bowlAndSauce(player)).toBe(0);
  });
  it("vinegar before bowl and sauce should not count", () => {
    let player = generatePlayer(1);
    let id = 0;
    player.playSpace = [
      getCard(id++, "vinegar"),
      getCard(id++, "bowl"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
    ];
    expect(scoringService.bowlAndSauce(player)).toBe(0);
  });
  it("vinegar after bowl should add 1 pts for each dumpling", () => {
    let player = generatePlayer(1);
    let id = 0;
    player.playSpace = [
      getCard(id++, "bowl"),
      getCard(id++, "vinegar"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
    ];
    expect(scoringService.bowlAndSauce(player)).toBe(2);
  });
  it("chilli after bowl should add 2 pts for each dumpling", () => {
    let player = generatePlayer(1);
    let id = 0;
    player.playSpace = [
      getCard(id++, "bowl"),
      getCard(id++, "chilli"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
    ];
    expect(scoringService.bowlAndSauce(player)).toBe(4);
  });
  it("chilli and vinegar after bowl should add 3 pts for each dumpling", () => {
    let player = generatePlayer(1);
    let id = 0;
    player.playSpace = [
      getCard(id++, "bowl"),
      getCard(id++, "chilli"),
      getCard(id++, "vinegar"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
    ];
    expect(scoringService.bowlAndSauce(player)).toBe(6);
  });
  it("vinegar and chilli after bowl should add 3 pts for each dumpling", () => {
    let player = generatePlayer(1);
    let id = 0;
    player.playSpace = [
      getCard(id++, "bowl"),
      getCard(id++, "vinegar"),
      getCard(id++, "chilli"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
    ];
    expect(scoringService.bowlAndSauce(player)).toBe(6);
  });
  it("dumpling between chilli and vinegar should only have chilli applied", () => {
    let player = generatePlayer(1);
    let id = 0;
    player.playSpace = [
      getCard(id++, "bowl"),
      getCard(id++, "chilli"),
      getCard(id++, "beef"),
      getCard(id++, "vinegar"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
    ];
    expect(scoringService.bowlAndSauce(player)).toBe(8);
  });
});

describe("ice", () => {
  it("return nothing if ice is not at end", () => {
    let id = 0;
    let cards = [
      getCard(id++, "beef"),
      getCard(id++, "pork"),
      getCard(id++, "ice"),
      getCard(id++, "vinegar"),
    ];
    expect(scoringService.ice(cards)).toBe(0);
  });
  it("return nothing if ice is not present", () => {
    let id = 0;
    let cards = [
      getCard(id++, "beef"),
      getCard(id++, "pork"),
      getCard(id++, "vinegar"),
    ];
    expect(scoringService.ice(cards)).toBe(0);
  });
  it("return -5 if ice is last", () => {
    let id = 0;
    let cards = [
      getCard(id++, "beef"),
      getCard(id++, "pork"),
      getCard(id++, "vinegar"),
      getCard(id++, "ice"),
    ];
    expect(scoringService.ice(cards)).toBe(-5);
  });
  it("return -5 if ice is last but has other ice in hand", () => {
    let id = 0;
    let cards = [
      getCard(id++, "ice"),
      getCard(id++, "beef"),
      getCard(id++, "pork"),
      getCard(id++, "ice"),
      getCard(id++, "vinegar"),
      getCard(id++, "ice"),
    ];
    expect(scoringService.ice(cards)).toBe(-5);
  });
});
