import { Card } from "../model/card";
import { Game } from "../model/game";
import { NumberOfPlayers, Player } from "../model/player";
import { PlayerConnection } from "../model/playerConnection";
import { Table } from "../model/table";
import { DeckService } from "./deckService";
import { ScoringService } from "./scoringService";

export class GameService {
  gameState: Game = new Game();
  deckService: DeckService = new DeckService();
  scoringService: ScoringService = new ScoringService();
  socketIds: string[] = [];
  playerConnections: PlayerConnection[] = [];

  public get numberOfPlayers(): number {
    return this.gameState.players.length;
  }

  public get readyPlayers(): Player[] {
    return this.gameState.players.filter((p) => p.playerReady);
  }

  public get numberOfReadyPlayers(): number {
    return this.readyPlayers.length;
  }

  public get playingPlayers(): Player[] {
    return this.gameState.players.filter((p) => p.isPlaying);
  }

  public get currentTable(): Table {
    return new Table(this.gameState);
  }

  playerInGame(socketId: string, insecureToken: string): number {
    // const socketInUse = this.gameState.players.find(
    //   (p) => p.playerConnection.socketId === socketId
    // );

    // // I can't imagine this happening.
    // if (socketInUse) {
    //   console.error("socketInUse");
    //   return;
    // }

    const playerIndex = this.gameState.players.findIndex(
      (p) => p.playerConnection.insecureToken === insecureToken
    );

    return playerIndex;
  }

  updatePlayer(playerIndex: number, playerConnection: PlayerConnection): void {
    this.gameState.players[playerIndex].playerConnection = playerConnection;
  }

  addPlayer(playerConnection: PlayerConnection) {
    this.gameState.players.push(
      new Player(this.numberOfPlayers, playerConnection)
    );
  }

  playerBySocketId(socketId: string): Player {
    return this.gameState.players.find(
      (p) => p.playerConnection.socketId === socketId
    );
  }

  init() {
    this.gameState.deck = this.deckService.createDeck();
    this.gameState.round = 0;
    this.readyPlayers.forEach((p) => (p.isPlaying = true));
  }

  nextRound() {
    if (this.gameState.round === 3) {
      this.scoringService.scorePuddins(this.playingPlayers);
      this.scoringService.scoreDumplings(this.playingPlayers);
      console.log("end");
      this.gameState.gameEnded = true;
      return;
    }
    this.gameState.deck = this.deckService.shuffleArray(this.gameState.deck);
    this.gameState.round++;
    this.gameState.roundTurn = 1;
    this.gameState.discardPile = this.gameState.discardPile.concat(
      this.playingPlayers.flatMap((p) => p.playSpace)
    );
    let hands = this.deckService.dealCards(
      this.gameState.deck,
      this.playingPlayers.length as NumberOfPlayers
    );
    this.playingPlayers.forEach((p, i) => {
      p.hand = hands[i];
      p.playSpace = [];
    });
  }

  nextTurn() {
    const heldHand = [...this.playingPlayers[0].hand].filter((c) => !c.offered);
    this.playingPlayers.forEach((p, i, a) => {
      const offeredCard = p.hand.find((c) => c.offered);
      p.playSpace.push(offeredCard);
      // p.offeredCard = undefined;
      p.playedThisTurn = false;
      p.hand =
        p.id < a.length - 1
          ? [...a[i + 1].hand].filter((c) => !c.offered)
          : heldHand;
    });
    if (this.playingPlayers[0].hand.length === 0) {
      console.log(JSON.stringify(this.playingPlayers));
      this.storePuddin();
      this.storeDumpling();
      this.score();
      this.nextRound();
    }
  }

  // scoreList(): any[] {

  // }

  offerCard(player: Player, cardId: number) {
    const card = player.hand.find((c) => c.id === cardId);
    if (!card) {
      console.log("bad");
      return;
    }

    player.hand = player.hand.map((card: Card) => {
      return { ...card, offered: card.id !== cardId ? false : true };
    });
    player.playedThisTurn = true;
  }

  score() {
    this.scoringService.score(this.playingPlayers);
  }

  playerReady(socketId: string, name: string) {
    const player = this.playerBySocketId(socketId);
    player.playerReady = true;
    player.name = name ? name : `Player ${player.id}`;
  }

  storePuddin() {
    this.playingPlayers.forEach((p) => {
      p.puddins += p.playSpace.filter((c) => c.type === "puddin").length;
    });
  }

  storeDumpling() {
    this.playingPlayers.forEach((p) => {
      p.pork += p.playSpace.filter((c) => c.type === "pork").length;
      p.prawn += p.playSpace.filter((c) => c.type === "prawn").length;
      p.beef += p.playSpace.filter((c) => c.type === "beef").length;
    });
  }
}
