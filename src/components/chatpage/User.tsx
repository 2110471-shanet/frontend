"use client"

import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

import { useChatSelectionState } from '@/app/chat/pageContext';
import { SyntheticEvent } from 'react';
import { useUser } from '../provider/UserProvider';

// username, isOnline, other set staet function...
export default function User({
    userId,
    username,
    numUnread,
    status,
    onClickHandler
}: {
    userId: string,
    username: string,
    numUnread: number,
    status: string,
    onClickHandler: Function
}) {
    const { currentUsername } = useUser();

    const { 
        chatSelectionState, setChatSelectionState,
        selectedChat, setSelectedChat,
        isSelectedDirectChat, setIsSelectedDirectChat,
    } = useChatSelectionState();

    async function handleChatSelection(e: SyntheticEvent<HTMLDivElement>) {
        if (chatSelectionState !== "loading") {
            // setChatSelectionState("loading");
            setIsSelectedDirectChat(true) ;
            setSelectedChat(userId) ;
            // console.log(currentUsername)
            // setCurrentUsername(username);
            // setChatSelectionState("ready");
        }
    }
    
    return (
        <div className={`w-full bg-white rounded-md outline outline-slate-200 duration-100 hover:outline-slate-400 hover:drop-shadow-sm h-20 shrink-0 flex items-center px-4 gap-2 hover:cursor-pointer ${(status==="online")? "": "opacity-50"}`} onClick={(e) => {
            handleChatSelection(e);
            onClickHandler(e);
        }}>
            <div className="w-6 h-6 relative flex justify-center items-center bg-[#092A5B] rounded-full shrink-0">
                <Person2RoundedIcon sx={{height: "60%", width: "60%", color: "white",}} />
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-full truncate">
                <span className="max-w-full w-full truncate">{username}</span>
                <span className={`text-xs ${(status === "online")? "text-green-600": "text-slate-500"}`}>
                    {(status === "online")?
                    "Online":
                    "Offline"}
                </span>
            </div>
            <div className={`w-8 h-6 rounded-full text-white flex justify-center items-center ${(numUnread === 0)? "hidden": ""} ${(status==="online")? "bg-red-500": "bg-slate-500"}`}>
                <span className="max-w-full truncate text-xs">
                    {(numUnread > 99)?
                        "99+":
                        numUnread
                    }
                </span>
            </div>
        </div>
    );
}