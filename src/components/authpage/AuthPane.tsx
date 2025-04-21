"use client"

import { SyntheticEvent, useState } from "react"
import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

import { League_Spartan } from "next/font/google";
import { CircularProgress } from "@mui/material";

import customAxios from "@/axios";

const league_spartan = League_Spartan({
    subsets: ["latin"],
    weight: ["600", "700", "800", "900"],
});

export default function SignUpPane({
    isSignUp
}: {
    isSignUp: boolean
}) {

    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const [isLocalLoading, setIsLocalLoading] = useState(false);

    const inputPasswordType = (isPasswordShown) ? "text" : "password";

    // dynamic texts and labels
    const pageLabel = (isSignUp) ? "Registration": "Sign In";
    const buttonLabel = (isSignUp) ? "Sign Up": "Sign In";

    async function handleSignUpButton(e: SyntheticEvent<HTMLButtonElement>) {
        e.stopPropagation();
        e.preventDefault();
        if (username.length <= 0) {
            setErrorMessage("username cannot be empty.");
        } else if (password.length <= 0) {
            setErrorMessage("password cannot be empty.");
        } else if (username.includes(" ")) {
            setErrorMessage("username cannot contain any space.");
        } else {
            setIsLocalLoading(true);

            try {
                const res = await customAxios.post("/auth/register", {
                    username: username,
                    password: password, 
                });
                router.push("/signin");
                await new Promise((resolve) => {
                    setTimeout(resolve, 100);
                });
                setIsLocalLoading(false);
            } catch {
                setErrorMessage("error happened");
                setIsLocalLoading(false);
            }
        }
    }

     async function handleSignInButton(e: SyntheticEvent<HTMLButtonElement>) {
        e.stopPropagation();
        e.preventDefault();
        if (username.length <= 0) {
            setErrorMessage("username cannot be empty.");
        } else if (password.length <= 0) {
            setErrorMessage("password cannot be empty.");
        } else if (username.includes(" ")) {
            setErrorMessage("username cannot contain any space.");
            // password containing empty will be checked by back end
        } else {
            try {
                setIsLocalLoading(true);
                const res = await customAxios.post("/auth/login", {
                    username: username,
                    password: password,
                });
                await new Promise((resolve) => {
                    setTimeout(resolve, 100);
                });
                console.log("huh!?")
                setIsLocalLoading(false);
                router.refresh();
            } catch {
                setErrorMessage("error happened");
                setIsLocalLoading(false);
            }
        }
    }

    const handleFunction = (isSignUp) ? handleSignUpButton: handleSignInButton;

    const linkNodes = (isSignUp) ? (
        <>
           <Link className="text-sm text-[#1A4789] hover:underline" href="/">Home</Link>
           <Link className="text-sm text-[#1A4789] hover:underline" href="signin">Already have an account?</Link> 
        </>
    ): (
        <>
            <Link className="text-sm text-[#1A4789] hover:underline" href="/">Home</Link>
            <Link className="text-sm text-[#1A4789] hover:underline" href="signup">Don't have an account?</Link>
        </>
    )
    if (!isLocalLoading) {

        return (
            <div className="h-[28rem] w-[32rem] bg-white rounded-md drop-shadow-md pt-16 relative px-6 md:px-10 lg:px-12">
                <h1 className={`${league_spartan.className} font-bold text-5xl text-slate-900 text-center`}>SHANET</h1>
                <h2 className="text-lg text-center">{pageLabel}</h2>
                <form className="flex flex-col w-full mt-4">
                    <input className="px-3 py-1 outline-2 outline-slate-100 rounded-md hover:bg-slate-50 focus:bg-slate-50 focus:outline-slate-200" value={username} type="text" placeholder="username" onChange={(e) => {
                        if (!e.target.value.includes(" ")) {
                            setUsername(e.target.value);
                            setErrorMessage("");
                        } 
                    }} />
                    <label className="relative mt-6">
                        <input className="ps-3 pe-12 py-1 outline-2 outline-slate-100 rounded-md hover:bg-slate-50 focus:bg-slate-50 focus:outline-slate-200 w-full" value={password} type={inputPasswordType} placeholder="password" onChange={(e) => {
                            if (!e.target.value.includes(" ")) {
                                setPassword(e.target.value);
                                setErrorMessage("");
                            }
                        }} />
                        <div className={`absolute right-4 top-1/2 -translate-y-[50%] h-6 w-6 hover:cursor-pointer ${(isPasswordShown)? "hidden": ""}`} onClick={(e) => {
                            setIsPasswordShown(!isPasswordShown);
                        }}>
                            <Image className="object-contain" src="/icons/visibility_off_black.png" fill={true} alt="show password button" />
                        </div>
                        <div className={`absolute right-4 top-1/2 -translate-y-[50%] h-6 w-6 hover:cursor-pointer ${(isPasswordShown)? "": "hidden"}`} onClick={(e) => {
                            setIsPasswordShown(!isPasswordShown);
                        }}>
                            <Image className="object-contain" src="/icons/visibility_on_black.png" fill={true} alt="show password button" />
                        </div>
                    </label>
                    <span className="text-red-500 text-sm mt-3 ms-2">{errorMessage}</span>
                    <button className="mt-4 px-4 py-2 bg-[#1A4789] hover:cursor-pointer active:bg-[#154284] text-white rounded-md" onClick={handleFunction}>{buttonLabel}</button>
                </form>
                <div className="w-full absolute bottom-12 left-0 h-6 px-6 md:px-10 lg:px-12 flex justify-between">
                    {linkNodes}
                </div>
            </div>
        );
    } else {
        return (
            <div className="h-[28rem] w-[32rem] bg-white rounded-md drop-shadow-md relative px-6 md:px-10 lg:px-12 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }
}