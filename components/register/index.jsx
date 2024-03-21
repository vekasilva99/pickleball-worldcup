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
import PaymentFormWrapper from "../PaymentForm";
import { useRouter } from "next/navigation";
import { countryCodes } from "@/helpers/countryCodes";




const generateRandomPassword = () => {
    // Implement your logic to generate a random password
    // This is a simple example, and you might want to use a more robust solution
    return Math.random().toString(36).slice(-8);
  };


export default function Register({open,setOpen,team,setuser2}) {
  const { user, loading, getInfo } = useAuth();
  const router=useRouter()
  const [selectedDate, setSelectedDate] = useState(null);
  const [teamRef, setTeamRef] = useState(team ? team :null);
  const [showPayment, setShowPayment] = useState(team ? true : false);
  const [payNow, setPayNow] = useState(team ? true : false);
  const [teamData, setTeamData] = useState({
    coach: { name: "", last_name: "", email: "", phone:"",dupr:null,passport:"",date_of_arrival:null,airline:"",flight_number:"",shirt_size:"" },
    captain: { name: "", last_name: "", email: "", phone:"",dupr:null,passport:"",date_of_arrival:null,airline:"",flight_number:"",shirt_size:"" },
    pairs: [
      { name: "", last_name: "", email: "",phone:"",dupr:null,passport:"",date_of_arrival:null,airline:"",flight_number:"",shirt_size:""   },
    ],
  });


  useEffect(() => {
    if(team){
      setShowPayment(true)
      setPayNow(true)
    }
   
  }, [team]);
  const validateInput = () => {
    // Validate coach information
    if (!teamData.coach.name || !teamData.coach.last_name || !teamData.coach.email || !teamData.coach.phone) {
      alert("Coach information is incomplete. Please fill in all fields.");
      return false;
    }
  
    // Validate pairs information
    for (let i = 0; i < teamData.pairs.length; i++) {
      const pair = teamData.pairs[i];
      if (!pair.name || !pair.last_name || !pair.email || !pair.phone ) {
        alert(`Player ${i + 1} information is incomplete. Please fill in all fields.`);
        return false;
      }
    }
  
    // Validate email format for coach and pairs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(teamData.coach.email)) {
      alert("Coach email is not in a valid format.");
      return false;
    }
  
    for (let i = 0; i < teamData.pairs.length; i++) {
      if (!emailRegex.test(teamData.pairs[i].email)) {
        alert(`Player ${i + 1} email is not in a valid format.`);
        return false;
      }
    }
  
    return true;
  };

  
  const handleInputChange = (category, index, fieldName, value) => {

    //console.log('jnkhbgvbjnkml,',value)
    setTeamData((prevTeamData) => {
      const updatedData = { ...prevTeamData };

      if (category === "coach") {
        updatedData.coach[fieldName] = value;
      } else if (category === "captain") {
        updatedData.captain[fieldName] = value;
      }else if (category === "pairs") {
        updatedData.pairs[index][fieldName] = value;
      }

      return updatedData;
    });
  };

  const addPair = (e) => {
    e.preventDefault()
    if (teamData.pairs.length <= 7) {
      setTeamData((prevTeamData) => ({
        ...prevTeamData,
        pairs: [
          ...prevTeamData.pairs,
          { name: "", last_name: "", email: "",phone:"",dupr:null,passport:"",date_of_arrival:null,airline:"",flight_number:"",shirt_size:""   },
        ],
      }));
    }
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
        phone: memberData.phone,
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

const updateTeamMembers = async (newTeamRef, pairs, role,countryRef) => {
    try {
      const updatePromises = [];
  
      for (const pair of pairs) {
        const newUserRef = await registerTeamMember(newTeamRef, pair, role,countryRef);
        updatePromises.push(updateDoc(newTeamRef, { team_members: arrayUnion(newUserRef) }));
      }
  
      await Promise.all(updatePromises);
  
      //console.log("Team members updated successfully.");
    } catch (error) {
      console.error("Error updating team members:", error);
      throw error;
    }
  };

const saveTeamToFirebase = async (e) => {
    e.preventDefault()
    if (!validateInput()) {
      return;
    }
  try {
    // Create a new team in the database
    const countryRef = await doc(db, 'countries', user.country.id);
    const newTeamRef = await addDoc(collection(db, 'teams'),{country:countryRef,team_members:[]});
    setTeamRef(newTeamRef)

   // Update the team with the coordinator's UID
   
    const coordinatorReference = await doc(db, 'users', user.id);
    await updateDoc(newTeamRef,{coordinator:coordinatorReference});

    // // Update coach and pairs with their Firebase UID
    const coachData = await registerTeamMember(newTeamRef, teamData.coach,'8l9gFgT0smIiDSyCOzx6',countryRef);
    await updateDoc(newTeamRef,{ coach: coachData });
    
   
     const captainData = await registerTeamMember(newTeamRef, teamData.captain,'hmUMi4XcozY2qQx9DudP',countryRef);
     await updateDoc(newTeamRef,{ captain: captainData });
     await updateTeamMembers(newTeamRef, teamData.pairs, 'pnUrrBdDSsZEXX4tjjDd',countryRef);
     let auxUser=await getInfo(user)
     setuser2(auxUser)
    
     setShowPayment(true)
     
    return newTeamRef.key;
  } catch (error) {
    throw error;
  }
};

const handleRemovePair = (index) => {
  if (teamData.pairs.length >1){


  setTeamData((prevTeamData) => {
    const updatedPairs = [...prevTeamData.pairs];
    updatedPairs.splice(index, 1); // Remove the pair and the corresponding second member
    return { ...prevTeamData, pairs: updatedPairs };
  });
}
};
  
const sendEmail = async (email,password,coordinator,country,link) => {
  try {
    await axios.post('/api/send-email', {
      email: email,
      password: password,
      coordinator:coordinator,
      country:country,
      link:link
    });
    //console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};
const options = {
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "numeric",
		year: "numeric"
	}
}


  return (
    <div className={open ? `flex justify-center dark register-form-container ${styles.open}`:`flex justify-center dark register-form-container ${styles.close}`} >
      
      {!showPayment ?
      <form className="register-form">
        <div className="form-title-container">
          <h2>Create Team</h2>
        </div>
        <div className="form-container">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
              Coach Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 form-subtitle">
              Use an email address where they can receive their login
              information.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-first-name"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="coach-first-name"
                    name="coach-first-name"
                    autoComplete="given-name"
                    value={teamData.coach.name}
                    onChange={(e) =>
                      handleInputChange(
                        "coach",
                        null,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Enter first name"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-last-name"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="coach-last-name"
                    name="coach-last-name"
                    autoComplete="family-name"
                    value={teamData.coach.last_name}
                    onChange={(e) =>
                      handleInputChange(
                        "coach",
                        null,
                        "last_name",
                        e.target.value
                      )
                    }
                    placeholder="Enter last name"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-email"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="coach-email"
                    name="coach-email"
                    type="email"
                    autoComplete="email"
                    value={teamData.coach.email}
                    onChange={(e) =>
                      handleInputChange("coach", null, "email", e.target.value)
                    }
                    placeholder="Enter email address"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Code
                </label>
                <div className="mt-2">
                  <select
                    id="coach-phone"
                    name="coach-phone"
                    type="text"
                    autoComplete="phone"
                    value={teamData.coach.phone}
                    onChange={(e) =>
                      handleInputChange("coach", null, "phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                    {countryCodes.map((phone)=>{
 return <option value={phone.dial_code}>{phone.name} {phone.dial_code}</option>
                    })}
                   
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                 Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="coach-phone"
                    name="coach-phone"
                    type="text"
                    autoComplete="phone"
                    value={teamData.coach.phone}
                    onChange={(e) =>
                      handleInputChange("coach", null, "phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  DUPR Ranking
                </label>
                <div className="mt-2">
                  <input
                    id="coach-dupr"
                    name="coach-dupr"
                    type="number"
                    step={"0.1"}
                    min={'2.5'}
                    max={'5.4'}
                    value={teamData.coach.dupr}
                    onChange={(e) =>
                      handleInputChange("coach", null, "dupr", e.target.value)
                    }
                    placeholder="Enter DUPR Ranking"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Shirt Size
                </label>
                <div className="mt-2">
                  <select
                    id="coach-shirt-size"
                    name="coach-shirt-size"
                    type="text"
                    value={teamData.coach.shirt_size}
                    onChange={(e) =>
                      handleInputChange("coach", null, "shirt_size", e.target.value)
                    }
                    placeholder="Enter shirt size"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                    <option value={'XS'}>XS</option>
                    <option value={'S'}>S</option>
                    <option value={'M'}>M</option>
                    <option value={'L'}>L</option>
                    <option value={'XL'}>XL</option>
                    </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Passport
                </label>
                <div className="mt-2">
                  <input
                    id="coach-passport"
                    name="coach-passport"
                    type="text"
                    value={teamData.coach.passport}
                    onChange={(e) =>
                      handleInputChange("coach", null, "passport", e.target.value)
                    }
                    placeholder="Enter passport number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Date of Arrival
                </label>
                <div className="mt-2 relative">

                             

    <div className="datepicker">
      <Datepicker

        value={teamData.coach.date_of_arrival}
        onSelectedDateChanged={(e) =>{
          handleInputChange("coach", null, "date_of_arrival",format(e,'MM/dd/yyyy'))
        }
        }
    format={"MM/DD/YYYY"}
      />

    </div>


                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Airline
                </label>
                <div className="mt-2">
                  <input
                    id="coach-airline"
                    name="coach-airline"
                    type="text"
                    value={teamData.coach.airline}
                    onChange={(e) =>
                      handleInputChange("coach", null, "airline", e.target.value)
                    }
                    placeholder="Enter airline"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="coach-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Flight number
                </label>
                <div className="mt-2">
                  <input
                    id="coach-flight-number"
                    name="coach-flight-number"
                    type="text"
                    value={teamData.coach.flight_number}
                    onChange={(e) =>
                      handleInputChange("coach", null, "flight_number", e.target.value)
                    }
                    placeholder="Enter flight number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
              Captain Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 form-subtitle">
              Use an email address where they can receive their login
              information.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">


              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-first-name"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="captain-first-name"
                    name="captain-first-name"
                    autoComplete="given-name"
                    value={teamData.captain.name}
                    onChange={(e) =>
                      handleInputChange(
                        "captain",
                        null,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Enter first name"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-last-name"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="captain-last-name"
                    name="captain-last-name"
                    autoComplete="family-name"
                    value={teamData.captain.last_name}
                    onChange={(e) =>
                      handleInputChange(
                        "captain",
                        null,
                        "last_name",
                        e.target.value
                      )
                    }
                    placeholder="Enter last name"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-email"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="captain-email"
                    name="captain-email"
                    type="email"
                    autoComplete="email"
                    value={teamData.captain.email}
                    onChange={(e) =>
                      handleInputChange("captain", null, "email", e.target.value)
                    }
                    placeholder="Enter email address"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
Code                </label>
                <div className="mt-2">
                  <select
                    id="captain-phone"
                    name="captain-phone"
                    type="text"
                    autoComplete="phone"
                    value={teamData.captain.phone}
                    onChange={(e) =>
                      handleInputChange("captain", null, "phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                                  {countryCodes.map((phone)=>{
 return <option value={phone.dial_code}>{phone.name} {phone.dial_code}</option>
                    })}
                    </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Phone number
                </label>
                <div className="mt-2">
                  <input
                    id="captain-phone"
                    name="captain-phone"
                    type="text"
                    autoComplete="phone"
                    value={teamData.captain.phone}
                    onChange={(e) =>
                      handleInputChange("captain", null, "phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  DUPR Ranking
                </label>
                <div className="mt-2">
                  <input
                    id="captain-dupr"
                    name="captain-dupr"
                    type="number"
                    step={"0.1"}
                    min={'2.5'}
                    max={'5.4'}
                    value={teamData.captain.dupr}
                    onChange={(e) =>
                      handleInputChange("captain", null, "dupr", e.target.value)
                    }
                    placeholder="Enter DUPR Ranking"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Shirt Size
                </label>
                <div className="mt-2">
                  <select
                    id="captain-shirt-size"
                    name="captain-shirt-size"
                    type="text"
                    value={teamData.captain.shirt_size}
                    onChange={(e) =>
                      handleInputChange("captain", null, "shirt_size", e.target.value)
                    }
                    placeholder="Enter shirt size"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                          <option value={'XS'}>XS</option>
                    <option value={'S'}>S</option>
                    <option value={'M'}>M</option>
                    <option value={'L'}>L</option>
                    <option value={'XL'}>XL</option>
                    </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Passport
                </label>
                <div className="mt-2">
                  <input
                    id="captain-passport"
                    name="captain-passport"
                    type="text"
                    value={teamData.captain.passport}
                    onChange={(e) =>
                      handleInputChange("captain", null, "passport", e.target.value)
                    }
                    placeholder="Enter passport number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Date of Arrival
                </label>
                <div className="mt-2 relative">

                             

    <div className="datepicker">
      <Datepicker

        value={teamData.captain.date_of_arrival}
        onSelectedDateChanged={(e) =>{
          handleInputChange("captain", null, "date_of_arrival",format(e,'MM/dd/yyyy'))
        }
        }
    format={"MM/DD/YYYY"}
      />

    </div>


                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Airline
                </label>
                <div className="mt-2">
                  <input
                    id="captain-airline"
                    name="captain-airline"
                    type="text"
                    value={teamData.captain.airline}
                    onChange={(e) =>
                      handleInputChange("captain", null, "airline", e.target.value)
                    }
                    placeholder="Enter airline"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="captain-dupr"
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Flight number
                </label>
                <div className="mt-2">
                  <input
                    id="captain-flight-number"
                    name="captain-flight-number"
                    type="text"
                    value={teamData.captain.flight_number}
                    onChange={(e) =>
                      handleInputChange("captain", null, "flight_number", e.target.value)
                    }
                    placeholder="Enter flight number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
              Team Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600 form-subtitle">
              Use an email address where they can receive their login
              information.
            </p>

           
   



{Array.from({ length: teamData.pairs.length }, (_, index) => (
  <div key={index} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10">
    {/* First member of the pair */}
  
    <h2 className="text-base font-semibold leading-7 text-gray-900 sm:col-span-5 form-title">
              Player {index+1}
            </h2>
            {teamData.pairs.length > 1 &&
            <h2  onClick={()=>{handleRemovePair(index)}} style={{textAlign:'center', color:"#EFB810",cursor:"pointer",borderColor:'#EFB810',    width: 'max-content'}}  className="text-xs font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-100 opacity-80">
              Remove Player
            </h2>}
    
   
         
    <div className="sm:col-span-3">
      <label htmlFor={`pair-first-name-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
        First name
      </label>
      <div className="mt-2">
        <input
          type="text"
          id={`pair-first-name-${index}`}
          name={`pair-first-name-${index}`}
          autoComplete="given-name"
          value={teamData.pairs[index].name}
          onChange={(e) => handleInputChange('pairs', index, 'name', e.target.value)}
          placeholder="Enter first name"
          className="block w-full rounded-md sm:text-sm sm:leading-6 input"
        />
      </div>
    </div>

    <div className="sm:col-span-3">
      <label htmlFor={`pair-last-name-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
        Last name
      </label>
      <div className="mt-2">
        <input
          type="text"
          id={`pair-last-name-${index}`}
          name={`pair-last-name-${index}`}
          autoComplete="family-name"
          value={teamData.pairs[index].last_name}
          onChange={(e) => handleInputChange('pairs', index, 'last_name', e.target.value)}
          placeholder="Enter last name"
          className="block w-full rounded-md sm:text-sm sm:leading-6 input"
        />
      </div>
    </div>

    <div className="sm:col-span-3">
      <label htmlFor={`pair-email-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
        Email address
      </label>
      <div className="mt-2">
        <input
          id={`pair-email-${index}`}
          name={`pair-email-${index}`}
          type="email"
          autoComplete="email"
          value={teamData.pairs[index].email}
          onChange={(e) => handleInputChange('pairs', index, 'email', e.target.value)}
          placeholder="Enter email address"
          className="block w-full rounded-md sm:text-sm sm:leading-6 input"
        />
      </div>
    </div>

    <div className="sm:col-span-1">
                <label
                 htmlFor={`pair-phone-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Code
                </label>
                <div className="mt-2">
                  <select
                   id={`pair-phone-${index}`}
                   name={`pair-phone-${index}`}
                    type="text"
                    autoComplete="phone"
                    value={teamData.pairs[index].phone}
                    onChange={(e) => handleInputChange('pairs', index, 'phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                        {countryCodes.map((phone)=>{
 return <option value={phone.dial_code}>{phone.name} {phone.dial_code}</option>
                    })}
                    </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                 htmlFor={`pair-phone-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Phone number
                </label>
                <div className="mt-2">
                  <input
                   id={`pair-phone-${index}`}
                   name={`pair-phone-${index}`}
                    type="text"
                    autoComplete="phone"
                    value={teamData.pairs[index].phone}
                    onChange={(e) => handleInputChange('pairs', index, 'phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
             htmlFor={`pair-dupr-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  DUPR Ranking
                </label>
                <div className="mt-2">
                  <input
                     id={`pair-phone-${index}`}
                     name={`pair-phone-${index}`}
                    type="number"
                    step={"0.1"}
                    min={'2.5'}
                    max={'5.4'}
                    value={teamData.pairs[index].dupr}
                    onChange={(e) =>
                      handleInputChange('pairs', index, "dupr", e.target.value)
                    }
                    placeholder="Enter DUPR Ranking"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`pair-shirt-size-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Shirt Size
                </label>
                <div className="mt-2">
                  <select
                    id={`pair-shirt-size-${index}`}
                    name={`pair-shirt-size-${index}`}
                    type="text"
                    value={teamData.pairs[index].shirt_size}
                    onChange={(e) =>
                      handleInputChange("pairs", index, "shirt_size", e.target.value)
                    }
                    placeholder="Enter shirt size"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                          <option value={'XS'}>XS</option>
                    <option value={'S'}>S</option>
                    <option value={'M'}>M</option>
                    <option value={'L'}>L</option>
                    <option value={'XL'}>XL</option>
                    </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`pair-passport-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Passport
                </label>
                <div className="mt-2">
                  <input
                    id={`pair-passport-${index}`}
                    name={`pair-passport-${index}`}
                    type="text"
                    value={teamData.pairs[index].passport}
                    onChange={(e) =>
                      handleInputChange("pairs", index, "passport", e.target.value)
                    }
                    placeholder="Enter passport number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`pair-date-of-arrival-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Date of Arrival
                </label>
                <div className="mt-2">

    <div className="datepicker">
      <Datepicker

        value={teamData.pairs[index].date_of_arrival}
        onSelectedDateChanged={(e) =>{
          handleInputChange("pairs", index, "date_of_arrival",format(e,'MM/dd/yyyy'))
        }
        }
    format={"MM/DD/YYYY"}
      />

    </div>

               
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`pair-airline-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Airline
                </label>
                <div className="mt-2">
                  <input
                    id={`pair-airline-${index}`}
                    name={`pair-airline-${index}`}
                    type="text"
                    value={teamData.pairs[index].airline}
                    onChange={(e) =>
                      handleInputChange("pairs", index, "airline", e.target.value)
                    }
                    placeholder="Enter airline"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor={`pair-flight-number-${index}`}
                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                >
                  Flight number
                </label>
                <div className="mt-2">
                  <input
                    id={`pair-flight-number-${index}`}
                    name={`pair-flight-number-${index}`}
                    type="text"
                    value={teamData.pairs[index].flight_number}
                    onChange={(e) =>
                      handleInputChange("pairs", index, "flight_number", e.target.value)
                    }
                    placeholder="Enter flight number"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>

   
  </div>
))}

{teamData.pairs.length < 8 &&
        <div className="mt-6 flex items-center justify-end gap-x-6">
{/* 
        <button
         onClick={(e)=>{addPair(e)}}
         className="gold-button"
        >
          +  Add Pair
        </button> */}

        <h2    onClick={(e)=>{addPair(e)}} style={{textAlign:'center', color:"#000",cursor:"pointer",borderColor:'#EFB810',backgroundColor:'#EFB810'}}  className="text-sm font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-80 opacity-100">
        +  Add Player
            </h2>
      </div>}

       
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
      {!payNow &&<h3>Total: $350.00</h3>}
{payNow &&
<PaymentFormWrapper setuser2={(user)=>{setuser2(user)}} teamRef={teamRef} setOpen={()=>{setOpen(false)}} team={team}/>}
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
