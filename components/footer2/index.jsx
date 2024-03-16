"use client";
import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import styles from './navbar.module.css'
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import Login from "../Login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMultiply
} from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../Loader";
import LazyImage from "../LazyLoad";

export default function Footer() {

  const { user, loading,setLoading } = useAuth();
  const router = useRouter();
  const [showLogin,setShowLogin]=useState(false)
  const [showMenu, setShowMenu]=useState(false)




  const handleLogOut = async () => {
    setLoading(true)
    signOut(auth).then(() => {
router.push('/')
setLoading(false)
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  };


  return (
    <>

    <div className={styles.footer}>
  
  
  <div className={styles.content1}>
  <LazyImage src="/footer2/2403-World-Cup-Web-LOG-IN-14.webp" width={300} height={300}  />
 
    <h4>© PICKLEBALL WORLD CUP<br/>Lima - Perú<br/>All Rights Reserved
<br/>Privacy Policy</h4>
  </div>
  <div className={styles.content3}>
  <LazyImage src="/footer2/2403-World-Cup-Web-LOG-IN-18.webp" width={100} height={100}  />
  {/* <LazyImage src="/footer2/2403-World-Cup-Web-LOG-IN-16.webp" width={100} height={100}   /> */}
  <LazyImage src="/footer2/2403-World-Cup-Web-LOG-IN-15.webp" width={100} height={100}   />
  {/* <LazyImage src="/footer2/2403-World-Cup-Web-LOG-IN-17.webp" width={100} height={100}   /> */}

  </div>
      </div>

  
      </>
  );
}
