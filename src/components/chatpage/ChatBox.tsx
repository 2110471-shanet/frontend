"use client"

import { CircularProgress } from "@mui/material";
import Messages from "./Messages";
import TextInput from "./TextInput";

import { useChatSelectionState } from "@/app/chat/pageContext";

import { useRef, useState, useEffect } from "react";

import { ToastContainer, Flip } from "react-toastify";
import { useGroup } from "../provider/GroupProvider";
import { useUser } from "../provider/UserProvider";

export default function ChatBox({
    typingUsers,
}: {
    typingUsers: Array<string>,
}) {

    const { chatSelectionState, setChatSelectionState } = useChatSelectionState();

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);

    const { currentUsername } = useUser();
    const { groupName } = useGroup();
    const { isSelectedDirectChat } = useChatSelectionState();
  
    useEffect(() => {
      if (containerRef.current) {
        setContainerElement(containerRef.current);
      }
    }, []);

    if (chatSelectionState === "ready") {
        return (
            <div className="h-full flex-1 flex flex-col relative w-full" ref={containerRef}>
                {
                    containerElement &&
                    <ToastContainer
                        containerId="special"
                        autoClose={1000}
                        position="top-right"
                        className="!absolute !top-4 !right-4 z-50 !rounded-md !truncate"
                        toastClassName="!max-w-full !truncate rounded-md"
                        transition={Flip}
                        theme="light"
                        closeOnClick={true}
                    />
                }
                <div className="max-w-full truncate flex justify-center">
                    <span className="max-w-full truncate py-2 border-b-1 border-slate-200 text-xl px-4">
                        {
                            (isSelectedDirectChat)?
                            "User: " + currentUsername:
                            "Group: " + groupName
                        }
                    </span>
                </div>
                <Messages typers={typingUsers} />
                <TextInput />
            </div>
        );
    } else if (chatSelectionState === "empty") {
        return (
            <div className="w-full h-full flex justify-center items-center bg-slate-50 relative" ref={containerRef}>
                {
                    containerElement &&
                    <ToastContainer
                        containerId="special"
                        autoClose={1000}
                        position="top-right"
                        className="!absolute !top-4 !right-4 z-50 !rounded-md !truncate"
                        toastClassName="!max-w-full !truncate rounded-md"
                        transition={Flip}
                        theme="light"
                        closeOnClick={true}
                    />
                }
                <span className="text-xl">Select a chat to start the convo!</span>
            </div>
        );
    } else {
        return (
            <div className="w-full h-full flex justify-center items-center bg-slate-50 relative" ref={containerRef}>
                {
                    containerElement &&
                    <ToastContainer
                        containerId="special"
                        autoClose={1000}
                        position="top-right"
                        className="!absolute !top-4 !right-4 z-50 !rounded-md !truncate"
                        toastClassName="!max-w-full !truncate rounded-md"
                        transition={Flip}
                        theme="light"
                        closeOnClick={true}
                    />
                }
                <CircularProgress />
            </div>
        );
    }
}