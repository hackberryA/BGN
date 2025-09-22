const ws = new WebSocket(`wss://${location.host}`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "update") {
    updateScene(data.state);
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") ws.send(JSON.stringify({ type: "move", dx: 0, dy: -1 }));
  if (e.key === "ArrowDown") ws.send(JSON.stringify({ type: "move", dx: 0, dy: 1 }));
});

// three.js 簡易描画
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const players = {};

function updateScene(state) {
  // state.players を three.js のオブジェクトに反映
  Object.keys(state.players).forEach((id) => {
    if (!players[id]) {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      players[id] = new THREE.Mesh(geometry, material);
      scene.add(players[id]);
    }
    players[id].position.x = state.players[id].x;
    players[id].position.y = state.players[id].y;
  });
}

function tick() {
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
}
tick();
