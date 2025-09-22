let gameState = {
  players: {}
};

function handleMessage(ws, msg, playerId, wss) {
  const data = JSON.parse(msg);

  if (data.type === "move") {
    gameState.players[playerId].x += data.dx;
    gameState.players[playerId].y += data.dy;
    broadcast({ type: "update", state: gameState }, wss);
  }
}

function removePlayer(playerId, wss) {
  delete gameState.players[playerId];
  broadcast({ type: "update", state: gameState }, wss);
}

function broadcast(msg, wss) {
  const str = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(str);
    }
  });
}

module.exports = { gameState, handleMessage, removePlayer };
