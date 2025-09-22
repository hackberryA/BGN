let gameState = {
  players: {}
};

let objCounter = 0;

function handleMessage(ws, msg, playerId, wss) {
  const data = JSON.parse(msg);

  if (data.type === "addObject") {
    const id = "obj" + (++objCounter);
    gameState.players[id] = {
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2,
      z: 0,
      color: 0xffffff * Math.random()
    };
    broadcast({ type: "update", state: gameState }, wss);
  }
}

function broadcast(msg, wss) {
  const str = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(str);
    }
  });
}

module.exports = { gameState, handleMessage };
