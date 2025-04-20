"use client"

import customAxios from "@/axios";
import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";
import { getSocket } from "@/lib/socket";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent } from "react";
import { useUser } from "../provider/UserProvider";

export default function LinkGroup() {
    const { userId } = useUser();

    const { isLoading, setIsLoading } = useGlobalLoading();
    const router = useRouter();
    const socket = getSocket();

    async function handleSignOut(e: SyntheticEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        try {
            setIsLoading(true);
            const res = await customAxios.get("/auth/logout");
            socket.emit('signed-out', userId);
            router.push("signin");
            await new Promise((resolve) => {
                setTimeout(resolve, 100);
            });
            setIsLoading(false);
        } catch {
            setIsLoading(false);
        }
        setIsLoading(false);
    }

    return (
        <div className="lg:hidden flex w-full px-4 py-2 justify-between items-center outline outline-slate-300 bg-white">
            <Link className="text-sm h-full" href="/">Home</Link>
            <button className="text-sm h-full hover:cursor-pointer hover:underline" onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}