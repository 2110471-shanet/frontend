"use client"

import { createContext, useMemo, useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGlobalLoading } from "./GlobalLoadingProvider";
import type { UserContextType } from "@/types";
import customAxios from "@/axios";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UsernameProvider");
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
    const [userId, setUserId] = useState("");

    const contextValue = useMemo(() => ({ username, userId, setUsername, setUserId }), [username, userId]);

    const pathname = usePathname();

    useEffect(() => {
        const skipPaths = ["/signin", "/signup", "/test-ui", "/"];
        if (skipPaths.includes(pathname)) {
            return;
        }

        async function loadUser() {
            setIsLoading(true) ;
            const res = await customAxios.get('/api/user') ;

            setUsername(res.data.user.username) ;
            setIsLoading(false) ;
        }

        loadUser() ;
    }, [pathname])

    return (
        <UserContext value={contextValue}>
            {children}
        </UserContext>
    );
}