// pages/index.js
"use client"
import React from "react";
import { useRouter,useParams } from "next/navigation";
import Navbar from "@/components/navbar2-senior";
import Login from "@/components/LoginFirstTime2-senior";
import Footer from "@/components/footer2";

export default function Home() {

//console.log('mkjnhbgvbjnkml',params )
  return (
    <main className="flex min-h-screen main">
      <Navbar/>
        <Login  showLogin={true}/>
        <Footer/>
     
    </main>
  );
}
