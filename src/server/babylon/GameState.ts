import { Player } from "./Player";

export class GameState {
  players: Player[] = [];
  currentTurn = 0;

  addPlayer(player: Player) {
    this.players.push(player);
  }

  nextTurn() {
    this.currentTurn = (this.currentTurn + 1) % this.players.length;
  }

  get currentPlayer() {
    return this.players[this.currentTurn];
  }
}
