"use client"

import { createContext, useMemo, useState, useContext, useEffect } from "react";
import type { UserContextType } from "@/types";

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
    
    const [username, setUsername] = useState("loading");
    const [userId, setUserId] = useState("");
    const [currentUsername, setCurrentUsername] = useState<string>("");

    const contextValue = useMemo(() => ({ 
        username, userId, currentUsername,
        setUsername, setUserId, setCurrentUsername,
    }), [username, userId, currentUsername]);

    return (
        <UserContext value={contextValue}>
            {children}
        </UserContext>
    );
}