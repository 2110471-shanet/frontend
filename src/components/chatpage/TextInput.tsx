"use client"

import { useChatSelectionState, useMessages } from '@/app/chat/pageContext';
import { getSocket } from '@/lib/socket';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { KeyboardEvent, SyntheticEvent, useState } from 'react';
import { useUser } from '../provider/UserProvider';

export default function TextInput() {
    const [inputValue, setInputValue] = useState<string>('') ;
    
    const { selectedChat, setSelectedChat, isSelectedDirectChat } = useChatSelectionState() ;
    const { messages, setMessages } = useMessages() ;
    const { userId, username } = useUser() ;

    const socket = getSocket() ;

    function sendDirectMessage() {
        socket.emit('send-direct-message', inputValue, selectedChat, async (message: string) => {
            // console.log(message) ;
        });
    }

    function sendGroupMessage() {
        socket.emit('send-message', inputValue, selectedChat, async (message: string) => {
            // console.log(message) ;
        });
    }

    function sendMessageHandler() {
        if (inputValue.trim() === '') {
            return ;
        }

        if (isSelectedDirectChat) {
            sendDirectMessage();
        } else {
            sendGroupMessage();
        }

        setInputValue('') ;
    }

    function sendMessageHandlerShortcut(e: KeyboardEvent<HTMLTextAreaElement>) {
        // called when "enter"
        if (e.key === "Enter") {
            if (e.shiftKey) {
                return;
            } else {
                e.preventDefault();

                if (inputValue.trim() === '') {
                    return ;
                }

                if (isSelectedDirectChat) {
                    sendDirectMessage();
                } else {
                    sendGroupMessage();
                }
        
                setInputValue('') ;
            }
        }
    }

    function typingHandler() {
        // console.log(selectedChat);
        socket.emit('typing', username, selectedChat);
    }

    function stopTypingHandler(e: SyntheticEvent<HTMLTextAreaElement>) {
        // console.log('stop typing');
        socket.emit('stop-typing', username, selectedChat);
    }

    return (
        <div className="relative ps-6 pe-20 py-4 outline outline-slate-300">
            <textarea 
                className="w-full px-4 py-4 min-h-12 max-h-56 rounded-lg outline outline-slate-200 focus:outline-blue-300 duration-100 resize-none" 
                placeholder="Say something..." 
                value={inputValue}
                onKeyDown={sendMessageHandlerShortcut}
                onFocus={typingHandler}
                onBlur={(e) => {
                    // e.stopPropagation();
                    stopTypingHandler(e);
                }}
                onChange={(e) => {
                    setInputValue(e.target.value) ;
                }}
            />
            <button 
                className="absolute h-8 w-8 top-[50%] -translate-y-[60%] right-5 hover:cursor-pointer rounded-full flex justify-center items-center"
                onClick={sendMessageHandler}
            >
                <SendRoundedIcon sx={{rotate: "-45deg", objectFit: "contain", width: "80%", height: "80%"}} />
            </button>
        </div>
    );
}