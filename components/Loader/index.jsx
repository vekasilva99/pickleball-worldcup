"use client";
import React, { useContext } from "react";
import styles from './loader.module.css'
import { Oval } from 'react-loader-spinner'

export const Loader = ({ loading }) => {

  return (
    <div className={loading ? styles.loaderContainer : `${styles.loaderContainer} ${styles.notLoading}`}>
      <div className={styles.loader}>
        <img src="/loading page/2403 World Cup - Web LOG IN-11.webp"/>
      <Oval
        height="100"
        width="100"
        radius="9"
        color='rgba(239, 184, 16, 1)'
        secondaryColor="rgba(0,0, 0, 1)"
        ariaLabel='Oval-loading'
        style={/* Add your style object here */{}}
        wrapperStyle={/* Add your wrapperStyle object here */{}}
        wrapperClassName={/* Add your wrapperClassName string here */""}
      />
      </div>
    </div>
  );
}
