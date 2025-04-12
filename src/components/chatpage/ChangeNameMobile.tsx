"use client"

import { useState } from "react";

import { useUsername } from "@/components/provider/UsernameProvider";
import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";

import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';

export default function ChangeNameMobile() {

    const { username, setUsername } = useUsername();
    const { isLoading, setIsLoading } = useGlobalLoading();

    const [ isSettingUsername, setIsSettingUsername ] = useState(false);
    const [ inputValue, setInputValue ] = useState("");

    return (
        <div className="w-full px-4 py-2 outline outline-slate-300 bg-white max-w-60 lg:hidden">
            {/* showing */}
            <div className="flex w-full justify-between items-center">
                <div className="flex items-center flex-1 min-w-0">
                    <div className="h-6 w-6 relative shrink-0">
                        <AccountBoxRoundedIcon sx={{ height: "100%", width: "100%" }} />
                    </div>
                    <span className="truncate mt-1 ms-2 flex-1">{username}</span>
                </div> 
                <div className="h-6 w-6 relative hover:cursor-pointer">
                    <CreateRoundedIcon sx={{height: "100%", width: "100%", objectFit: "contain",}} />
                </div>
            </div>
            {/* setting */}
            <div>

            </div>
        </div>
    );
}