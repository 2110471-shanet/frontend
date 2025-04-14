"use client"

import { useSocket } from '@/components/provider/SocketProvider';
import { useState, useEffect } from 'react' ;

type UserInfo = {
    status: boolean ;
}

type UserType = {
    [key: string]: UserInfo ;
}

export default function TestSocket() {
    const socket = useSocket() ;
    const [ message, setMessage ] = useState<string>('') ;
    const [ res, setRes ] = useState<string>('') ;
    const [ userList, setUserList ] = useState<UserType>({}) ;

    function handleClick() {
        console.log('ping') ;
        socket.emit('ping') ;
    }

    useEffect(() => {
        socket.on('retrieve-user', (userList: UserType) => {
            setUserList(userList) ;
        });

        socket.on('active', (user: UserType) => {
            setUserList((prevUserList) => ({ ...prevUserList, ...user })) ;
        });
        
        socket.on('inactive', (userId: string) => {

            setUserList((prevUserList) => {
                console.log('prev: ', prevUserList) ;
                console.log('user: ', userId) ;
                const { [userId]: _, ...userList } = prevUserList ;

                console.log('new list: ', userList) ;
                return userList ;
            });
        });

        socket.on('user-connected', message => {
            setMessage(message) ;
            console.log('received') ;
        });

        socket.on('ack', message => {
            setRes(message) ;
            console.log(userList) ;
        });

        return () => {
            socket.off('retrive-user') ;
            socket.off('active') ;
            socket.off('user-connected') ;
            socket.off('ack') ;
        }
    }, []) ;

    return (
        <div className="h-screen flex flex-col gap-4 justify-center items-center bg-slate-50">
            <h1> { res } </h1>
            <h1> { message } </h1>
            <button className="bg-slate-300 p-5 rounded-md hover:bg-slate-400 active:bg-slate-300" onClick={handleClick}> test </button>
            <h1> { JSON.stringify(userList) } </h1>
        </div>
    );
}