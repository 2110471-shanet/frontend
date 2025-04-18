import { SyntheticEvent, useEffect, useState } from "react";
import ChangeNameMobile from "./ChangeNameMobile"
import CreateGroup from "./CreateGroup";
import Group from "./Group";
import LinkGroup from "./LinkGroup";
import User from "./User";
import { GroupType, UserType } from "@/types";
import { useUser } from "../provider/UserProvider";

export default function ChatSelect({
    isChatSelectionShown,
    users,
    groups,
}: {
    isChatSelectionShown: boolean,
    users: Array<UserType>,
    groups: Array<GroupType>,
}) {
    const { userId } = useUser() ;

    function checkIsJoin(group: GroupType, ) {
        const memberIds = group.members.map((member) => {
            return member._id.toString();
        })

        return memberIds.includes(userId);
    }

    const userNodes = (
        users.map((userInfo, ind) => {
            return (
                <User key={ind} userId={userInfo._id} username={userInfo.username} status={userInfo.status} numUnread={userInfo.unreadCount} onClickHandler={(e: SyntheticEvent<HTMLDivElement>) => {
                    console.log(userInfo._id);
                }} />
            );
        })
    );

    const groupNodes = (
        groups.map((groupInfo, ind) => {
            return (
                <Group key={ind} group={groupInfo} onClickHandler={(e: SyntheticEvent<HTMLDivElement>) => {
                    console.log(groupInfo._id);
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