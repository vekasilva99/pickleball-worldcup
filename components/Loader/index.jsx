"use client";
import React, { useContext } from "react";
import styles from './loader.module.css'
import { Oval } from 'react-loader-spinner'

export const Loader = ({ loading }) => {
  return (
    <div className={loading ? styles.loaderContainer : `${styles.loaderContainer} ${styles.notLoading}`}>
      <Oval
        height="80"
        width="80"
        radius="9"
        color='rgba(244, 185, 74, 1)'
        secondaryColor="rgba(254, 247, 190, 1)"
        ariaLabel='Oval-loading'
        style={/* Add your style object here */{}}
        wrapperStyle={/* Add your wrapperStyle object here */{}}
        wrapperClassName={/* Add your wrapperClassName string here */""}
      />
    </div>
  );
}
