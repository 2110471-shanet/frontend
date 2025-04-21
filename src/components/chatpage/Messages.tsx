import { useChatSelectionState, useMessages } from "@/app/chat/pageContext";
import Message from "./Message";
import { useUser } from "../provider/UserProvider";
import { useEffect, useRef } from "react";
import { TypingStatusType } from "@/types";

export default function Messages({
    typingStatus,
}: {
    typingStatus: TypingStatusType
}) {
    const { messages, setMessages } = useMessages() ;
    const { userId, setUserId } = useUser() ;
    const { selectedChat } = useChatSelectionState();

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, typingStatus]);

    function checkIsTypingInChat(chatId: string, typerId: string) {
        const isReceiver    = chatId === userId;
        const isOpenDirect  = selectedChat === typerId;
        const isCurrentChat = selectedChat === chatId;
        
        return (isReceiver && isOpenDirect) || isCurrentChat;
    }

    const typers: Array<string> = Object.entries(typingStatus)
        .filter(([_, value]) => value ? checkIsTypingInChat(value.chatId, value.typerId) : false)
        .map(([username]) => username);

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