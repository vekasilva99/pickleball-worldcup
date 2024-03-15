// pages/index.js
"use client"
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter,useParams } from "next/navigation";
import Navbar from "@/components/navbar2";
import Login from "@/components/LoginFirstTime2";
import Footer from "@/components/footer2";

export default function Home() {
  const router = useRouter();
  const params=useParams()
//console.log('mkjnhbgvbjnkml',params )
  return (
    <main className="flex min-h-screen main">
      <Navbar/>
        <Login  showLogin={true}/>
        <Footer/>
     
    </main>
  );
}
