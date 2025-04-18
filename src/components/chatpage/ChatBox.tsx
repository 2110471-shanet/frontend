"use client"

import { CircularProgress } from "@mui/material";
import Messages from "./Messages";
import TextInput from "./TextInput";

import { useChatSelectionState } from "@/app/chat/pageContext";

import { useRef, useState, useEffect } from "react";

import { ToastContainer, Flip } from "react-toastify";

export default function ChatBox() {

    const { chatSelectionState, setChatSelectionState } = useChatSelectionState();

    const containerRef = useRef<HTMLDivElement>(null);
    const [containerElement, setContainerElement] = useState<HTMLElement | null>(null);
  
    useEffect(() => {
      if (containerRef.current) {
        setContainerElement(containerRef.current);
      }
    }, []);

    if (chatSelectionState === "ready") {
        return (
            <div className="h-full flex-1 flex flex-col relative" ref={containerRef}>
                {
                    containerElement &&
                    <ToastContainer
                        containerId="special"
                        autoClose={500}
                        position="top-right"
                        className="!absolute !top-4 !right-4 z-50 !rounded-md"
                        transition={Flip}
                        theme="dark"
                        closeOnClick={true}
                        hideProgressBar={true}
                    />
                }
                <Messages />
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
                        autoClose={500}
                        position="top-right"
                        className="!absolute !top-4 !right-4 z-50 !rounded-md !truncate"
                        toastClassName="!max-w-full !truncate rounded-md"
                        transition={Flip}
                        theme="dark"
                        closeOnClick={true}
                        hideProgressBar={true}
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
                        autoClose={500}
                        position="top-right"
                        className="!absolute !top-4 !right-4 z-50 !rounded-md"
                        transition={Flip}
                        theme="dark"
                        closeOnClick={true}
                        hideProgressBar={true}
                    />
                }
                <CircularProgress />
            </div>
        );
    }
}