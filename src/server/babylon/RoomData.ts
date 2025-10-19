// import { createStore } from "zustand/vanilla";

// const defaultRoomData: RoomData = {
//   userLength: 0, userInfo: {}, playerLength: 0, playerInfo: {},
//   logs: [], status: "waiting", phase: "waiting", round: 0,
// }
// type RoomDataMap = {[roomId: string]: RoomData}
// /** ルームデータストア */
// type RoomDataStore = {
//   data: RoomDataMap;
//   // 部屋の取得・追加・削除
//   get: (roomId: string) => RoomData | undefined;
//   add: (roomId: string) => void;
//   remove: (roomId: string) => void;
//   // 部屋データ更新
//   update: (roomId: string, partial: Partial<RoomData>) => void;
// }

// export const roomDataStore = createStore<RoomDataStore>((set, get) => ({
//   data: {},
//   get: (roomId) => get().data[roomId],
//   add: (roomId) =>
//     set((state) => {
//       if (state.data[roomId]) return {};
//       return { data: {...state.data, [roomId]: {...defaultRoomData}}};
//     }),
//   remove: (roomId) =>
//     set((state) => {
//       if (!state.data[roomId]) return {};
//       delete state.data[roomId];
//       return { data: state.data };
//     }),
//   update: (roomId, partial) =>
//     set((state) => {
//       return {
//         data: {
//           ...state.data,
//           [roomId]: {
//             ...(state.data[roomId] || {}),
//             ...partial
//           }
//         }
//       };
//     }),
// }));
