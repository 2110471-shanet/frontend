"use client"

import { io, Socket } from "socket.io-client" ;
import { createContext, useContext, useEffect, useMemo } from 'react' ;
import { getSocket } from "@/lib/socket";

const SocketContext = createContext<Socket | undefined>(undefined) ;

export function useSocket() {
    const context = useContext(SocketContext) ;
    if (!context)
        throw new Error("socket is accessed outside provider") ;

    return context ;
}

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode,
}) {
    const socket: Socket = useMemo<Socket>(() => { return getSocket(); }, []);

    useEffect(() => {
        return () => {
            socket?.disconnect()
        }
    }, [])

    return (
        <SocketContext value={socket}>
            { children }
        </SocketContext>
    )
}