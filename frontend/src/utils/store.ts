import { create } from "zustand";
import { type TodoType } from "./types";
export type ModeType = "ADD" | "EDIT";

interface TodoStoreState {
  mode: ModeType;
  setMode: (newMode: ModeType) => void;
  curTodo: TodoType;
  setCurTodo: (newCurTodo: TodoType) => void;
  pending: boolean;
  setPending: (newPending: boolean) => void;
  inputText: string;
  setInputText: (newInputText: string) => void;
  curId: string;
  setCurId: (newCurId: string) => void;
}

const useStore = create<TodoStoreState>()((set) => ({
  mode: "ADD",
  setMode: (newMode) => set((state) => ({ mode: newMode })),
  curTodo: { id: "", todoText: "" },
  setCurTodo: (newCurTodo) => set((state) => ({ curTodo: newCurTodo })),
  pending: false,
  setPending: (newPending) => set((state) => ({ pending: newPending })),
  inputText: "",
  setInputText: (newInputText) => set((state) => ({ inputText: newInputText })),
  curId: "",
  setCurId: (newCurId) => set((state) => ({ curId: newCurId })),
}));

export default useStore;
