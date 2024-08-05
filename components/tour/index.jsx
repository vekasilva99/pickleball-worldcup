"use client";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import {db,auth} from '@/firebase/firebase'
import { collection, getDocs, doc, getDoc,where, collectionGroup,set,addDoc,updateDoc,arrayUnion,setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword,getAuth } from "firebase/auth";
import styles from './register.module.css'
import axios from "axios";
import { Datepicker } from 'flowbite-react';
import {format} from 'date-fns'
import PaymentFormWrapper from "../PaymentForm2";
import { useRouter } from "next/navigation";
import { countryCodes } from "@/helpers/countryCodes";




const generateRandomPassword = () => {
    // Implement your logic to generate a random password
    // This is a simple example, and you might want to use a more robust solution
    return Math.random().toString(36).slice(-8);
  };


export default function Tour({open,setOpen,team,setuser2}) {
  const { user, loading, getInfo } = useAuth();
  const router=useRouter()
  const [teamRef, setTeamRef] = useState(team ? team :null);
  const [showPayment, setShowPayment] = useState(team ? true : false);
  const [payNow, setPayNow] = useState(team ? true : false);
  const [teamData, setTeamData] = useState(['']);


  useEffect(() => {
    if(team){
      setShowPayment(true)
      setPayNow(true)
    }
   
  }, [team]);

  useEffect(() => {
    if(user){
      handleInputChange(0, `${user.name} ${user.last_name}`)
    }
   
  }, [user]);

  
  const handleInputChange = (index, value) => {

    setTeamData((prevTeamData) => prevTeamData.map((item, i) => i === index ? value : item));
  };

  const addPair = (e) => {
    e.preventDefault()
    setTeamData((prevTeamData) => [
      ...prevTeamData,
      ""
    ]);
  };

  // components/RegistrationForm.js

const registerTeamMember = async (newTeamRef, memberData, role,countryRef) => {
    
    try {
      // Create user account in Firebase Authentication
      const { email } = memberData;
      const password=generateRandomPassword()
      // const userCredential = await createUserWithEmailAndPassword(auth,email, password);
  
      // // Get the newly created user's UID
      // const userId = userCredential.user.uid;
      // //console.log(userId)
      const roleReference = await doc(db, 'roles', role);
      // Save additional information to the database
//console.log('mewjkcwm',memberData)
      const newUserRef = await addDoc(collection(db, 'users'),{
        name: memberData.name,
        last_name: memberData.last_name,
        email: memberData.email,  // Fix: Use the correct email field instead of last_name
        phone: memberData.phone_code+memberData.phone,
        dupr:Number(memberData.dupr),
        role: roleReference,     // Assign the user role
        country:countryRef,
        passport:memberData.passport,
        date_of_arrival:new Date(memberData.date_of_arrival),
        airline:memberData.airline,
        flight_number:memberData.flight_number,
        shirt_size:memberData.shirt_size 
        // Other user details
      });
      // const newUserRef = await setDoc(doc(db, "users", userId), {
      //   name: memberData.name,
      //   last_name: memberData.last_name,
      //   email: memberData.email,  // Fix: Use the correct email field instead of last_name
      //   phone: memberData.phone,
      //   dupr:Number(memberData.dupr),
      //   role: roleReference,     // Assign the user role
      //   // Other user details
      // }); 
     
    //console.log(newUserRef.id)
    sendEmail(memberData.email,password,user.name+" "+user.last_name,user.country.name,`https://www.copamundialdepickleball.com/${newUserRef.id}/${newTeamRef.id}`)
    // sendEmail(memberData.email,password,user.name+" "+user.last_name,user.country.name,`http://localhost:3000/${newUserRef.id}/${newTeamRef.id}`)
      return newUserRef;
    } catch (error) {
      throw error;
    }
  };

  // components/RegistrationForm.js

// const nodemailer = require('nodemailer');


const saveTeamToFirebase = async (e) => {
    e.preventDefault()

  try {
    const data = teamData.filter(item => item.trim() !== '')
    setTeamData((prevTeamData) => prevTeamData.filter(item => item.trim() !== ''));
    // Create a new team in the database
    const countryRef = await doc(db, 'countries', user.country.id);
    const newTourRef = await addDoc(collection(db, 'tour'),{country:countryRef,attendees: data, payment_status: false});
    setTeamRef(newTourRef)

   // Update the team with the coordinator's UID
   
    const userReference = await doc(db, 'users', user.id);
    await updateDoc(newTourRef,{user:userReference});

    // // Update coach and pairs with their Firebase UID

    
   
     setShowPayment(true)
     
    return newTourRef.key;
  } catch (error) {
    console.log('kjhugyftcdgvhbjnkml',error)
    throw error;
  }
};

const handleRemovePair = (index) => {
  if (teamData.length > 1){

    setTeamData((prevTeamData) => prevTeamData.filter((_, i) => i !== index));
}
};
  



  return (
    <div className={open ? `flex justify-center dark register-form-container ${styles.open}`:`flex justify-center dark register-form-container ${styles.close}`} >
      
      {!showPayment ?
      <form className="register-form">
        <div className="form-title-container">
          <h2>Lima City Tour</h2>
        </div>
        <div className="form-container">
        <div className="space-y-8">
          <div className="border-b border-gray-900/10 pb-2">
            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
            Date: October 28th
                        <br />
                        Start time: 8:30 a.m.
                       
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 form-subtitle">
            Includes:
                        <br />- Buffet lunch + 1 welcome cocktail.
                        <br />- Transportation
                        <br />- Entrance fees to tourist sites in the Historic Center of Lima “City of the Kings”.
                        <br />
                        <br />
                        Cost: USD 120.00
                        <br />
                        *Lunch does not include alcoholic beverages.
            </p>
          </div>

  

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
              Team Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 form-subtitle">
              Use an email address where they can receive their login
              information.
            </p>

           
   



{Array.from({ length: teamData.length }, (_, index) => (
  <div key={index} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10">
    {/* First member of the pair */}
  
            {teamData.length > 1 &&
            <h2  onClick={()=>{handleRemovePair(index)}} style={{textAlign:'center', color:"#EFB810",cursor:"pointer",borderColor:'#EFB810',    width: 'max-content'}}  className="text-xs font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-100 opacity-80">
              Remove
            </h2>}
    
   
         
    <div className="sm:col-span-6">
      <label htmlFor={`pair-first-name-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
        Full Name
      </label>
      <div className="mt-2">
        <input
          type="text"
          id={`pair-first-name-${index}`}
          name={`pair-first-name-${index}`}
          autoComplete="given-name"
          value={teamData[index]}
          onChange={(e) => handleInputChange(index, e.target.value)}
          placeholder="Enter full name"
          className="block w-full rounded-md sm:text-sm sm:leading-6 input"
        />
      </div>
    </div>


   
  </div>
))}

        <div className="mt-6 flex items-center justify-end gap-x-6">

        <h2    onClick={(e)=>{addPair(e)}} style={{textAlign:'center', color:"#000",cursor:"pointer",borderColor:'#EFB810',backgroundColor:'#EFB810'}}  className="text-sm font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-80 opacity-100">
        +  Add 
            </h2>
      </div>

       
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="secondary-button"
            onClick={()=>{setOpen()}}
          >
            Cancel
          </button>
          <button
          
            onClick={(e)=>{saveTeamToFirebase(e)}}
            className="gold-button"
          >
            Save
          </button>
        </div>
        </div>
      </form>
      : <form className={`register-form payment-form`}>
      <div className="form-title-container">
        <h2>Payment</h2>
      </div>
      <div className="form-container">
      {!payNow &&<h3>Total: ${teamData.length*120}.00 </h3>}
{payNow &&
<PaymentFormWrapper 
setuser2={(user) => {
  setuser2(user);
}}
teamRef={teamRef}
reservationRef={teamRef}
total={teamData.length*120}
setOpen={() => {
  setOpen(false);
}}
team={team}
/>}
{!payNow &&
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {/* <button
          type="button"
          className="secondary-button"
          onClick={()=>{setOpen();    router.refresh()}}
        >
          Pay Later
        </button> */}
        <button
        
          onClick={(e)=>{e.preventDefault();setPayNow(true)}}
          className="gold-button"
        >
          Pay Now
        </button>
      </div>}
      </div>
    </form>}
    </div>
  );
}
