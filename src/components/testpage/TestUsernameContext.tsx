"use client"

import { useUser } from "@/components/provider/UserProvider";
import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";

export default function TestUsernameContext() {

    const {username, setUsername} = useUser();
    const {isLoading, setIsLoading} = useGlobalLoading();

    return (
        <div className="flex flex-col justify-center items-center">
            <span className="mb-4 text-2xl">{username}</span>
            <button className="px-4 py-2 rounded-md bg-blue-400 hover:cursor-pointer hover:bg-blue-500 duration-100 active:bg-blue-600" onClick={(e) => {
                setUsername(username + " Yo!");
            }}>Click Me</button>
            <button className="px-4 py-2 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 duration-100 active:bg-red-700 text-white mt-4" onClick={async (e) => {
                setIsLoading(true);
                await new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                });
                setIsLoading(false);
            }}>Fake Loading</button>
        </div>
    );
}