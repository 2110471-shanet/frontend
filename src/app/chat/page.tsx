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
    const [selectedChat, setSelectedChat] = useState<string>('') ;
    const [isSelectedDirectChat, setIsSelectedDirectChat] = useState<boolean>(false);

    const chatSelectionStateContextValue = useMemo(() => ({
        chatSelectionState, setChatSelectionState,
        selectedChat, setSelectedChat,
        isSelectedDirectChat, setIsSelectedDirectChat,
    }), [chatSelectionState, selectedChat, isSelectedDirectChat]);

    // [{sender, message}]
    const [messages, setMessages] = useState<Array<MessageType>>([]);
    const [users, setUsers] = useState<Array<UserType>>([]) ;
    const [groups, setGroups] = useState<Array<GroupType>>([]) ;

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

    const isSocketConnectedRef = useRef<boolean>(false);
    const usersRef = useRef<Array<UserType>>([]) ;
    const groupsRef = useRef<Array<GroupType>>([]) ;
    const messagesRef = useRef<Array<MessageType>>([]) ;
    const selectedChatRef = useRef<string>('') ;

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
        if (socket.connected) {
            socket.disconnect() ;
        }
    }

    async function fetchUser() {
        const res = await customAxios.get('/api/user') ;

        setUsername(res.data.user.username) ;
        setUserId(res.data.user._id) ;
    }

    async function fetchUsers() {
        const res = await customAxios.get('/api/users') ;

        setUsers(res.data) ;
        usersRef.current = res.data ;
    }

    async function fetchChatRooms() {
        const res = await customAxios.get('/api/chatrooms/all') ;

        setGroups(res.data) ;
        groupsRef.current = res.data
    }

    async function fetchMessages() {
        const requestPath = `/api/messages/${(isSelectedDirectChat ? 'directMessages/' : '')}${selectedChat}` ;
        const res = await customAxios(requestPath) ;

        setMessages(res.data) ;
        messagesRef.current = res.data ;
    }

    function cleanEvent() {
        socket.off('room-created');
        socket.off('receive-direct-message');
        socket.off('receive-message');
        socket.off('user-joined-chatroom');
        socket.off('errors');
    }

    useEffect(() => {
        if (selectedChat !== '') {
            selectedChatRef.current = selectedChat ;
            fetchMessages() ;
        }
    }, [selectedChat]);

    useEffect(() => {
        if (!isSocketConnectedRef.current) {
            connectSocket();
            isSocketConnectedRef.current = true;
        }

        return () => {
            disconnectSocket();
            isSocketConnectedRef.current = false;
        }
    }, []);

    useEffect(() => {
        if (isSocketConnectedRef.current) {
            socket.on('connect', () => {    
                socket.emit('join-rooms', groups) ;
            });
            
            socket.on('active', (user, status) => {
                if (!users.find(u => (u._id === user._id))) {
                    setUsers([
                        ...users, {
                            ...user,
                            unreadCount: 0,
                        }
                    ])
        
                    return ;
                }
        
                const updatedUsers = users.map(u =>
                    u._id === user._id ? { ...u, status } : u
                );
        
                setUsers(updatedUsers);
                // usersRef.current = updatedUsers ;
            });
        }
        
        return () => {
            socket.off('join-rooms');
            socket.off('active');
            cleanEvent();
        }
    }, [isSocketConnectedRef, users, groups]);

    useEffect(() => {
        if (isSocketConnectedRef.current) {
            socket.on('room-created', (room) => {
                const updatedGroups = [
                    ...groups, {
                    ...room,
                    numunread: 0,
                }];

                console.log(room);
                console.log(updatedGroups);
            
                setGroups(updatedGroups) ;
            });

            socket.on('receive-direct-message', (message, sender) => {
                if (!(sender._id === selectedChat || sender._id === userId)) {
                    return ;
                }
            
                const updatedMessages = [
                    ...messages, {
                    message: message,
                    sender: {
                        _id: sender._id,
                        username: sender.username,
                    },
                }];
            
                setMessages(updatedMessages) ;
            });

            socket.on('receive-message', (message, sender, chatId) => {
                if (!(chatId === selectedChat || chatId === sender._id.toString())) {
                    return ;
                }
            
                const updatedMessages = [
                    ...messages, {
                    message: message,
                    sender: {
                        _id: sender._id,
                        username: sender.username,
                    },
                }];
            
                setMessages(updatedMessages) ;
            });

            socket.on('user-joined-chatroom', (user, groupId) => {
                console.log('user-join-chatroom');
                const updatedGroups = groups.map(group =>
                    group._id === groupId ? { 
                        _id: group._id,
                        chatName: group.chatName,
                        lastMessage: group.lastMessage,
                        numUnread: group.numUnread,
                        members: [
                            ...group.members, {
                                _id: user._id,
                                username: user.username,
                                status: user.status,
                                unreadCount: 0,
                            }
                        ]
                    } : group
                );
            
                setGroups(updatedGroups) ;
            });
        }

        return () => {
            cleanEvent();
        }
    }, [users, groups, messages, selectedChat, username, userId]);

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