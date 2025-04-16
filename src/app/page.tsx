"use client"

import { useState } from "react";

import Link from "next/link";

import { League_Spartan } from "next/font/google";
import Image from "next/image";

const league_spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export default function Home() {

  const [secretCode, setSecretCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isReveal, setIsReveal] = useState(false);

  const hiddenCode = "boasbyte25129";

  return (
    <div className="">
      <nav className="w-full">
        <div className="max-w-screen-xl mx-auto border-b-1 border-slate-200 flex justify-end items-center">
          <Link className="py-2 px-4 hover:cursor-pointer hover:underline" prefetch={true} href="/chat">chat</Link>
        </div>
      </nav>
      <div className="max-w-screen-xl mx-auto py-8 px-4">
        <h1 className={`${league_spartan.className} text-bold text-3xl`}>SHANET</h1>
        <h2 className="text-xl mt-4">Student Info</h2>
        <ul className="mt-2">
          <li>6330080621 Chanathip Kulsirilak</li>
          <li>6532091021 Thanaphat Manoim</li>
          <li>6530007021 Korawit Bhatanaprabhabhan</li>
          <li>6532125821 Peneik Sitthimongkhon</li>
        </ul>
        <h2 className="text-xl mt-4">Enter the secret code to review the debugging page</h2>
        <label className="flex gap-4 my-2">
          <input className="min-w-40 outline outline-slate-200 px-3 py-1 rounded-sm" value={secretCode} type="text" placeholder="enter the secret code..." onChange={(e) => {
            setSecretCode(e.target.value);
            setErrorMessage("");
          }} />
          <button className="px-3 py-1 bg-green-700 text-white rounded-sm drop-shadow-sm hover:cursor-pointer hover:bg-green-800 active:bg-green-900" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isReveal) {
              if (secretCode === hiddenCode) {
                setIsReveal(true);
              } else {
                setErrorMessage("wrong code")
              }
            }
          }}>enter</button>
        </label>
        <label className="text-red-700 text-sm ms-1 inline-block">{errorMessage}</label>
        <div className={`flex gap-4 flex-col ${(isReveal)? "": "hidden"} items-start`}>
          <Link target="_blank" className="px-3 py-1 bg-blue-600 text-white rounded-sm" href="/test-context">Test Context</Link>
          <Link target="_blank" className="px-3 py-1 bg-blue-600 text-white rounded-sm" href="/test-ui">Test UI</Link>
          <Link target="_blank" className="px-3 py-1 bg-blue-600 text-white rounded-sm" href="/test-socket">Test Socket</Link>
        </div>
      </div>
    </div>
  );
}
