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
import { Loader } from "../Loader2";
import LazyImage from "../LazyLoad";

export default function Navbar() {

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
    <Loader  loading={loading}/>
    <div className={styles.navbar}>
        <div className={styles.logoContainer}>
        <LazyImage src="/2403 World Cup - Web SENIOR EDITION-07.png" width={300} height={300}  />
        
        </div>

          <div className={styles.login}>
          {user && !loading &&  <h2 onClick={()=>{handleLogOut()}}
          >
            Log Out
          </h2>}
    
   
      
        </div>
      </div>

      <div className={styles.navbarSmall}>
        <div className={styles.logoContainer}>
        <LazyImage src="/2403 World Cup - Web SENIOR EDITION-07.png" width={100} height={100}  />
        
        </div>
        <div className={styles.navlinksContainer}>
         
     
          {user && !loading &&  <h2 onClick={()=>{handleLogOut()}}
          >
            LOG OUT
          </h2>}
  
       
        </div>
      </div>

      </>
  );
}
