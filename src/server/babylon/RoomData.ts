// server/playerStore.ts (server side)
import { createStore } from "zustand/vanilla";

type Player = { name: string };
type Store = {
  players: Map<string, Player>;
  add: (id: string, player: Player) => void;
  remove: (id: string) => void;
  update: (id: string, data: Partial<Player>) => void;
};

export const playerStore = createStore<Store>((set) => ({
  players: new Map(),
  add: (id, player) =>
    set((state) => {
      const newMap = new Map(state.players);
      newMap.set(id, player);
      return { players: newMap };
    }),
  remove: (id) =>
    set((state) => {
      const newMap = new Map(state.players);
      newMap.delete(id);
      return { players: newMap };
    }),
  update: (id, data) =>
    set((state) => {
      const newMap = new Map(state.players);
      const old = newMap.get(id);
      if (old) newMap.set(id, { ...old, ...data });
      return { players: newMap };
    }),
}));
