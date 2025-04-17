import { SyntheticEvent } from "react";
import ChangeNameMobile from "./ChangeNameMobile"
import CreateGroup from "./CreateGroup";
import Group from "./Group";
import LinkGroup from "./LinkGroup";
import User from "./User";

export default function ChatSelect({
    isChatSelectionShown,
}: {
    isChatSelectionShown: boolean,
}) {

    const mockUserInfo = [
        {
            id: "a",
            username: "bobby1423",
            status: "online",
            numUnread: 2,
        },
        {
            id: "b",
            username: "chikenduke",
            status: "offline",
            numUnread: 3,
        },
        {
            id: "c",
            username: "mewinglord",
            status: "online",
            numUnread: 107,
        },
        {
            id: "d",
            username: "mockingking",
            status: "offline",
            numUnread: 7,
        },
        {
            id: "e",
            username: "skibidi",
            status: "online",
            numUnread: 0,
        },
        {
            id: "f",
            username: "bobby1423",
            status: "online",
            numUnread: 2,
        },
        {
            id: "g",
            username: "chikenduke",
            status: "offline",
            numUnread: 3,
        },
        {
            id: "h",
            username: "mewinglord",
            status: "online",
            numUnread: 20,
        },
        {
            id: "i",
            username: "mockingking",
            status: "offline",
            numUnread: 7,
        },
        {
            id: "j",
            username: "skibidi",
            status: "online",
            numUnread: 0,
        },
    ];

    const mockGroupInfo = [
        {
            id: "groupId: a",
            groupName: "Mewing Empire",
            isJoined: true,
        },
        {
            id: "groupId: b",
            groupName: "Skibidi Toilet",
            isJoined: false,
        },
        {
            id: "groupId: c",
            groupName: "Cat Can Talk",
            isJoined: true,
        },
        {
            id: "groupId: d",
            groupName: "Shane Multiverse",
            isJoined: false,
        }
    ];

    const userNodes = (
        mockUserInfo.map((userInfo, ind) => {
            return (
                <User key={ind} username={userInfo.username} status={userInfo.status} numUnread={userInfo.numUnread} onClickHandler={(e: SyntheticEvent<HTMLDivElement>) => {
                    console.log(userInfo.id);
                }} />
            );
        })
    );

    const groupNodes = (
        mockGroupInfo.map((groupInfo, ind) => {
            return (
                <Group key={ind} groupName={groupInfo.groupName} isJoined={groupInfo.isJoined} onClickHandler={(e: SyntheticEvent<HTMLDivElement>) => {
                    console.log(groupInfo.id);
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