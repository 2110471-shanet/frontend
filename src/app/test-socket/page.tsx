"use client"

import { useGlobalLoading } from '@/components/provider/GlobalLoadingProvider';
import { useUser } from '@/components/provider/UserProvider';
import { getSocket } from '@/lib/socket';
import { useState, useEffect, useRef, SyntheticEvent } from 'react' ;

type UserType = {
    _id: string,
    username: string,
    status: boolean,
}

type ChatRoomType = {
    _id: string,
    chatName: string,
    members: Array<string>,
    numMembers: number,
}

export default function TestSocket() {
    const socket = getSocket() ;

    const [ message, setMessage ] = useState<string>('') ;
    const [ receivedMessage, setReceivedMessage ] = useState<string>('') ;
    const [ userList, setUserList ] = useState<Array<UserType>>([]) ;
    const [ usernames, setUsernames ] = useState<Array<string>>([]) ;
    const [ chatrooms, setChatrooms ] = useState<Array<ChatRoomType>>([]) ;
    const [ chatroom, setChatroom ] = useState<string>('') ;
    const [ chatroomId, setChatroomId ] = useState<string>('') ;
    const [ isTyping, setIsTyping ] = useState<boolean>(false) ;
    const [ typer, setTyper ] = useState<string>('') ;

    const { username, setUsername } = useUser() ;
    const { isLoading, setIsLoading } = useGlobalLoading() ;

    const isFirstLoadSucceed = useRef(false) ;

    function handleFetchUser() {
        socket.emit('user-disconnect') ;
        // socket.disconnect() ;
        socket.emit('update-user', username, (connectionInfo: string, userList: Array<UserType>) => {
            console.log(`username updated: ${username}`) ;
            setUserList(userList) ;
        })
    }

    function handleJoinChatroom() {
        console.log(`joined chatroom: ${chatroom}`) ;
        socket.emit('join-chatroom', chatroom) ;
    }

    function handleSendMessage(e: SyntheticEvent<HTMLButtonElement>) {
        socket.emit('send-message', message, chatroom, async (message: string) => {
            console.log(message) ;
        });
    }

    useEffect(() => {
        socket.on('retrieve-users', (userList: Array<UserType>) => {
            setUserList(userList) ;
        });

        socket.on('retrieve-chatrooms', (chatrooms: Array<ChatRoomType>) => {
            setChatrooms(chatrooms) ;
        });
        
        socket.on('receive-message', (message: string, sender: string) => {
            setReceivedMessage(message) ;
            console.log(`message: ${message} from ${sender}`) ;
        });

        socket.on('others-typing', (username: string, chatroomId: string) => {
            
        });

        socket.on('errors', (errorMessage: string) => {
            console.log(errorMessage) ;
        })

        return () => {
            socket.disconnect() ;
        }
    }, []) ;

    useEffect(() => {
        setUsernames(userList.map((user: UserType) => user.username)) ;
    }, [userList])

    useEffect(() => {
        if (!isLoading) {
            if (isFirstLoadSucceed.current) {
                console.log(username) ;

                socket.auth = { token: username };
                socket.connect();
            }

            isFirstLoadSucceed.current = true ;
        }
    }, [isLoading, isFirstLoadSucceed]);

    return (
        <div className="min-h-[100dvh] flex items-center justify-center gap-6 bg-slate-100 p-6"> 
            <div>
                <span> All Chatrooms </span>
                <div className="bg-white border border-gray-300 rounded p-4 w-128 whitespace-pre-wrap mb-10">
                    { chatrooms.map(chatroom => chatroom.chatName).join('\n') } ;
                </div>

                <span> All Users </span>
                <div className="bg-white border border-gray-300 rounded p-4 w-128 whitespace-pre-wrap">
                    { usernames.join('\n') }
                </div>
            </div>

            <div className="min-h-[100dvh] flex flex-col justify-center bg-slate-100 p-6">
                <span> Username </span>
                <input
                    type="text"
                    className="border border-gray-300 rounded p-2 w-64 mb-5"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                
                <span> Chatroom </span>
                <input
                    type="text"
                    className="border border-gray-300 rounded p-2 w-64 mb-10"
                    value={chatroom}
                    onChange={e => setChatroom(e.target.value)}
                />

                <span> Message: </span>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={(e) => socket.emit('typing', username, chatroom)}
                    // onBlur={(e) => socket.emit('stop-typing', username, chatroom)}
                    className="bg-white border border-gray-300 rounded p-4 w-128 whitespace-pre-wrap mb-5"
                />
                
                <span> Received Message: </span>
                <input
                    type="text"
                    value={receivedMessage}
                    onChange={(e) => setReceivedMessage(e.target.value)}
                    className="bg-white border border-gray-300 rounded p-4 w-128 whitespace-pre-wrap"
                />

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 mt-5 mb-10"
                    onClick={handleSendMessage}
                > Send Message </button>
                
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 mb-5"
                    onClick={handleFetchUser}
                > Fetch User </button>

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 mb-5"
                    onClick={handleJoinChatroom}
                > Join Chatroom </button>
            </div>
        </div>
    );
}