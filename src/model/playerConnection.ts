export class PlayerConnection {
  socketId: string;
  insecureToken: string;
  connected: boolean;
  constructor(socketId: string, insecureToken: string) {
    this.socketId = socketId;
    this.insecureToken = insecureToken;
    this.connected = true;
  }
}
