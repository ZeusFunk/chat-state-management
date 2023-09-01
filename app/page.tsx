"use client";
import { useAllDialog } from "@/store";

import { useState, useEffect } from "react";

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default function Home() {
  const dialogs = useStore(useAllDialog, (state) => state.allDialog);
  const curID = useStore(useAllDialog, (state) => state.currentDialogId);
  const create = useAllDialog((state) => state.createNewDialog);
  const addMessage = useAllDialog((state) => state.addMessage);

  console.log(JSON.stringify(dialogs));

  const addBot = () => {
    addMessage("assistant", "你好我是Bot");
  };

  const addHunman = () => {
    addMessage("user", "你好我是人类");
  };
  // create();
  useEffect(() => create(), []);

  return (
    <main className=" flex flex-col justify-center items-center h-screen my-auto">
      <div className=" flex flex-col justify-start items-start">
        {dialogs
          ?.filter((e) => {
            return e.id == curID;
          })[0]
          .messages.map((i) => {
            if (i.role == "system") {
              return;
            }
            if (i.role == "assistant") {
              return <div>AI: {i.content}</div>;
            } else {
              return <div>Human: {i.content}</div>;
            }
          })}
      </div>
      <div className=" flex flex-row gap-2 mt-5">
        <button
          onClick={create}
          className="border-2 transition-all duration-200 bg-slate-200 px-4 py-1 rounded-md hover:bg-violet-300"
        >
          create
        </button>
        <button
          onClick={addBot}
          className="border-2 transition-all duration-200 bg-slate-200 px-4 py-1 rounded-md hover:bg-violet-300"
        >
          addBot
        </button>
        <button
          onClick={addHunman}
          className="border-2 transition-all duration-200 bg-slate-200 px-4 py-1 rounded-md hover:bg-violet-300"
        >
          addHunman
        </button>
      </div>
    </main>
  );
}
