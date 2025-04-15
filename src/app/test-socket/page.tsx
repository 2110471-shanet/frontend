"use client"

import { getSocket } from '@/lib/socket';
import { useState, useEffect, useRef, RefObject } from 'react' ;
import { Socket } from 'socket.io-client';

type UserType = {
    _id: string,
    username: string,
    status: boolean,
}

type refType = {
    message: string, 
    res: string, 
    userList: UserType[], 
    usernames: string[],
}

type StateType = {
    message: string, 
    res: string, 
    userList: UserType[], 
    usernames: string[],
    setMessage: React.Dispatch<React.SetStateAction<string>>, 
    setRes: React.Dispatch<React.SetStateAction<string>>, 
    setUserList: React.Dispatch<React.SetStateAction<UserType[]>>,
    setUsernames: React.Dispatch<React.SetStateAction<string[]>>,
}

function useChatState() {
    const [ message, setMessage ] = useState<string>('') ;
    const [ res, setRes ] = useState<string>('') ;
    const [ userList, setUserList ] = useState<UserType[]>([]) ;
    const [ usernames, setUsernames ] = useState<string[]>([]) ;

    return { 
        message, setMessage, 
        res, setRes, 
        userList, setUserList,
        usernames, setUsernames,
    }
}

function socketHandler(socket: Socket, chatState: StateType, stateRef: RefObject<refType>) {
    const { 
        message, setMessage, 
        res, setRes, 
        userList, setUserList,
        usernames, setUsernames,
    } = chatState ;

    socket.on('retrieve-user', (userList: UserType[]) => {
        setUserList(userList) ;
    });

    socket.on('active', (newUser: UserType) => {
        setUserList([ ...stateRef.current.userList, newUser ]) ;
    });
    
    socket.on('inactive', (disconnectedUser: UserType) => {
        setUserList(prevUserList => prevUserList.filter(user => user._id !== disconnectedUser._id));
    });

    socket.on('user-connected', message => {
        setMessage(message) ;
    });

    socket.on('ack', message => {
        setRes(message) ;
        console.log(stateRef.current.userList) ;
    });
}

export default function TestSocket() {
    const socket = getSocket('goat') ;
    const chatState = useChatState()
    const { 
        message, setMessage, 
        res, setRes, 
        userList, setUserList,
        usernames, setUsernames,
    } = chatState ;

    const stateRef = useRef({
        message: '' as string,
        res: '' as string,
        userList: [] as UserType[],
        usernames: [] as string[],
    })

    function handleClick() {
        console.log('ping') ;
        socket.emit('ping') ;
    }

    useEffect(() => {
        socketHandler(socket, chatState, stateRef) ;
    }, []) ;

    useEffect(() => {
        stateRef.current = {
            message,
            res,
            userList,
            usernames,
        };
    }, [message, res, userList, usernames])

    useEffect(() => {
        setUsernames(userList.map((user: UserType) => user.username)) ;
    }, [userList])

    return (
        <div className="h-screen flex flex-col gap-4 justify-center items-center bg-slate-50">
            <h1> { res } </h1>
            <h1 className="whitespace-pre-wrap"> { message } </h1>
            <button className="bg-slate-300 p-5 rounded-md hover:bg-slate-400 active:bg-slate-300" onClick={handleClick}> test </button>
            <h1 className="whitespace-pre-wrap"> { usernames.join('\n') } </h1>
        </div>
    );
}