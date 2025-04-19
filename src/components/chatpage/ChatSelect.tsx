import { SyntheticEvent, useEffect, useState } from "react";
import ChangeNameMobile from "./ChangeNameMobile"
import CreateGroup from "./CreateGroup";
import Group from "./Group";
import LinkGroup from "./LinkGroup";
import User from "./User";
import { GroupType, UserType, UserWithLastMessageType } from "@/types";
import { useUser } from "../provider/UserProvider";
import { useGroup } from "../provider/GroupProvider";
import { useChatSelectionState } from "@/app/chat/pageContext";

export default function ChatSelect({
    isChatSelectionShown,
    users,
    groups,
}: {
    isChatSelectionShown: boolean,
    users: Array<UserType>,
    groups: Array<GroupType>,
}) {
    const { isSelectedDirectChat, setChatSelectionState } = useChatSelectionState();
    const { userId, username, setCurrentUsername } = useUser() ;
    const { 
        members, setMembers,
        groupName, setGroupName,
    } = useGroup();

    const [activeGroupInd, setActiveGroupInd] = useState<number | null>(null);
    const [activeUserInd, setActiveUserInd] = useState<number | null>(null);

    useEffect(() => {
        if (activeGroupInd !== null && groups[activeGroupInd]) {
            setMembers(groups[activeGroupInd].members);
            setGroupName(groups[activeGroupInd].chatName);
        }
    }, [groups, activeGroupInd]);

    useEffect(() => {
        if (activeUserInd !== null && users[activeUserInd]) {
            // console.log(users[activeUserInd].username)
            setCurrentUsername(users[activeUserInd].username);
        }
    }, [users, activeUserInd]);

    const userNodes = (
        users.sort((a: any, b: any) => {
            const lastMessageA = a.lastMessage;
            const lastMessageB = b.lastMessage;

            // if (lastMessageA)
            //     console.log(lastMessageA);
            
            // if (lastMessageB)
            //     console.log(lastMessageB);

            if (!lastMessageA && !lastMessageB) {
                return 0;
            } else if (!lastMessageA) {
                return lastMessageB.createdAt;
            } else if (!lastMessageB) {
                return lastMessageA.createdAt;
            } else {
                return b.lastMessage.createdAt - a.lastMessage.createdAt;
            }
        }).map((userInfo, ind) => {
            if (userId === userInfo._id) {
                return null;
            }

            return (
                <User key={ind} userId={userInfo._id} username={userInfo.username} status={userInfo.status} numUnread={userInfo.unreadCount} onClickHandler={(e: SyntheticEvent<HTMLDivElement>) => {
                    setChatSelectionState("loading");
                    setCurrentUsername(userInfo.username);
                }} />
            );
        })
    );

    const groupNodes = (
        groups.map((groupInfo, ind) => {
            return (
                <Group key={ind} group={groupInfo} isJoined={groupInfo.members.map(member => member._id).includes(userId)} onClickHandler={(e: SyntheticEvent<HTMLDivElement>) => {
                    setChatSelectionState("loading");
                    setActiveGroupInd(ind);
                }} />
            );
        })
    );

    return (
        <div className={`flex-nowrap h-full flex flex-col absolute lg:relative lg:flex-row z-30 duration-150 lg:duration-0 outline-1 outline-slate-300 lg:outline-none ${(isChatSelectionShown) ? "left-0": "left-[-16rem] lg:left-0"}`}>
            <ChangeNameMobile isChatSelectionShown={isChatSelectionShown} />
            <div className="flex-1 lg:flex-none min-h-[50px] lg:h-full w-64 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300 flex flex-col flex-nowrap items-center">
                <span className="shrink-0 w-full text-center py-1 outline outline-slate-200">Users</span>
                <div className="flex-1 w-full px-4 py-4 gap-4 flex flex-col flex-nowrap overflow-auto [scrollbar-width:none] md:[scrollbar-width:thin]">
                    {userNodes}
                </div>
            </div>
            <div className="flex-1 lg:flex-none min-h-[50px] lg:h-full w-64 lg:w-68 xl:w-80 bg-white shrink-0 outline-1 outline-slate-300 flex flex-col flex-nowrap items-center">
                <span className="shrink-0 w-full text-center py-1 outline outline-slate-200">Groups</span>
                <div className="flex-1 w-full px-4 py-4 gap-4 flex flex-col flex-nowrap overflow-auto [scrollbar-width:none] md:[scrollbar-width:thin]">
                    <CreateGroup />
                    {groupNodes}
                </div>
            </div>
            <LinkGroup />
        </div>
    );
}