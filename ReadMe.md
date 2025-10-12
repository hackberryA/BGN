```
git add .
git commit -m "commit"
git push
```


## ステップ①：プロジェクト初期化
```bash
npm init -y
```

## ステップ②：必要パッケージのインストール

```bash
npm install --save-dev typescript webpack webpack-cli webpack-dev-server ts-loader
npm install --save-dev ws
npm install --save-dev react react-dom
npm install --save-dev @types/react @types/react-dom
npm install --save-dev react-router-dom
npm install --save-dev @pmmmwh/react-refresh-webpack-plugin react-refresh
npm install --save-dev @types/node
npm install --save-dev style-loader css-loader
npm install --save-dev materialize-css
npm install --save-dev three @react-three/fiber @react-three/drei
npm install --save-dev js-yaml-loader
```

## ステップ③：TypeScript 設定 (tsconfig.json)

オプション 'moduleResolution=node10' は非推奨であり、TypeScript 7.0 で機能しなくなります。compilerOption '"ignoreDeprecations": "6.0"' を指定して、このエラーを無音にします。
  Visit https://aka.ms/ts6 for migration information.ts

## ステップ④：Webpack 設定 (webpack.config.js)


## ステップ⑤：ディレクトリ構成

```
boardgame/
├─ package.json
├─ tsconfig.json
├─ webpack.config.js
├─ public/
│  └─ index.html
└─ src/
   ├─ client/
   └─ server/
```

```
src/
├─ client/
│  ├─ components/        ← 共通の小コンポーネント
│  ├─ ui/                ← GameHUD, ChatBox, TurnIndicatorなど
│  ├─ game/              ← WebSocket制御やゲームロジック（GameClient.tsなど）
│  ├─ threejs/           ← SceneManager, Renderer, Canvas構成
│  │   └─ object/        ← 各種3Dオブジェクト（Board, Pieceなど）
│  ├─ App.tsx            ← Reactのルートコンポーネント
│  └─ main.tsx           ← エントリーポイント（ReactDOM.render）
│
└─ server/               ← Node.js + WebSocketサーバー
   ├─ websocket/
   ├─ game/
   ├─ utils/
   └─ config/

```


## ステップ⑥：React + Three.js 初期表示
src/client/index.tsx
src/client/App.tsx

## ステップ⑦：開発サーバー起動
```bash
npx webpack serve
```

## サーバー側 Typescript 設定
```bash
npm install --save-dev @types/node
```


## 起動方法
### WebSocket Server
```bash
npx ts-node src/server/server.ts
```
ts-node install -> y

### Webpack
```
npx webpack serve
```
> http://localhost:3000
