// pages/index.js
"use client"
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter,useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Login from "@/components/LoginFirstTime";

export default function Home() {
  const router = useRouter();
  const params=useParams()
//console.log('mkjnhbgvbjnkml',params )
  return (
    <main className="flex min-h-screen main">
        <Login  showLogin={true}/>
      <Navbar />
      <div className="home">

        <div className="column-55"></div>
        <div className="column-45">
          <div className="row"></div>
          <div className="row"></div>
        </div>
      </div>
    </main>
  );
}
