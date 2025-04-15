import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const backend_url = (process.env.NEXT_PUBLIC_BACKEND_URL as string) ?? "http://localhost:8080"

export const getSocket = (username: string) => {
    if (!socket) 
        socket = io(backend_url, { auth: { token: username } });

    return socket;
};