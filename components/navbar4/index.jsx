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
        <LazyImage src="/logo.webp" width={200} height={200} onClick={()=>{router.push('/')}} />
        
        </div>
        <div className={styles.right}>
          <div className={styles.login}>
            
          {user && !loading &&  <h2 onClick={()=>{handleLogOut()}}
          >
            Log Out
          </h2>}
          {!user && !loading && <h2 onClick={()=>{setShowLogin(true)}}
          >
            Log In
          </h2 >}
          </div>

            {user && !loading && 
        <div className={styles.navlinksContainer}>
        <h2 onClick={()=>{router.push('/dashboard')}}>Dashboard</h2>
        
         
       
      
        </div>}
        </div>
      </div>

      <div className={styles.navbarSmall}>
        <div className={styles.logoContainer}>
        <img src="./logo.webp" onClick={()=>{router.push('/')}} />
        </div>
        <div className={styles.navlinksContainer}>
         
     
          {user && !loading &&  <h2 onClick={()=>{handleLogOut()}}
          >
            LOG OUT
          </h2>}
          {!user && !loading && <h2 onClick={()=>{setShowLogin(true)}}
          >
            LOG IN
          </h2 >}
          {user && !loading && 
          <div className={styles.menu} onClick={()=>{setShowMenu(true)}}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
          </div>}
        </div>
      </div>
      <div className={showMenu ? styles.navbarMobile : `${styles.navbarMobile} ${styles.hidden}`}>
      <FontAwesomeIcon
        onClick={()=>{setShowMenu(false)}}
                          icon={faMultiply}
                          className={styles.closeIcon}
                        />
        <div className={styles.navlinksContainer}>
        <h2 onClick={()=>{router.push('/dashboard')}}>Dashboard</h2>
      
        </div>
      </div>

     <Login setShowLogin={(value)=>{setShowLogin(value)}} showLogin={showLogin}/>
      </>
  );
}
