"use client";
import React, { useContext } from "react";
import styles from "./success.module.css";
import { Oval } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck,faMultiply } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
export const SuccessMessage = ({ message,setMessage }) => {
  return (
    <div
      className={
        message !=null
          ? styles.loaderContainer
          : `${styles.loaderContainer} ${styles.notLoading}`
      }
    >
      <div className={styles.messageContainer}>
      <FontAwesomeIcon
        onClick={()=>{setMessage(null)}}
                          icon={faMultiply}
                          className={styles.closeIcon}
                        />
        <div class="gradient-circle">
          <FontAwesomeIcon icon={faCheck} className="icon-success" />
        </div>
        <h2>{message}</h2>
      </div>
    </div>
  );
};
