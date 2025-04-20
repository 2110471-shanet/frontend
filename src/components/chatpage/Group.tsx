import { useChatSelectionState } from '@/app/chat/pageContext';
import { GroupType } from '@/types';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import InfoOutlineRoundedIcon from '@mui/icons-material/InfoOutlineRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useGroup } from '../provider/GroupProvider';
import { getSocket } from '@/lib/socket';

export default function Group({
    group,
    isJoined,
    numUnread,
    onClickHandler,
}: {
    group: GroupType,
    isJoined: boolean,
    numUnread: number,
    onClickHandler: Function
}) {
    const { 
        chatSelectionState, setChatSelectionState,
        selectedChat, setSelectedChat,
        isSelectedDirectChat, setIsSelectedDirectChat,
    } = useChatSelectionState();

    const { isShowingMember, setIsShowingMember } = useGroup();

    const socket = getSocket() ;

    async function handleJoinGroup(e: SyntheticEvent<HTMLDivElement>) {
        socket.emit('join-chatroom', group._id.toString()) ;
    }

    async function handleChatSelection(e: SyntheticEvent<HTMLDivElement>) {
        if (!isJoined) {
            setIsShowingMember(!isShowingMember) ;
        } else if (chatSelectionState !== "loading" && selectedChat !== group._id) {
            setChatSelectionState("loading");
            setIsSelectedDirectChat(false);
            setSelectedChat(group._id.toString()) ;
        }
    }
    
    return (
        <div className="w-full bg-white rounded-md outline outline-slate-200 duration-100 hover:outline-slate-400 hover:drop-shadow-sm h-20 shrink-0 flex items-center px-4 gap-2 hover:cursor-pointer" onClick={(e) => {
            handleChatSelection(e);
            onClickHandler(e);
        }}>
            <div className="w-6 h-6 relative flex justify-center items-center bg-[#092A5B] rounded-full hover:cursor-pointer">
                <GroupsRoundedIcon sx={{height: "60%", width: "60%", color: "white",}} />
            </div>
            <span className="flex-1 max-w-full truncate">{group.chatName}</span>
            <div 
                className={`w-6 h-6 relative flex justify-center items-center bg-[#1A4789] rounded-full hover:cursor-pointer ${(isJoined)? "": "hidden"}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onClickHandler(e);
                    setIsShowingMember(!isShowingMember) ;
                }}
            >
                <InfoOutlineRoundedIcon sx={{height: "60%", width: "60%", color: "white",}} />
            </div>
            <div 
                className={`w-6 h-6 relative flex justify-center items-center bg-green-700 rounded-full hover:cursor-pointer ${(isJoined)? "hidden": ""}`}
                onClick={(e) => {
                    e.stopPropagation();
                    handleJoinGroup(e);
                }}
            >
                <LoginRoundedIcon sx={{height: "60%", width: "60%", color: "white", marginRight: "1px",}} />
            </div>
            <div className={`w-10 h-6 bg-red-500 text-white rounded-full ${(isJoined)? "": "hidden"} flex justify-center items-center ${(numUnread < 1) ? "hidden" : ""}`}>
                <span className="text-xs">
                    {
                        (numUnread > 99)?
                        "99+":
                        numUnread
                    }
                </span>
            </div>
        </div>
    );
}