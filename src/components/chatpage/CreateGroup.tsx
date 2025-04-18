"use client"

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import { useGlobalLoading } from '@/components/provider/GlobalLoadingProvider';

import { KeyboardEvent, useState } from 'react';
import { getSocket } from '@/lib/socket';

function checkForAlphabet(s: string) {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    alphabet += alphabet.toUpperCase();
    for (let i = 0; i < s.length; i++) {
        if (alphabet.includes(s[i])) {
            return true;
        }
    }
    return false;
}

export default function CreateGroup() {

    const { isLoading, setIsLoading } = useGlobalLoading();
    const [inputValue, setInputValue] = useState("");
    const [isSettingName, setIsSettingName] = useState(false);

    const socket = getSocket() ;

    async function handleSettingUsername(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            if (!checkForAlphabet(inputValue)) {
                setInputValue("");
                setIsSettingName(false);
            } else {
                setIsLoading(true);

                socket.emit('create-room', inputValue) ;
                setInputValue("");

                setIsSettingName(false);
                setIsLoading(false);
            }
        } else if (e.key === "Escape") {
            setInputValue("");
            setIsSettingName(false);
        }
    }

    return (
        <div className="w-full bg-white rounded-md outline outline-slate-200 duration-100 hover:outline-slate-400 hover:drop-shadow-sm h-20 shrink-0 flex justify-center items-center hover:cursor-pointer group px-4 py-4" onClick={(e) => {
            setIsSettingName(true);
        }}>
            <div className={`overflow-hidden ${(isSettingName)? "hidden": ""}`}>
                <AddCircleOutlineRoundedIcon className={`opacity-40 duration-100 group-hover:opacity-60`} sx={{height: "2rem", width: "2rem"}} />
            </div>
            <label className={`${(isSettingName)? "": "hidden"}`}><input value={inputValue} className="px-4 py-2 outline outline-slate-300 rounded-sm focus:outline-slate-400 duration-100" type="text" placeholder="group name" onChange={(e) => {
                setInputValue(e.target.value);
            }} onKeyDown={handleSettingUsername} /></label>
        </div>
    );
}