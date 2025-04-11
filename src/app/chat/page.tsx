"use client"

import ChatBox from "@/components/chatpage/ChatBox";
import ChatSelect from "@/components/chatpage/ChatSelect";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react"

export default function Chat() {

    const [isChatSelectionShown, setIsChatSelectionShown] = useState(false);

    return (
        <div className="h-screen flex flex-col flex-nowrap w-full relative">
            <NavBar setIsChatSelectionShown={setIsChatSelectionShown} />
            <main className="overflow-auto w-full flex flex-nowrap overflow-hidden bg-blue-300 flex-1 min-h-[600px]">
                <ChatSelect />
                <ChatBox />
            </main>
            <div className={`absolute w-full h-screen top-0 left-0 bg-black z-20 ${(isChatSelectionShown) ? "opacity-20": "opacity-0 select-none"}`}>

            </div>
        </div>
    );
}