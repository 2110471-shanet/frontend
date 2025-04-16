"use client"

import { useContext, useEffect, useState } from "react";
import { useGroupMember } from "@/components/provider/GroupMemberProvider";

export default function TestGroupMemberContext() {
    const {isShowingMember, members, groupName, setIsShowingMember, setMembers, setGroupName} = useGroupMember();

    const [mockGroups, setMockGroups] = useState([
        {
            groupName: "NinjaKayak",
            members: [
                "Robertson",
                "Lorly",
                "Bendaway",
                "Hillery",
            ],
        },
        {
            groupName: "Lanaconda",
            members: [
                "ImSoLonely",
                "SideKick",
            ],
        },
        {
            groupName: "WeAreBobbyWeAreBobbyWeAreBobby",
            members: [
                "Bobby1",
                "Bobby2",
                "Bobby3",
            ]
        }
    ]);

    const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);

    useEffect(() => {
        if (activeGroupIndex !== null && mockGroups[activeGroupIndex]) {
            setGroupName(mockGroups[activeGroupIndex].groupName);
            setMembers(mockGroups[activeGroupIndex].members);
        }
    }, [activeGroupIndex, mockGroups]);

    useEffect(() => {
        let i = 0;
        const myInterval = setInterval(() => {
            if (i === 0) {
                setMockGroups([{
                    groupName: mockGroups[0].groupName,
                    members: [...mockGroups[0].members, "JoggyJoe"]
                 }, ...mockGroups.slice(1)]);
                 i++;
            } else {
                setMockGroups(mockGroups);
                i--;
            }
        }, 500);
        return () => {
            clearInterval(myInterval);
        }
    }, [])

    return (
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 rounded-md text-white hover:cursor-pointer hover:bg-green-700 active:bg-green-800 duration-100" onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsShowingMember(!isShowingMember);
                setActiveGroupIndex(0);
            }}>
                Show Members Group {mockGroups[0].groupName}
            </button>
            <button className="px-4 py-2 bg-green-600 rounded-md text-white hover:cursor-pointer hover:bg-green-700 active:bg-green-800 duration-100" onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsShowingMember(!isShowingMember);
                setActiveGroupIndex(1);
            }}>
                Show Members Group {mockGroups[1].groupName}
            </button>
            <button className="px-4 py-2 bg-green-600 rounded-md text-white hover:cursor-pointer hover:bg-green-700 active:bg-green-800 duration-100" onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsShowingMember(!isShowingMember);
                setActiveGroupIndex(2);
            }}>
                Show Members Group {mockGroups[2].groupName}
            </button>
        </div>
    );
}