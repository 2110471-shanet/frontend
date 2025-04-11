"use client"

import { createContext, useMemo, useState, useContext, useEffect } from "react";
import { useGlobalLoading } from "./GlobalLoadingProvider";

type UsernameContextType = {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
};

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

export const useUsername = () => {
    const context = useContext(UsernameContext);
    if (!context) {
        throw new Error("useUsername must be used within a UsernameProvider");
    }
    return context;
};

export default function UsernameProvider({
    children
}: {
    children: React.ReactNode
}) {
    
    const {isLoading, setIsLoading} = useGlobalLoading();
    const [username, setUsername] = useState("");

    const contextValue = useMemo(() => ({ username, setUsername }), [username]);

    useEffect(() => {
        async function testLoadUsername() {
            setIsLoading(true);
            await new Promise((resolve) => {
                setTimeout(resolve, 3000);
            });
            setUsername("Jojo");
            setIsLoading(false);
        };
        testLoadUsername();
    }, [])

    return (
        <UsernameContext value={contextValue}>
            {children}
        </UsernameContext>
    );
}