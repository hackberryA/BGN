export interface ClientMessage {
  type: string;
  playerId?: string;
  log?: string;
}

export interface ServerMessage {
  type: string;
  playerId?: string;
  clientId?: string;
  log?: string;
}
