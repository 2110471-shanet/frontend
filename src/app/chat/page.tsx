"use client"

import ChatBox from "@/components/chatpage/ChatBox";
import ChatSelect from "@/components/chatpage/ChatSelect";
import NavBar from "@/components/NavBar";
import { useState, useEffect, createContext, SetStateAction, useMemo, useContext } from "react";

type ChatSelectionStateContextType = {
    chatSelectionState: string;
    setChatSelectionState: React.Dispatch<SetStateAction<string>>;
}

export function useChatSelectionState() {
    const context = useContext(ChatSelectionStateContext);
    if (!context) {
        throw new Error("useChatSelectionState must be used in /chat.");
    }
    return context;
}

const ChatSelectionStateContext = createContext<ChatSelectionStateContextType | undefined>(undefined);

export default function Chat() {

    const [isChatSelectionShown, setIsChatSelectionShown] = useState(false);

    // empty, loading, ready
    const [chatSelectionState, setChatSelectionState] = useState("empty");

    const chatSelectionStateContextValue = useMemo(() => ({chatSelectionState, setChatSelectionState}), [chatSelectionState])

    return (
        <div className="h-screen flex flex-col flex-nowrap w-full relative">
            <NavBar setIsChatSelectionShown={setIsChatSelectionShown} isChatSelectionShown={isChatSelectionShown} />
            <main className="w-full flex flex-nowrap relative overflow-hidden flex-1 min-h-[300px]">
                <ChatSelectionStateContext value={chatSelectionStateContextValue}>
                    <ChatSelect isChatSelectionShown={isChatSelectionShown} />
                    <ChatBox />
                </ChatSelectionStateContext>
            </main>
            <div className={`absolute w-full h-full min-h-screen top-0 left-0 bg-black duration-150 lg:duration-0 z-20 lg:hidden ${(isChatSelectionShown) ? "opacity-10": "opacity-0 select-none hidden"}`} onClick={(e) => {
                setIsChatSelectionShown(false);
            }}>
                
            </div>
        </div>
    );
}