"use client"

import ChatBox from "@/components/chatpage/ChatBox";
import ChatSelect from "@/components/chatpage/ChatSelect";
import NavBar from "@/components/NavBar";
import { useState, useEffect, createContext, useMemo, useContext, useRef } from "react";
import { ChatSelectionStateContext, MessagesContext } from "./pageContext";

import type { GroupType, MessageType, UserType, UserWithLastMessageType } from "@/types";
import { getSocket } from "@/lib/socket";
import { useRouter } from "next/navigation";

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

    // [{sender, message}]
    const [messages, setMessages] = useState<Array<MessageType>>([]);
    const [users, setUsers] = useState<Array<UserType>>([]) ;
    const [groups, setGroups] = useState<Array<GroupType>>([]) ;
    const [lastDirectMessages, setLastDirectMessages] = useState<Array<MessageType | null>>([]);
    const [typingUsers, setTypingUsers] = useState<Array<string>>([]);

    // context
    const messagesContextValue = useMemo(() => ({messages, setMessages}), [messages]);
    const chatSelectionStateContextValue = useMemo(() => ({
        chatSelectionState, setChatSelectionState,
        selectedChat, setSelectedChat,
        isSelectedDirectChat, setIsSelectedDirectChat,
    }), [chatSelectionState, selectedChat, isSelectedDirectChat]);


    const { isLoading, setIsLoading } = useGlobalLoading() ;
    const { 
        username, userId,
        setUsername, setUserId,
    } = useUser() ;

    const isSocketConnectedRef = useRef<boolean>(false);

    const socket = getSocket() ;
    const router = useRouter();

    async function connectSocket() {
        setIsLoading(true) ;

        socket.connect() ;

        await fetchUser() ;
        await fetchUsers() ;
        await fetchChatRooms() ;

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
                createdAt: lastDirectMessage.createdAt,
                sender: {
                    _id: lastDirectMessage.senderId,
                    username: '',
                },
                receiver: {
                    _id: lastDirectMessage.receiverId,
                    username: '',
                },
            } : null;
        });

        setLastDirectMessages(reducedLastDirectMessages);
        setUsers(res.data.users);
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
            router.refresh();
            setChatSelectionState("ready");
        }
    }

    function cleanEvent() {
        socket.off('room-created');
        socket.off('receive-direct-message');
        socket.off('receive-message');
        socket.off('direct-message-read');
        socket.off('message-read');
        socket.off('others-typing');
        socket.off('others-stop-typing');
        socket.off('username-changed');
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
                socket.emit('join-rooms') ;
            });
            
            socket.on('active', (user, status) => {
                if (!users.find(u => (u._id === user._id))) {
                    setUsers(prevUsers => [
                        ...prevUsers, {
                            ...user,
                            unreadCount: 0,
                        }
                    ]);

                    // console.log(users);
                    // cons

                    console.log(lastDirectMessages);

                    setLastDirectMessages(prev => [
                        ...prev, 
                        null,
                    ]);
        
                    return ;
                }
        
                setUsers(prevUsers => prevUsers.map(prevUser =>
                    prevUser._id === user._id ? { ...prevUser, status } : prevUser
                ));
                
            });

            socket.on('on-signed-out', () => {
                if (socket.connected) {
                    socket.disconnect();
                }

                router.refresh();
            });
        }
        
        return () => {
            socket.off('connect');
            socket.off('active');
            socket.off('join-rooms');
            socket.off('on-signed-out');
        }
    }, [isSocketConnectedRef, users, groups]);

    useEffect(() => {
        if (isSocketConnectedRef.current) {
            socket.on('room-created', (room) => {            
                setGroups(prevGroups => [
                    ...prevGroups, {
                        ...room,
                        unreadCount: 0,
                    }
                ]);
            });

            socket.on('receive-direct-message', (message, sender) => {
                const isSendingToSelf = message.senderId === userId;
                const isChatIsOpenned = message.senderId === selectedChat || message.receiverId == selectedChat;

                const isSenderOrReceiver = (user: UserType) => user._id === message.receiverId || user._id === message.senderId;
                const updatedLastDirectMessagesInd = users.findIndex(isSenderOrReceiver);

                setLastDirectMessages(prevLastDirectMessages => prevLastDirectMessages.map((lastDirectMessage, ind) => {
                    const isTargetChat = ind === updatedLastDirectMessagesInd;

                    const newLastDirectMessage: MessageType = {
                        message: message.message,
                        createdAt: message.createAt,
                        sender: {
                            _id: message.senderId,
                            username: sender.username,
                        },
                        receiver: {
                            _id: message.receiverId,
                            username: '',
                        }
                    };

                    return isTargetChat ? newLastDirectMessage : lastDirectMessage;
                }));    

                // if not sending to self -> plays sound
                if (!isSendingToSelf) {
                    playSoundIncomingChat();
                } 
                
                // if chat is open, it suppose to mark as read
                if (isChatIsOpenned && !isSendingToSelf) {
                    socket.emit('read-direct-message', userId, message.senderId);
                }

                if (isChatIsOpenned) {
                    // if currently opens that chat -> update messages area
                    setMessages(prevMessages => [
                        ...prevMessages, {
                        message: message.message,
                        createdAt: message.createdAt,
                        sender: {
                            _id: message.senderId,
                            username: sender.username,
                        },
                        receiver: {
                            _id: userId,
                            username: username,
                        }
                    }]) ;
                } else if (!isSendingToSelf) {
                    // but if not currently open and received by others -> update unread count
                    setUsers(prevUsers => prevUsers.map(prevUser => {
                        return prevUser._id === message.senderId ? {
                            ...prevUser,
                            unreadCount: prevUser.unreadCount + 1,
                        } : prevUser
                    }));
                }
            });

            socket.on('receive-message', (message, sender) => {
                const isSendingToSelf = message.senderId === userId;
                const isChatIsOpenned = message.chatRoomId === selectedChat;

                // if not sending to self -> plays sound
                if (!isSendingToSelf) {
                    playSoundIncomingChat();
                }

                // if chat is open, it suppose to mark as read
                if (isChatIsOpenned && !isSendingToSelf) {
                    socket.emit('read-message', message.chatRoomId);
                }

                if (isChatIsOpenned) {
                    // if currently opens that chat -> update messages area
                    setMessages(prevMessages => [
                        ...prevMessages, {
                        message: message.message,
                        createdAt: message.createdAt,
                        sender: {
                            _id: message.senderId,
                            username: sender.username,
                        },
                        receiver: {
                            _id: message.chatRoomId,
                            username: '',
                        }
                    }]);
                } else if (!isSendingToSelf) {
                    // but if not currently open and received by others -> update unread count
                    setGroups(prevGroups => prevGroups.map(group =>
                        group._id === message.chatRoomId ? { 
                            ...group, 
                            unreadCount: group.unreadCount + 1 
                        } : group
                    ));
                }
            });

            socket.on('direct-message-read', (senderId: string) => {
                setUsers(prevUsers => prevUsers.map(prevUser =>
                    prevUser._id === senderId ? { ...prevUser, unreadCount: 0 } : prevUser
                ));
            });

            socket.on('message-read', (chatId: string) => {
                setGroups(prevGroups => prevGroups.map(group =>
                    group._id === chatId ? { ...group, unreadCount: 0 } : group
                ));
            });

            socket.on('others-typing', (username: string, typerId: string, chatId: string) => {
                const isOpennedGroupChat   = selectedChat === chatId;
                const isOpennedDirectChat  = selectedChat === typerId;
                const isReceivedDirectChat = chatId === userId;

                if (!isOpennedGroupChat && (!isOpennedDirectChat || !isReceivedDirectChat)) {
                    return;
                }
            
                console.log('other is typing')
                if (typingUsers.includes(username)) {
                    return;
                }

                setTypingUsers(prevTypingUsers => [
                    ...prevTypingUsers, 
                    username,
                ]);
            });

            socket.on('others-stop-typing', (username: string) => {
                setTypingUsers(prevTypingUsers => prevTypingUsers.filter(user => user !== username));
            });

            socket.on('username-changed', (updatedUserId: string, newUsername: string) => {
                if (updatedUserId === userId) {
                    setUsername(newUsername);
                    return;
                }
        
                setUsers(prevUsers => prevUsers.map(prevUser =>
                    prevUser._id === updatedUserId ? { ...prevUser, username: newUsername } : prevUser
                ));
            });

            socket.on('user-joined-chatroom', (user, groupId) => {
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

                setGroups(prevGroups => prevGroups.map(group =>
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
                ));
            });

            socket.on('errors', (message: string) => {
                console.log(message);
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
        <div className="h-[100dvh] flex flex-col flex-nowrap w-full relative">
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
                        <ChatBox 
                            typingUsers={typingUsers}
                        />
                    </ChatSelectionStateContext>
                </MessagesContext>
            </main>
            <div className={`absolute w-full h-full min-h-[100dvh] top-0 left-0 bg-black duration-150 lg:duration-0 z-20 lg:hidden ${(isChatSelectionShown) ? "opacity-10": "opacity-0 select-none hidden"}`} onClick={(e) => {
                setIsChatSelectionShown(false);
            }}>
                
            </div>
        </div>
    );
}