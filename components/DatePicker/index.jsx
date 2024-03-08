"use client";
import React, { useState } from "react";
import { Datepicker } from 'flowbite-react';

export default function DatePicker({showLogin,setShowLogin}) {
const [selectedDate,setSelectedDate]=useState('')

const handleInputChange=(date)=>{
  //console.log('njhbgvhbjnkm,lnb ')
setSelectedDate(date)
}
  return (


    <div className="datepicker">
    <Datepicker
      value={selectedDate}
      onSelectedDateChanged={handleInputChange}
      dateFormat="yyyy-MM-dd"
  
    />

  </div>
    
  );
}
