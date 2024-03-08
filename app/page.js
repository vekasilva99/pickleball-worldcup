// pages/index.js
"use client"
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter,useParams } from "next/navigation";
import Navbar from "@/components/navbar";

export default function Home() {
  const router = useRouter();
  const params=useParams()
//console.log('mkjnhbgvbjnkml',params )
  return (
    <main className="flex min-h-screen main">
      <Navbar />
      <div className="home">
        <div className="column-55">
          <div></div>
        <video autoPlay muted controls={false}>
        <source src="https://firebasestorage.googleapis.com/v0/b/pickleball-worldcup.appspot.com/o/IMG_2678.MOV?alt=media&token=9872fa82-65bc-410d-bd08-a5a5cca41db3" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
        </div>
        <div className="column-45">
          <div className="row">
            <img src="/peru/SANG1631.webp"/>
            <div>
            <h2>Perú campeón en casa</h2>
            <h3>Perú gana la copa en el 1er mundial de pickleball de la historia.</h3>
            </div>
          </div>
          <div className="row">
            <img src="/DSC_3206.webp" />
            <div>
            <h4>Así se vivio la conferencia de prensa</h4>
            </div>
       
          </div>
        </div>
      </div>
    </main>
  );
}


