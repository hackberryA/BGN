

// 追加ボタン
document.getElementById("addButton").addEventListener("click", () => {
  ws.send(JSON.stringify({ type: "addObject" }));
});

// three.js 基本設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("mcanvas") });
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



// helper: small markers at intersections (optional subtle)
const markerMat = new THREE.MeshBasicMaterial({color:0x444444});
const markerGeo = new THREE.CircleGeometry(0.03, 8);
for(let i=-2;i<=2;i++){
  for(let j=-2;j<=2;j++){
    const m = new THREE.Mesh(markerGeo, markerMat);
    m.rotation.x = -Math.PI/2;
    m.position.set(i, 0.001, j);
    scene.add(m);
  }
}
// 柱
function createPillarMaterial(){
  return new THREE.MeshStandardMaterial({color:0xf2eae2, metalness:0.15, roughness:0.7});
}

function makePillar(){
  const g = new THREE.Group();
  const mat = createPillarMaterial();

  // base (stylized plinth)
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.9), mat);
  base.position.y = 0.06;
  g.add(base);

  // torus foot to resemble rounded base
  const foot = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 8, 32), mat);
  foot.rotation.x = Math.PI/2;
  foot.position.y = 0.12 + 0.02;
  g.add(foot);

  // shaft (cylinder). We'll slightly taper it to feel classical.
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.8, 32, 1), mat);
  shaft.position.y = 0.12 + 0.9;
  g.add(shaft);

  // simple fluting effect: many very thin vertical boxes around shaft
  const flutingCount = 24;
  const fluteGroup = new THREE.Group();
  const fluteMat = new THREE.MeshStandardMaterial({color:0xe8e0d7, metalness:0.05, roughness:0.9});
  for(let i=0;i<flutingCount;i++){
    const angle = (i / flutingCount) * Math.PI * 2;
    const x = Math.cos(angle) * 0.26;
    const z = Math.sin(angle) * 0.26;
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.75, 0.04), fluteMat);
    b.position.set(x, 0.12 + 0.9, z);
    b.lookAt(0, b.position.y, 0);
    fluteGroup.add(b);
  }
  fluteGroup.children.forEach(c=>c.material.transparent = true); // subtle
  g.add(fluteGroup);

  // capital (simple stacked discs)
  const capital1 = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.12, 32), mat);
  capital1.position.y = 0.12 + 1.8;
  g.add(capital1);
  const capital2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.06, 32), mat);
  capital2.position.y = 0.12 + 1.86 + 0.02;
  g.add(capital2);

  // abacus/entablature slab on top
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.85), mat);
  slab.position.y = 0.12 + 1.98 + 0.06;
  g.add(slab);

  // adjust group origin to sit on ground
  g.position.y = 0;
  return g;
}

// プレビュー柱
const preview = makePillar();
preview.traverse(n=>{ if(n.isMesh){ n.material = n.material.clone(); n.material.transparent = true; n.material.opacity = 0.45; } });
preview.visible = false;
scene.add(preview);

// 設置済み柱
const placed = new Map(); // key 'x_z' -> group

// raycaster for pointer
const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// pointer plane to intersect (y=0)
const planeNormal = new THREE.Vector3(0,1,0);
const plane = new THREE.Plane(planeNormal, 0);
const intersectPoint = new THREE.Vector3();

function getNearestGridPoint(point){
  // grid coordinates are integers -2..2 in x and z
  const gx = Math.round(point.x);
  const gz = Math.round(point.z);
  if(gx < -2 || gx > 2 || gz < -2 || gz > 2) return null;
  // distance threshold
  const dx = gx - point.x;
  const dz = gz - point.z;
  const dist = Math.sqrt(dx*dx + dz*dz);
  if(dist > 0.45) return null; // threshold: change to taste
  return {x:gx, z:gz};
}

function updatePreviewFromPointer(event){
  // compute mouse normalized coords
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  ray.setFromCamera(mouse, camera);
  ray.ray.intersectPlane(plane, intersectPoint);
  if(!intersectPoint) { preview.visible = false; return; }
  const gp = getNearestGridPoint(intersectPoint);
  if(!gp){ preview.visible = false; return; }
  const key = `${gp.x}_${gp.z}`;
  if(placed.has(key)){ preview.visible = false; return; }
  preview.position.set(gp.x, 0, gp.z);
  preview.visible = true;
}

function placeAtCurrentPreview(){
  if(!preview.visible) return;
  const placedPillar = makePillar();
  placedPillar.position.copy(preview.position);
  // use solid material
  placedPillar.traverse(n=>{ if(n.isMesh){ n.material = n.material.clone(); n.material.transparent = false; n.material.opacity = 1; } });
  scene.add(placedPillar);
  const key = `${preview.position.x}_${preview.position.z}`;
  placed.set(key, placedPillar);
  // hide preview until next move
  preview.visible = false;
}

// events
renderer.domElement.addEventListener('pointermove', updatePreviewFromPointer);
renderer.domElement.addEventListener('pointerdown', (e)=>{
  // left click only
  if(e.button !== 0) return;
  placeAtCurrentPreview();
});

// reset button
document.getElementById('reset').addEventListener('click', ()=>{
  placed.forEach(g=>scene.remove(g));
  placed.clear();
});

// resize
function onWindowResize(){
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  camera.aspect = w / h || window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
}
window.addEventListener('resize', onWindowResize);



// --------------------------------------------------
// オブジェクト描画
// --------------------------------------------------
// 盤面
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(9,9),
  new THREE.MeshStandardMaterial({color:0xffffff, metalness:0, roughness:1})
);
ground.rotation.x = -Math.PI/2;
ground.position.y = -0.001;
three.scene.add(ground);

// グリッド
const BOARD_SIZE = 7;
const grid = new THREE.GridHelper(BOARD_SIZE, BOARD_SIZE, 0x444444, 0xcccccc);
grid.rotation.x = 0;
three.scene.add(grid);

// simple animation
function animate(){
  requestAnimationFrame(animate);
  three.renderer.render(three.scene, three.camera);
}
animate();
