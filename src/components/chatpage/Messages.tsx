import { useMessages } from "@/app/chat/pageContext";
import Message from "./Message";
import { useUser } from "../provider/UserProvider";
import { useEffect, useRef } from "react";

export default function Messages({
    typers
}: {
    typers: Array<string>
}) {
    const { messages, setMessages } = useMessages() ;
    const { userId, setUserId } = useUser() ;

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, typers]);

    const messageNodes = (
        messages.map((message, ind) => {
            return (
                <Message key={ind} isMe={message.sender._id === userId} sender={message.sender.username} message={message.message} />
            );
        })
    );

    return (
        <div 
            ref={containerRef}
            className="flex-1 bg-white bg-cover overflow-auto flex flex-col flex-nowrap gap-4 px-4 py-4 [scrollbar-width:thin]"
        >
            {messageNodes}
            <div className={`w-full px-2 flex ${(typers.length > 0)? "": "hidden"}`}>
                <span className="px-4 py-2 rounded-lg bg-slate-200 text-sm shrink-0 max-w-4/5 truncate">
                    {
                        (typers.length > 1) ?
                        "Many people are typing . . .":
                        typers[0] + " is typing . . ."
                    }
                </span>
            </div>
        </div>
    );
}