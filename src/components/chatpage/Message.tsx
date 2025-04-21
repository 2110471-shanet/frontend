"use client"

import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';

import { useState, useEffect } from 'react';

export default function Message({
    isMe,
    sender,
    message,
}: {
    isMe: boolean,
    sender: string,
    message: string,
}) {

    // current situation:
    // if only localMessage is used, whitespace-pre-wrap works
    // but if message is used, it won't work
    // even if message is used to set localMessage, it won't work either
    // magic shit

    // I have to do this because "whitesapce-pre-wrap doesn't work with text from props"
    // const [localMessage, setLocalMessage] = useState("");
    // useEffect(() => {
    //     setLocalMessage(message);
    // }, [message])
    // no I was wrong

    if (isMe) {
        return (
            <div className="w-full flex justify-end">
                <div className="py-2 px-4 my-2 bg-blue-300 rounded-md w-fit max-w-4/5 whitespace-pre-wrap break-all">
                    {message}
                </div>
            </div>
        );
    } else {
        return (
            <div className="w-full flex items-start">
                <div className="h-8 w-8 relative shrink-0 rounded-full bg-blue-300 flex justify-center items-center">
                    <Person2RoundedIcon sx={{width: "80%", height: "80%", color: "white", }} />
                </div>
                <div className="flex flex-col flex-1 ms-2">
                    <span>{sender}</span>
                    <div className="max-w-4/5 w-fit py-2 px-4 text-black bg-blue-200 rounded-md whitespace-pre-wrap break-all">
                        {message}
                    </div>
                </div>
            </div>
        );
    }
}