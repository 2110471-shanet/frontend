import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const backend_url = (process.env.NEXT_PUBLIC_SERVER_URL as string) ?? "http://localhost:8080"

export const getSocket = () => {
    if (!socket) 
        socket = io(backend_url, { 
            autoConnect: false, 
            withCredentials: true,
        });

    return socket;
};