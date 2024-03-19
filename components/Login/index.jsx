"use client";
import React, { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import styles from './login.module.css'
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMultiply
} from "@fortawesome/free-solid-svg-icons";
import LazyImage from "../LazyLoad";
import { ErrorMessage } from "../ErrorMessage";

export default function Login({showLogin,setShowLogin}) {

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const router=useRouter()
  const [errorMessage, setErrorMessage] = useState(null);


  const handleLogin = async () => {

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
       password
      );
      // Redirect or handle successful login
      
      setShowLogin(false)
      router.push('/dashboard')
    } catch (error) {
      setShowLogin(false)
      setErrorMessage("Please enter a correct username and password. Note that both fields may be case-sensitive.")
      console.error("Login error:", error.message);
    }
  };


  const isLoginDisabled = email === '' || password === ''; 
  return (
<>
<ErrorMessage    message={errorMessage}
        setMessage={(value) => {
          setErrorMessage(value);
        }}/>


      <div className={showLogin ? styles.loginOverlay : `${styles.loginOverlay} ${styles.hidden}`}>
        <div className={styles.loginContainer}>
        <LazyImage  onClick={()=>{setShowLogin(false)}} src="/LOG IN/2403-World-Cup-Web-LOG-IN-10.webp"      className={styles.closeIcon} width={100} height={100} />

          <h1>Log In</h1>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1 w-full">
            

              <div className="sm:col-span-5">
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e)=>{setEmail(e.target.value)}}
                    type="email"
                    autoComplete="email"
                   
                    placeholder="Email"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-5">
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="password"
                 value={password}
                 onChange={(e)=>{setPassword(e.target.value)}}
                    placeholder="Password"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
            
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
               
                <button
                onClick={()=>{handleLogin()}}
                  className="gold-button"
                  // disabled={isLoginDisabled}
                >
                  Log In
                </button>
              </div>
        </div>



      </div>
   </> 
  );
}
