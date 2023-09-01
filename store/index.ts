import { nanoid } from "nanoid";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

type oneDialog = {
  id: string;
  messages: { role: string; content: string }[];
};

type allDialog = {
  allDialog: oneDialog[]; //所有的对话数据
  currentDialogId: string; //当前选择的对话id
  setCurrentDialogId: (e: string) => void; // 选择对话 提供给sidebar
  createNewDialog: () => void; // 创建一个新的对话
  addMessage: (role: string, content: string) => void; // 添加对话
};

const useAllDialog = create<allDialog>()(
  persist(
    (set, get) => ({
      allDialog: [],
      currentDialogId: "",
      setCurrentDialogId: (e) =>
        set((state) => ({ currentDialogId: (state.currentDialogId = e) })),
      createNewDialog: () => {
        set((state) => ({
          // 1.创建一个新的对话
          allDialog: [
            ...state.allDialog,
            {
              id: nanoid(),
              messages: [{ role: "system", content: "you are a bot!" }],
            },
          ],
        }));
        const val = get();
        set(() => ({
          // 2.设置为当前的id
          currentDialogId: val.allDialog[val.allDialog.length - 1].id,
        }));
      },
      addMessage: (role, content) =>
        set((state) => ({
          allDialog: [
            ...state.allDialog.filter((e) => e.id != state.currentDialogId),
            {
              id: state.currentDialogId,
              messages: [
                ...state.allDialog.filter(
                  (e) => e.id == state.currentDialogId
                )[0].messages,
                { role: role, content: content },
              ],
            },
          ],
        })),
    }),
    {
      name: "all-messages", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export { useAllDialog };
