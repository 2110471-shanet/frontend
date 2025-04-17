"use client"

import { createContext, useMemo, useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGlobalLoading } from "./GlobalLoadingProvider";

import type { UsernameContextType } from "@/types";
import customAxios from "@/axios";

const UserContext = createContext<UsernameContextType | undefined>(undefined);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUsername must be used within a UsernameProvider");
    }
    return context;
};

export default function UserProvider({
    children,
}: {
    children: React.ReactNode,
}) {
    
    const {isLoading, setIsLoading} = useGlobalLoading();
    const [username, setUsername] = useState("loading");
    const [userId, setUserId] = useState('loading');

    const contextValue = useMemo(() => ({ username, setUsername, userId, setUserId }), [username, userId]);

    const pathname = usePathname();

    useEffect(() => {
        const skipPaths = ["/signin", "/signup", "/test-ui"];
        if (skipPaths.includes(pathname)) {
            return;
        }
        async function testLoadUsername() {
            setIsLoading(true);
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            setUsername("LindaLunda");
            setIsLoading(false);
        };
        // testLoadUsername();

        async function loadUser() {
            setIsLoading(true) ;
            const res = await customAxios.get('/api/user') ;

            console.log(res)

            setUsername(res.data.user.username) ;
            setIsLoading(false) ;
        }

        loadUser() ;
    }, [])

    return (
        <UserContext value={contextValue}>
            {children}
        </UserContext>
    );
}