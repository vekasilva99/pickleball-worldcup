"use client";
import React, { useContext } from "react";
import styles from "./success.module.css";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck,faMultiply } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import LazyImage from "../LazyLoad";
export const ErrorMessage = ({ message,setMessage }) => {
  return (
    <div
      className={
        message !=null
          ? styles.loaderContainer
          : `${styles.loaderContainer} ${styles.notLoading}`
      }
    >
      <div className={styles.messageContainer}>
      <LazyImage className={styles.closeIcon}      onClick={()=>{setMessage(null)}} src="/LOG IN/2403-World-Cup-Web-LOG-IN-10.webp"  width={200} height={200} />


        <div class="gradient-circle-success close">
       
          <LazyImage style={{objectFit:'contain'}}src="/close.png"    width={200} height={200} />

        </div>
        <h2>{message}</h2>
      </div>
    </div>
  );
};
