"use client"

import SendRoundedIcon from '@mui/icons-material/SendRounded';

export default function TextInput() {
    return (
        <div className="relative ps-6 pe-20 py-4 outline outline-slate-300">
            <textarea className="w-full px-4 py-4 min-h-12 max-h-56 rounded-lg outline outline-slate-200 focus:outline-blue-300 duration-100 resize-none" placeholder="Say something..." />
            <div className="absolute h-8 w-8 top-[50%] -translate-y-[60%] right-5 hover:cursor-pointer rounded-full flex justify-center items-center">
                <SendRoundedIcon sx={{rotate: "-45deg", objectFit: "contain", width: "80%", height: "80%"}} />
            </div>
        </div>
    );
}