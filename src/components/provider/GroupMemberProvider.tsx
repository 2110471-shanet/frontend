"use client"

import { createContext, useMemo, useState, useContext } from "react";
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

type Members = Array<string>;

type GroupMemberContextType = {
    isShowingMember: boolean;
    groupName: string,
    members: Members;
    setIsShowingMember: React.Dispatch<React.SetStateAction<boolean>>;
    setGroupName: React.Dispatch<React.SetStateAction<string>>;
    setMembers: React.Dispatch<React.SetStateAction<Members>>;
}

const GroupMemberContext = createContext<GroupMemberContextType | undefined>(undefined);

export function useGroupMember() {
    const context = useContext(GroupMemberContext);
    if (!context) {
        throw new Error("useGroupMember must be used within a GroupMemberProvider");
    }
    return context;
}

export default function GroupMemberContextProvider({
    children,
}: {
    children: React.ReactNode,
}) {

    const [isShowingMember, setIsShowingMember] = useState(false);
    const [groupName, setGroupName] = useState<string>("");
    const [members, setMembers] = useState<Members>([]);

    const contextValue = useMemo(() => ({isShowingMember, groupName, members, setIsShowingMember, setGroupName, setMembers}), [isShowingMember, members]);

    const memberNodes = (
        members.map((member, ind) => {
            return (
                <div className="flex gap-2 w-full shrink-0" key={member+ind}>
                    <div className="h-6 w-6 relative flex shrink-0 justify-center items-center bg-slate-600 rounded-md">
                        <Person2RoundedIcon sx={{height: "85%", width: "85%", color: "white",}} />
                    </div>
                    <span key={member} className="flex-1 truncate">{member}</span>
                </div>
            );
        })
    );

    return (
        <div className="relative">
            <div className={`absolute w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.5)] top-0 left-0 z-50 duration-100 ${(isShowingMember) ? "opacity-100 pointer-events-auto": "pointer-events-none opacity-0"}`} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsShowingMember(false);
                setGroupName("");
                setMembers([]);
            }}>
                <div className="w-96 h-96 shrink-0 bg-white z-60 rounded-lg drop-shadow-md px-6 py-6 flex flex-col items-center" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <span className="py-2 text-2xl truncate max-w-full">{groupName}</span>
                    <div className="flex flex-col gap-3 my-4 border-y-1 border-slate-300 flex-nowrap w-full flex-1 py-4 px-1 overflow-auto [scrollbar-width:thin]">
                        {memberNodes}
                    </div>
                    <button className="px-3 py-1 outline outline-slate-300 duration-100 hover:outline-slate-500 rounded-md text-sm hover:cursor-pointer active:outline-slate-700 self-start" onClick={(e) => {
                        setIsShowingMember(false);
                        setGroupName("");
                        setMembers([]);
                    }}>back</button>
                </div>

            </div>
            <GroupMemberContext value={contextValue}>
                {children}
            </GroupMemberContext>
        </div>
    );
}

