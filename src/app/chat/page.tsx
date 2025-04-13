"use client"

import ChatBox from "@/components/chatpage/ChatBox";
import ChatSelect from "@/components/chatpage/ChatSelect";
import NavBar from "@/components/NavBar";
import { useState, useEffect } from "react";

export default function Chat() {

    const [isChatSelectionShown, setIsChatSelectionShown] = useState(false);

    return (
        <div className="h-screen flex flex-col flex-nowrap w-full relative">
            <NavBar setIsChatSelectionShown={setIsChatSelectionShown} isChatSelectionShown={isChatSelectionShown} />
            <main className="overflow-auto w-full flex flex-nowrap relative overflow-hidden flex-1 min-h-[300px]">
                <ChatSelect isChatSelectionShown={isChatSelectionShown} />
                <ChatBox />
            </main>
            <div className={`absolute w-full h-full min-h-screen top-0 left-0 bg-black duration-150 lg:duration-0 z-20 lg:hidden ${(isChatSelectionShown) ? "opacity-10": "opacity-0 select-none hidden"}`} onClick={(e) => {
                setIsChatSelectionShown(false);
            }}>
                
            </div>
        </div>
    );
}