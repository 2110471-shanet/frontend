"use client"

import { CircularProgress } from "@mui/material";
import Messages from "./Messages";
import TextInput from "./TextInput";

import { useChatSelectionState } from "@/app/chat/page";

export default function ChatBox() {

    const { chatSelectionState, setChatSelectionState } = useChatSelectionState();

    if (chatSelectionState === "ready") {
        return (
            <div className="h-full flex-1 flex flex-col">
                <Messages />
                <TextInput />
            </div>
        );
    } else if (chatSelectionState === "empty") {
        return (
            <div className="w-full h-full flex justify-center items-center bg-slate-50">
                <span className="text-xl">Select a chat to start the convo!</span>
            </div>
        );
    } else {
        return (
            <div className="w-full h-full flex justify-center items-center bg-slate-50">
                <CircularProgress />
            </div>
        );
    }
}