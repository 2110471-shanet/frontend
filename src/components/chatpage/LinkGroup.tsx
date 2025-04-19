"use client"

import { useGlobalLoading } from "@/components/provider/GlobalLoadingProvider";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent } from "react";

export default function LinkGroup() {

    const { isLoading, setIsLoading } = useGlobalLoading();
    const router = useRouter();

    async function handleSignOut(e: SyntheticEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });
        await router.push("/signin");
        setIsLoading(false);
    }

    return (
        <div className="lg:hidden flex w-full px-4 py-2 justify-between items-center outline outline-slate-300 bg-white">
            <Link className="text-sm h-full" href="/">Home</Link>
            <button className="text-sm h-full hover:cursor-pointer hover:underline" onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}