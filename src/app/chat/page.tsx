"use client"

import ChatBox from "@/components/chatpage/ChatBox";
import ChatSelect from "@/components/chatpage/ChatSelect";
import NavBar from "@/components/NavBar";
import { useState, useEffect, createContext, useMemo, useContext, useRef } from "react";
import { ChatSelectionStateContext, MessagesContext } from "./pageContext";

import type { GroupType, MessageType, UserType } from "@/types";
import { getSocket } from "@/lib/socket";

import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";
import { useUser } from "@/components/provider/UserProvider";
import { useGroup } from "@/components/provider/GroupProvider";
import customAxios from "@/axios";

export default function Chat() {

    const [isChatSelectionShown, setIsChatSelectionShown] = useState(false);

    // empty, loading, ready
    const [chatSelectionState, setChatSelectionState] = useState("empty");

    const chatSelectionStateContextValue = useMemo(() => ({chatSelectionState, setChatSelectionState}), [chatSelectionState]);

    // [{sender, message}]
    const [messages, setMessages] = useState<Array<MessageType>>([]);
    const [users, setUsers] = useState<Array<UserType>>([]) ;
    const [groups, setGroups] = useState<Array<GroupType>>([]) ;

    const isFirstLoadSucceed = useRef(false) ;

    const messagesContextValue = useMemo(() => ({messages, setMessages}), [messages]);

    const { isLoading, setIsLoading } = useGlobalLoading() ;
    const { 
        username, userId,
        setUsername, setUserId,
    } = useUser() ;

    const { 
        isShowingMember, members, groupName, 
        setIsShowingMember, setMembers, setGroupName 
    } = useGroup() ;

    const usersRef = useRef<Array<UserType>>([]) ;
    const groupsRef = useRef<Array<GroupType>>([]) ;

    const socket = getSocket() ;

    async function connectSocket() {
        setIsLoading(true) ;

        await fetchUser() ;
        await fetchUsers() ;
        await fetchChatRooms() ;

        socket.connect() ;

        setIsLoading(false) ;
    }

    async function disconnectSocket() {
        if (socket.connected)
            socket.disconnect() ;
    }

    async function fetchUser() {
        const res = await customAxios.get('/api/user') ;

        setUsername(res.data.user.username) ;
        setUserId(res.data.user._id) ;
    }

    async function fetchUsers() {
        const res = await customAxios.get('/api/users') ;

        console.log(res.data) ;

        setUsers(res.data) ;
        usersRef.current = res.data ;
    }

    async function fetchChatRooms() {
        const res = await customAxios.get('/api/chatrooms/all') ;

        console.log(res.data) ;

        setGroups(res.data) ;
        groupsRef.current = res.data
    }

    useEffect(() => {
        if (!socket.connected) {
            connectSocket() ;

            socket.on('connect', () => {
                socket.emit('join-rooms', usersRef.current) ;
                socket.emit('join-rooms', groupsRef.current) ;
            });

            socket.on('active', (user, status) => {
                if (!usersRef.current.find(u => (u._id === user._id))) {
                    setUsers([
                        ...usersRef.current,
                        {
                            ...user,
                            unreadCount: 0,
                        }
                    ])

                    return ;
                }

                const updatedUsers = usersRef.current.map(u =>
                    u._id === user._id ? { ...u, status } : u
                );

                setUsers(updatedUsers);
                usersRef.current = updatedUsers ;
            });

            socket.on('room-created', (room) => {
                const updatedGroups = [
                    ...groupsRef.current, {
                    ...room,
                    numunread: 0,
                }];

                setGroups(updatedGroups) ;
                groupsRef.current = updatedGroups ;
            });
        }

        return () => {
            disconnectSocket() ;
        }
    }, []);

    return (
        <div className="h-screen flex flex-col flex-nowrap w-full relative">
            <NavBar setIsChatSelectionShown={setIsChatSelectionShown} isChatSelectionShown={isChatSelectionShown} />
            <main className="w-full flex flex-nowrap relative overflow-hidden flex-1 min-h-[300px]">
                <MessagesContext value={messagesContextValue}>
                    <ChatSelectionStateContext value={chatSelectionStateContextValue}>
                        <ChatSelect 
                            isChatSelectionShown={isChatSelectionShown} 
                            users={users}
                            groups={groups}
                        />
                        <ChatBox />
                    </ChatSelectionStateContext>
                </MessagesContext>
            </main>
            <div className={`absolute w-full h-full min-h-screen top-0 left-0 bg-black duration-150 lg:duration-0 z-20 lg:hidden ${(isChatSelectionShown) ? "opacity-10": "opacity-0 select-none hidden"}`} onClick={(e) => {
                setIsChatSelectionShown(false);
            }}>
                
            </div>
        </div>
    );
}