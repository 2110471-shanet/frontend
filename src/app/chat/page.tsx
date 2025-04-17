"use client"

import ChatBox from "@/components/chatpage/ChatBox";
import ChatSelect from "@/components/chatpage/ChatSelect";
import NavBar from "@/components/NavBar";
import { useState, useEffect, createContext, useMemo, useContext, useRef } from "react";
import { ChatSelectionStateContext, MessagesContext } from "./pageContext";

import type { MessageType } from "@/types";
import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";
import { getSocket } from "@/lib/socket";

export default function Chat() {

    const [isChatSelectionShown, setIsChatSelectionShown] = useState(false);

    // empty, loading, ready
    const [chatSelectionState, setChatSelectionState] = useState("empty");

    const chatSelectionStateContextValue = useMemo(() => ({chatSelectionState, setChatSelectionState}), [chatSelectionState]);

    // [{sender, message}]
    const [messages, setMessages] = useState<Array<MessageType>>([]);

    // const { username, setUsername } = useUser();
    const { isLoading, setIsLoading } = useGlobalLoading() ;

    const isFirstLoadSucceed = useRef(false) ;

    const messagesContextValue = useMemo(() => ({messages, setMessages}), [messages]);

    const socket = getSocket() ;

    useEffect(() => {
        if (!isLoading) {
            if (isFirstLoadSucceed.current) {
                socket.connect() ;
            }

            isFirstLoadSucceed.current = true ;
        }

        return () => {
            if (socket.connected)
                socket.disconnect() ;
        }
    }, [isLoading, isFirstLoadSucceed]);

    return (
        <div className="h-screen flex flex-col flex-nowrap w-full relative">
            <NavBar setIsChatSelectionShown={setIsChatSelectionShown} isChatSelectionShown={isChatSelectionShown} />
            <main className="w-full flex flex-nowrap relative overflow-hidden flex-1 min-h-[300px]">
                <MessagesContext value={messagesContextValue}>
                    <ChatSelectionStateContext value={chatSelectionStateContextValue}>
                        <ChatSelect isChatSelectionShown={isChatSelectionShown} />
                        <ChatBox />
                    </ChatSelectionStateContext>
                </MessagesContext>
            </main>
            <div className={`absolute w-full h-full min-h-screen top-0 left-0 bg-black duration-150 lg:duration-0 z-20 lg:hidden ${(isChatSelectionShown) ? "opacity-10": "opacity-0 select-none hidden"}`} onClick={(e) => {
                setIsChatSelectionShown(false);
            }}>
                
            </div>
        </div>
    );
}