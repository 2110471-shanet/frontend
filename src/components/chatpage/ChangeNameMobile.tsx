"use client"

import { KeyboardEvent, useState, useEffect } from "react";

import { useUser } from "@/components/provider/UserProvider";
import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";

import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';

export default function ChangeNameMobile({
    isChatSelectionShown
}: {
    isChatSelectionShown: boolean
}) {

    const { username, setUsername } = useUser();
    const { isLoading, setIsLoading } = useGlobalLoading();

    const [ isSettingUsername, setIsSettingUsername ] = useState(true);
    const [ inputValue, setInputValue ] = useState("");

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
                await new Promise((resolve) => {
                    setTimeout(resolve, 500);
                });
                setUsername(inputValue);
                setInputValue("");
                setIsLoading(false);
                setIsSettingUsername(false);
            }
        }
    }

    useEffect(() => {
        if (!isChatSelectionShown) {
            setIsSettingUsername(false);
            setInputValue("");
        }
    }, [isChatSelectionShown])

    return (
        <div className="w-full px-4 py-2 outline outline-slate-300 bg-white max-w-64 lg:hidden">
            {/* showing */}
            <div className={`w-full justify-between items-center pb-1 ${(isSettingUsername)? "hidden": "flex"}`}>
                <div className="flex items-center flex-1 min-w-0">
                    <div className="h-6 w-6 relative shrink-0">
                        <AccountBoxRoundedIcon sx={{ height: "100%", width: "100%" }} />
                    </div>
                    <span className="truncate mt-1 ms-2 flex-1">{username}</span>
                </div> 
                <div className="h-6 w-6 relative hover:cursor-pointer" onClick={(e) => {
                    setIsSettingUsername(true);
                }}>
                    <CreateRoundedIcon sx={{height: "100%", width: "100%", objectFit: "contain",}} />
                </div>
            </div>
            {/* setting */}
            <div className={`w-full justify-between items-center py-1 ${(isSettingUsername)? "flex": "hidden"}`}>
                <input className="w-full truncate outline outline-slate-300 px-1" type="text" value={inputValue} placeholder={username} onChange={(e) => {
                    if (!e.target.value.includes(" ")) {
                        setInputValue(e.target.value);
                    }
                }} onKeyDown={handleSettingUsername} />
                <div className="h-6 w-6 bg-green-500 shrink-0 ms-2 hover:cursor-pointer rounded-sm" onClick={async (e) => {
                    if (inputValue === "") {
                        setIsSettingUsername(false);
                        setInputValue("");
                    } else {
                        setIsLoading(true);
                        await new Promise((resolve) => {
                            setTimeout(resolve, 500);
                        });
                        setUsername(inputValue);
                        setInputValue("");
                        setIsLoading(false);
                        setIsSettingUsername(false);
                    }
                }}>
                    <DoneRoundedIcon sx={{height: "100%", width: "100%", objectFit: "contain", color: "white",}} />
                </div>
                <div className="h-6 w-6 bg-red-500 shrink-0 ms-2 hover:cursor-pointer rounded-sm" onClick={async (e) => {
                    setIsSettingUsername(false);
                    setInputValue("");
                }}>
                    <ClearRoundedIcon sx={{height: "100%", width: "100%", objectFit: "contain", color: "white",}} />
                </div>
            </div>
        </div>
    );
}