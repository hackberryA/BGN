import { GameState } from "./GameState";
import { Player } from "./Player";
import { logger } from "../utils/logger";

export class GameManager {
  private state = new GameState();

  addPlayer(id: string, name: string) {
    const player = new Player(id, name);
    this.state.addPlayer(player);
    logger.info(`Player joined: ${name}`);
  }

  nextTurn() {
    this.state.nextTurn();
    logger.info(`Next turn: ${this.state.currentPlayer.name}`);
  }
}
