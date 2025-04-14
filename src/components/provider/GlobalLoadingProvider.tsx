"use client"

import { CircularProgress } from "@mui/material";
import { createContext, useMemo, useState, useContext } from "react";

import type { GlobalLoadingContextType } from "@/types";

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function useGlobalLoading() {
    const context = useContext(GlobalLoadingContext);
    if (!context) {
        throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
    }
    return context;
};

export default function GlobalLoadingProvider({
    children,
}: {
    children: React.ReactNode,
}) {

    const [isLoading, setIsLoading] = useState(false);

    const contextValue = useMemo(() => ({ isLoading, setIsLoading }), [isLoading]);

    return (
        <div className="relative">
            <div className={`absolute top-0 left-0 h-screen w-full bg-white z-70 flex justify-center items-center ${(isLoading) ? "": "hidden"}`}>
                <CircularProgress />
            </div>
            <GlobalLoadingContext value={contextValue}>
                {children}
            </GlobalLoadingContext>
        </div>
    );
}