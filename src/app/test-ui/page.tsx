"use client"

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { useState } from 'react';

export default function TestUI() {

    const [testMessage, setTestMessage] = useState("");

    return (
        <div className="flex flex-col gap-8 min-h-[100dvh] justify-center items-center bg-slate-50">
            <label className="relative w-60">
                <input className="rounded-sm outline outline-slate-300 focus:outline-slate-500 ps-8 pe-4 py-2 bg-white drop-shadow-sm hover:drop-shadow-md duration-100 focus:drop-shadow-md" type="text" placeholder="search..." />
                <div className="absolute left-4 top-[calc(50%+1px)] -translate-[50%] w-6 h-6 flex justify-center items-center">
                    <SearchRoundedIcon sx={{width: "80%", height: "80%"}} />
                </div>
            </label>
            <div className="w-48 h-48 bg-orange-200 rounded-md outline outline-slate-300 drop-shadown-sm duration-200 hover:drop-shadown-lg hover:-translate-2 hover:bg-blue-200 hover:outline-slate-500" onMouseEnter={(e) => {
                setTestMessage(testMessage + "\nha!")
            }}>

            </div>
            <h1 className="whitespace-pre-wrap">{testMessage}</h1>
        </div>
    );
}