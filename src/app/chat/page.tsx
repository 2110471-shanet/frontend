"use client"

import ChatBox from "@/components/chatpage/ChatBox";
import ChatSelect from "@/components/chatpage/ChatSelect";
import NavBar from "@/components/NavBar";
import { useState, useEffect, createContext, useMemo, useContext, useRef } from "react";
import { ChatSelectionStateContext, MessagesContext } from "./pageContext";

import type { GroupType, MessageType, UserType, UserWithLastMessageType } from "@/types";
import { getSocket } from "@/lib/socket";

import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";
import { useUser } from "@/components/provider/UserProvider";
import { useGroup } from "@/components/provider/GroupProvider";
import customAxios from "@/axios";

import { toast } from "react-toastify";

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
    const [lastDirectMessages, setLastDirectMessages] = useState<Array<MessageType | null>>([]);

    const messagesContextValue = useMemo(() => ({messages, setMessages}), [messages]);

    const { isLoading, setIsLoading } = useGlobalLoading() ;
    const { 
        username, userId, currentUsername,
        setUsername, setUserId, setCurrentUsername,
    } = useUser() ;

    const isSocketConnectedRef = useRef<boolean>(false);
    const usersRef = useRef<Array<UserType>>([]) ;
    const groupsRef = useRef<Array<GroupType>>([]) ;
    const messagesRef = useRef<Array<MessageType>>([]) ;

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

        const reducedLastDirectMessages = res.data.lastDirectMessages.map((lastDirectMessage: any) => {
            return lastDirectMessage ? {
                message: lastDirectMessage.message,
                sender: {
                    _id: lastDirectMessage.senderId,
                    username: '',
                }
            } : null;
        });

        setUsers(res.data.users);
        setLastDirectMessages(reducedLastDirectMessages);

        // console.log(res.data.lastDirectMessages.map((lastDirectMessage: any) => {
        //     return lastDirectMessage ? {
        //         message: lastDirectMessage.message,
        //         sender: {
        //             _id: lastDirectMessage.senderId,
        //             username: '',
        //         }
        //     } : null;
        // }));
    }

    async function fetchChatRooms() {
        const res = await customAxios.get('/api/chatrooms/all') ;

        setGroups(res.data) ;
    }   

    async function fetchMessages() {
        try {
            const requestPath = `/api/messages/${(isSelectedDirectChat ? 'directMessages/' : '')}${selectedChat}` ;
            const res = await customAxios(requestPath) ;
    
            setMessages(res.data) ;
            setChatSelectionState("ready");
        } catch (error) {
            console.log(`error trying to: ${error}`);
            setChatSelectionState("ready");
        }
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
            });
        }
        
        return () => {
            socket.off('join-rooms');
            socket.off('active');
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
            
                setGroups(updatedGroups) ;
            });

            socket.on('receive-direct-message', (message, sender) => {
                if (sender._id !== userId) {
                    playSoundIncomingChat();
                    if (sender._id !== selectedChat) {
                        const updatedUsers = users.map(user => {
                            return user._id === sender._id ? { 
                                ...user, 
                                unreadCount: user.unreadCount + 1,
                            } : user
                        });

                        const updatedLastDirectMessages = lastDirectMessages.map(lastDirectMessage => {
                            return lastDirectMessage ? (lastDirectMessage.sender._id === sender._id ? {
                                ...lastDirectMessage,
                                message: message,
                            } : lastDirectMessage) : null
                        });
    
                        setUsers(updatedUsers);
                        setLastDirectMessages(updatedLastDirectMessages);
    
                        return ;
                    }
                }
            
                const updatedMessages = [
                    ...messages, {
                    message: message,
                    sender: {
                        _id: sender._id,
                        username: sender.username,
                    },
                }];

                const updatedLastDirectMessages = lastDirectMessages.map(lastDirectMessage => {
                    return lastDirectMessage ? (lastDirectMessage.sender._id === userId ? {
                        ...lastDirectMessage,
                        message: message,
                    } : lastDirectMessage) : null
                });
            
                setMessages(updatedMessages) ;
                setLastDirectMessages(updatedLastDirectMessages);
            });

            socket.on('receive-message', (message, sender, chatId) => {
                if (chatId !== sender._id) {
                    playSoundIncomingChat();
                    if (chatId !== selectedChat && sender._id !== userId) {
                        const updatedGroups = groups.map(group =>
                            group._id === chatId ? { ...group, unreadCount: group.unreadCount + 1 } : group
                        );
    
                        setGroups(updatedGroups);
    
                        return ;
                    }
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

            socket.on('direct-message-read', (senderId: string) => {
                const updatedUsers = users.map(user =>
                    user._id === senderId ? { ...user, unreadCount: 0 } : user
                );

                setUsers(updatedUsers);
            })

            socket.on('message-read', (chatId: string) => {
                const updatedGroups = groups.map(group =>
                    group._id === chatId ? { ...group, unreadCount: 0 } : group
                );

                setGroups(updatedGroups);
            })

            socket.on('username-changed', (updatedUserId: string, newUsername: string) => {
                if (updatedUserId === userId) {
                    setUsername(newUsername);
                    setUsers(users);    
                    return;
                }
        
                const updatedUsers = users.map(user =>
                    user._id === updatedUserId ? { ...user, username: newUsername } : user
                );
        
                setUsers(updatedUsers);
            });

            socket.on('user-joined-chatroom', (user, groupId) => {
                const updatedGroups = groups.map(group =>
                    group._id === groupId ? { 
                        _id: group._id,
                        chatName: group.chatName,
                        lastMessage: group.lastMessage,
                        unreadCount: group.unreadCount,
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

                if (groupId === selectedChat) {
                    toast(<span className="max-w-full truncate">{user.username} just joined!</span>, {
                        containerId: "special",
                        autoClose: 1000,
                        theme: "light",
                        className: "max-w-56 md:max-w-64 !truncate mt-4 !min-[481px]:mt-0 md rounded-md overflow-hidden !me-4 !min-[481px]:me-0",
                        closeOnClick: true
                    });
                    playSoundUserJoin();
                }

                setGroups(updatedGroups) ;
            });
        }

        return () => {
            cleanEvent();
        }
    }, [users, groups, messages, selectedChat, username, userId]);
    
    const hasInteractedRef = useRef(false);

    useEffect(() => {
        const onFirstInteraction = () => {
            hasInteractedRef.current = true;
        };

        window.addEventListener('click', onFirstInteraction, { once: true });
        window.addEventListener('keydown', onFirstInteraction, { once: true });
        window.addEventListener('touchstart', onFirstInteraction, { once: true });

        return () => {
            window.removeEventListener('click', onFirstInteraction);
            window.removeEventListener('keydown', onFirstInteraction);
            window.removeEventListener('touchstart', onFirstInteraction);
        };
    }, []);

    function playSoundIncomingChat() {
        if (!hasInteractedRef.current) return; 

        const audio = new Audio("/audios/incomingChat.mp3");
        audio.play().catch(err => {
            console.warn("failed to play audio", err);
        });
    }

    function playSoundUserJoin() {
        if (!hasInteractedRef.current) return; 

        const audio = new Audio("/audios/UserJoin.mp3");
        audio.play().catch(err => {
            console.warn("failed to play audio", err);
        });
    }

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
                            lastDirectMessages={lastDirectMessages}
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