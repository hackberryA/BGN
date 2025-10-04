import Component from "./Component.js"
import STATUS from "../const/status.js";
import TYPE from "../const/componentType.js";
import dom from "../utils/dom.js"

const canvasWidth = window.innerWidth / 2;

/**
 * 盤面クラス（プレイヤー単位）
 */
export default class Board {
    /**
     * コンストラクタ
     * @param {string}   playerId     プレイヤーID
     * @param {string}   playerName   プレイヤー名
     * @param {number}   flower       花
     * @param {Object3D} startingTile スターティングタイル
     */
    constructor({playerId, playerName, flower}) {
        // スターティングタイル
        // startingTile = clone()

        // --------------------------------------------------
        // Three.js 基本設定
        // --------------------------------------------------
        // canvas
        this.canvas = document.querySelector(`#canvas-${playerId}`);

        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        this.scene.add(new THREE.AmbientLight(0xffffff, .4)); // 環境光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // 太陽光
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    
        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(canvasWidth, canvasWidth);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.domElement.addEventListener("mousedown", (e) => { if (e.button === 1) {e.preventDefault();} }); // 中クリック無効

        // camera
        this.camera = new THREE. PerspectiveCamera (45, 1, 0.1, 10000); // (視野角, aspect ratio, near, far)
        this.camera.position.set(300, 300, 300);
        this.camera.lookAt(scene.position);
        this.camera.layers.disable(LAYER.HIDDEN);
        this.camera.layers.enable(LAYER.DEFAULT);
        this.camera.layers.enable(LAYER.PREVIEW);
        this.camera.layers.enable(LAYER.CONFIRMED);
        this.initialPosition = this.camera.position.clone();
        // OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.initialTarget = this.controls.target.clone();
        // マウス操作設定 (left: 無効, midd)
        this.controls.mouseButtons = { LEFT: null, MIDDLE: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE };

        // raycaster
        this.raycaster = new THREE.Raycaster();
        this.raycaster.layers.set(LAYER.PREVIEW)
        
        // mouse
        const mouse = new THREE.Vector2(); // マウス五座標管理用ベクトル
                
        // リサイズ対応
        window.addEventListener("resize", () => this.renderer.setSize(canvasWidth, canvasWidth));

        // --------------------------------------------------
        // プレイヤー情報
        // --------------------------------------------------
        /** プレイヤーID  @type {string} */  this.playerId = playerId;
        /** プレイヤー名  @type {string} */  this.playerName = playerName;
        /** 花           @type {string} */  this.flower = flower;
        /** 1柱ストック数 @type {string} */  this.singlePillarNumber = 0;
        /** 2柱ストック数 @type {string} */  this.doublePillarNumber = 0;

        // --------------------------------------------------
        // three.js オブジェクト配置情報
        // --------------------------------------------------
        /** 柱ストック     @type {Object3D[]} */  this.stockPillars = [];
        /** タイルストック @type {Object3D[]} */  this.stockTiles = [startingTile];
        
        // プレビュー Map
        /** 柱            @type {Map<string, Component>} */  this.previewPillarMap = new Map();
        /** コンポーネント @type {Map<string, Component>} */  this.previewComponentMap = new Map();
        /** テラスタイル   @type {Map<string, Component>} */  this.previewTerraceTileMap = new Map();

        /** プレビュー対象 @type {string}                 */  this.previewTarget = TYPE.SINGLE_PILLAR;
        /** プレビュー中   @type {Component}              */  this.previewComponent = null;
        /** 選択中リスト   @type {Map<string, Component>} */  this.selectedComponentMap = new Map();

        // 確定済 Map
        /** コンポーネント @type {Map<string, Component>} */  this.confirmedComponentMap = new Map();
        /** テラスタイル   @type {Map<string, Component>} */  this.confirmedTerraceTileMap = new Map();
    }
    
    /** プレビュー対象切替 1柱<->2柱 */
    togglePreviewTarget = () => { this.previewTarget = (this.previewTarget == TYPE.SINGLE_PILLAR) ? TYPE.DOUBLE_PILLAR : this.previewTarget = TYPE.SINGLE_PILLAR; }

    // --------------------------------------------------
    // 柱の状態遷移
    // --------------------------------------------------
    /**［柱］全プレビュー */
    setPreviewPillars = () => {
        this.previewPillarMap.forEach((component) => component.setPreview());
    }
    /**［柱］ホバー */
    setHoverPillar = (x, y, z) => {
        const targetComponent = this.previewPillarMap.get(`${x},${y},${z}`); // 対象
        if (targetComponent.status === STATUS.SELECTED) {
            this.resetHoverPillar(); // 選択中の場合はプレビュー解除
        } else {
            targetComponent.setHover();
            this.previewComponent = targetComponent;
        }
    }
    /** ［柱］ホバー解除 */
    resetHoverPillar = () => {
        if (!this.previewComponent) return;
        this.previewComponent.setPreview();
        this.previewComponent = null;
    }
    /**［柱］選択 */
    setSelectedPillar = (x, y, z) => {
        const targetComponent = this.previewPillarMap.get(`${x},${y},${z}`); // 対象
        if (targetComponent.status === STATUS.SELECTED) {
            // 既に選択中の場合は解除
            this.selectedComponentMap.delete(`${x},${y},${z}`);
            // ホバーに変更
            this.setHoverPillar(x, y, z);
            return
        }
        // 上限の場合は無効
        if (this.selectedComponentMap.size >= this.stockPillars.length) return;

        this.resetHoverPillar(); // ホバー解除
        targetComponent.setSelected();
        this.selectedComponentMap.set(`${x},${y},${z}`, targetComponent);
    }
    /** ［柱］選択解除 */
    resetSelectedPillar = (x, y, z) => {
        this.resetHoverPillar();
        this.previewPillarMap.get(`${x},${y},${z}`).setSelected();
    }

    // --------------------------------------------------
    // Three.js
    // --------------------------------------------------
    /** mesh 追加 */
    append = (mesh) => { this.scene.add(mesh); }
    /** 描画 */
    render = () => { this.renderer.render(this.scene, this.camera); }
    /** 描画 */
    animate = () => { requestAnimationFrame(this.animate); this.render(); }
    /** 現在カーソルが示すオブジェクトを取得 */
    getRaycasterIntersectObjects = () => {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length == 0) return undefined;
        const obj = intersects[0].object; // ヒットした Mesh
        return (obj.parent && obj.parent.type === "Group") ? obj.parent: obj;
    }
    /** イベントリスナー追加 */
    addEventListener = (id, handler) => this.canvas.addEventListener(id, handler);
    /** マウス設定 */
    setMouse = (e, id) => {
        // canvas要素の座標・幅・高さ
        const rect = e.currentTarget.getBoundingClientRect();
        // [-1, 1]の範囲で現在のマウス座標を登録する
        this.mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
        this.mouse.y = -(e.clientY - rect.top) / rect.height * 2 + 1;
    
        if (id) { dom.setInnerText(id, `(${this.mouse.x.toFixed(3)}, ${this.mouse.y.toFixed(3)})`); }
    }
    
}