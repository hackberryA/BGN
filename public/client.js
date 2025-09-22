import * as THREE from 'three';

const ws = new WebSocket(`wss://${location.host}`);
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "update") {
    updateScene(data.state);
  }
};

// 追加ボタン
document.getElementById("addButton").addEventListener("click", () => {
  ws.send(JSON.stringify({ type: "addObject" }));
});

// three.js 基本設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setSize(window.innerWidth /2, window.innerHeight /2);
camera.position.z = 5;

const objects = {}; // idごとに管理

function updateScene(state) {
  Object.entries(state.objects).forEach(([id, obj]) => {
    if (!objects[id]) {
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: obj.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(obj.x, obj.y, obj.z);
      objects[id] = mesh;
      scene.add(mesh);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
