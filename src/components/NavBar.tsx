"use client"

import { KeyboardEvent, SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/provider/UserProvider";
import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";

import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import Link from "next/link";

import { League_Spartan } from "next/font/google";
import Image from "next/image";

import customAxios from "@/axios";
import { getSocket } from "@/lib/socket";

const league_spartan = League_Spartan({
    subsets: ["latin"],
    weight: ["600", "700", "800", "900"],
});

export default function NavBar({
    isChatSelectionShown,
    setIsChatSelectionShown,
}: {
    isChatSelectionShown: boolean,
    setIsChatSelectionShown: Function,
}) {
    const { username, setUsername } = useUser();
    const { isLoading, setIsLoading } = useGlobalLoading();
    const [ isSettingUsername, setIsSettingUsername ] = useState(false);

    const [ inputValue, setInputValue ] = useState("");

    const router = useRouter();

    const socket = getSocket();

    async function handleSettingUsername(e: KeyboardEvent<HTMLInputElement>) {
        e.stopPropagation();
        if (e.key === "Escape") {
            setInputValue("");
            setIsSettingUsername(false);
        } else if (e.key === "Enter") {
            if (inputValue === "") {
                setIsSettingUsername(false);
                setInputValue("");
            } else {
                setIsLoading(true);

                socket.emit('change-username', inputValue);

                setInputValue("");
                setIsLoading(false);
                setIsSettingUsername(false);
            }
        }
    }

    async function handleSignOut(e: SyntheticEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        try {
            setIsLoading(true);
            const res = await customAxios.get("/auth/logout");
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
        <nav className="z-30 w-full flex justify-between items-center bg-white border-b-1 border-slate-300 py-2">
            <div className="h-6 w-6 ms-6 hover:cursor-pointer lg:hidden" onClick={(e) => {
                setIsChatSelectionShown(!isChatSelectionShown);
            }}>
                <MenuRoundedIcon sx={{height: "100%", width: "100%"}} />
            </div>
            <Link href="/" className={`${league_spartan.className} text-xl font-bold me-6 lg:me-0 lg:ms-8`}>SHANET</Link>
            <div className="justify-center items-center me-6 lg:me-8 hidden lg:flex">
                <div className={`h-5 w-5 relative me-4 hover:cursor-pointer ${(isSettingUsername) ? "hidden": ""}`} onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSettingUsername(true);
                }}>
                    <CreateOutlinedIcon sx={{width: "100%", height: "100%", objectFit: "contain"}} />
                </div>
                <span className={`me-6 px-4 py-2 bg-blue-100 outline-1 h-10 rounded-md ${(isSettingUsername) ? "hidden": ""}`}>{username}</span>
                <input className={`px-4 py-2 outline-1 rounded-md me-4 hidden ${(isSettingUsername) ? "lg:block": "hidden"}`} type="text" value={inputValue} placeholder={username} onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                        setInputValue(e.target.value);
                    }
                }} onKeyDown={handleSettingUsername} />
                <button className="hover:cursor-pointer hover:underline" onClick={handleSignOut}>Sign Out</button>
            </div>
        </nav>
    );
}