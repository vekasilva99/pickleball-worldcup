// pages/protected.js
"use client";
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faPlus,
  faPlusCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the styles
import { Datepicker } from "flowbite-react";
import { format } from "date-fns";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  where,
  collectionGroup,
  set,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Navbar from "@/components/navbar";
import { Loader } from "@/components/Loader";
import Register from "@/components/register";
import axios from "axios";
import { SuccessMessage } from "@/components/SuccessMessage";

const generateRandomPassword = () => {
  // Implement your logic to generate a random password
  // This is a simple example, and you might want to use a more robust solution
  return Math.random().toString(36).slice(-8);
};

const ProtectedPage = () => {
  const [teamData, setTeamData] = useState({
    coordinator: {
      name: "",
      last_name: "",
      email: "",
      phone: "",
      dupr: null,
      passport: "",
      date_of_arrival: null,
      airline: "",
      flight_number: "",
      shirt_size: "",
    },
    coach: {
      name: "",
      last_name: "",
      email: "",
      phone: "",
      dupr: null,
      passport: "",
      date_of_arrival: null,
      airline: "",
      flight_number: "",
      shirt_size: "",
    },
    captain: {
      name: "",
      last_name: "",
      email: "",
      phone: "",
      dupr: null,
      passport: "",
      date_of_arrival: null,
      airline: "",
      flight_number: "",
      shirt_size: "",
    },
    pairs: [
      {
        name: "",
        last_name: "",
        email: "",
        phone: "",
        dupr: null,
        passport: "",
        date_of_arrival: null,
        airline: "",
        flight_number: "",
        shirt_size: "",
      },
    ],
  });
  const [edit, setEdit] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [register, setRegister] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showCaptain, setShowCaptain] = useState(false);
  const [showCoordinator, setShowCoordinator] = useState(false);
  const [showPairs, setShowPairs] = useState([false, false, false, false]);
  const [teamRef,setTeamRef]=useState(null)

  const fillData = () => {
    setTeamData((prevTeamData) => {
      const updatedData = { ...prevTeamData };

      updatedData.coach = user.team.coach;

      if(typeof user.team.coach.date_of_arrival == 'object' && user.team.coach.date_of_arrival !=null && user.team.coach.date_of_arrival !=undefined){
        let prueba=format(user.team.coach.date_of_arrival.toDate(),'MM/dd/yyyy')
        updatedData.coach.date_of_arrival=prueba
      }

      updatedData.captain = user.team.captain;
      if(typeof user.team.captain.date_of_arrival == 'object' && user.team.captain.date_of_arrival !=null && user.team.captain.date_of_arrival !=undefined){
        let prueba=format(user.team.captain.date_of_arrival.toDate(),'MM/dd/yyyy')
        updatedData.captain.date_of_arrival=prueba
      }
      updatedData.coordinator = user.team.coordinator;
      if(typeof user.team.coordinator.date_of_arrival == 'object' && user.team.coordinator.date_of_arrival !=null  && user.team.coordinator.date_of_arrival !=undefined){
        let prueba=format(user.team.coordinator.date_of_arrival.toDate(),'MM/dd/yyyy')
        updatedData.coordinator.date_of_arrival=prueba
      }
      for (let i = 0; i < user.team.team_members.length; i++) {
        updatedData.pairs[i] = user.team.team_members[i];
        if(typeof user.team.team_members[i].date_of_arrival == 'object' && user.team.team_members[i].date_of_arrival !=null && user.team.team_members[i].date_of_arrival !=undefined){
          let prueba=format(user.team.team_members[i].date_of_arrival.toDate(),'MM/dd/yyyy')
          updatedData.pairs[i].date_of_arrival=prueba
        }
      }

      console.log("freregre", updatedData);

      return updatedData;
    });
  };

  const saveData = async () => {
    try {
      const coordinatorReference = await doc(
        db,
        "users",
        teamData.coordinator.id
      );
      const coordinatorDocSnapshot = await getDoc(coordinatorReference);

//       const dateStringCoordinator=teamData.coordinator.date_of_arrival ? teamData.coordinator.date_of_arrival : null
//       let month,day,year;
// console.log('mkjnhbnjmk',dateStringCoordinator)
//       let dateCoordinator=null
      // if(dateStringCoordinator){
      //   month=dateStringCoordinator.split("/")[0]
      //   day=dateStringCoordinator.split("/")[1]
      //   year=dateStringCoordinator.split("/")[2]
      //   dateCoordinator=new Date(year,month-1,day)
      // }
      if (coordinatorDocSnapshot.exists()) {
        const coordinatorData = coordinatorDocSnapshot.data();
        await setDoc(coordinatorReference, {
                name: teamData.coordinator.name,
        last_name: teamData.coordinator.last_name,
        email: teamData.coordinator.email,  // Fix: Use the correct email field instead of last_name
        phone: teamData.coordinator.phone,
        dupr:Number(teamData.coordinator.dupr),
        role: teamData.coordinator.role,     // Assign the user role
        country:teamData.coordinator.country,
        passport:teamData.coordinator.passport,
        date_of_arrival:new Date(teamData.coordinator.date_of_arrival),
        airline:teamData.coordinator.airline,
        flight_number:teamData.coordinator.flight_number,
        shirt_size:teamData.coordinator.shirt_size 
        });
      }

      const coachReference = await doc(db, "users", teamData.coach.id);
      const coachDocSnapshot = await getDoc(coachReference);

      if (coachDocSnapshot.exists()) {
        const coachData = coachDocSnapshot.data();
        await setDoc(coachReference, {
          name: teamData.coach.name,
          last_name: teamData.coach.last_name,
          email: teamData.coach.email,  // Fix: Use the correct email field instead of last_name
          phone: teamData.coach.phone,
          dupr:Number(teamData.coach.dupr),
          role: teamData.coach.role,     // Assign the user role
          country:teamData.coach.country,
          passport:teamData.coach.passport,
          date_of_arrival:new Date(teamData.coach.date_of_arrival),
          airline:teamData.coach.airline,
          flight_number:teamData.coach.flight_number,
          shirt_size:teamData.coach.shirt_size 
        });
      }

      const captainReference = await doc(db, "users", teamData.captain.id);
      const captainDocSnapshot = await getDoc(captainReference);
console.log(teamData.captain.date_of_arrival)
      if (captainDocSnapshot.exists()) {
        const captainData = captainDocSnapshot.data();
        await setDoc(captainReference, {
          name: teamData.captain.name,
          last_name: teamData.captain.last_name,
          email: teamData.captain.email,  // Fix: Use the correct email field instead of last_name
          phone: teamData.captain.phone,
          dupr:Number(teamData.captain.dupr),
          role: teamData.captain.role,     // Assign the user role
          country:teamData.captain.country,
          passport:teamData.captain.passport,
          date_of_arrival:new Date(teamData.captain.date_of_arrival),
          airline:teamData.captain.airline,
          flight_number:teamData.captain.flight_number,
          shirt_size:teamData.captain.shirt_size 
        });
      }

      for (let i = 0; i < teamData.pairs.length; i++) {
        let memberReference = await doc(db, "users", teamData.pairs[i].id);
        let memberDocSnapshot = await getDoc(memberReference);
        await setDoc(memberReference, {
          name: teamData.pairs[i].name,
          last_name: teamData.pairs[i].last_name,
          email: teamData.pairs[i].email,  // Fix: Use the correct email field instead of last_name
          phone: teamData.pairs[i].phone,
          dupr:Number(teamData.pairs[i].dupr),
          role: teamData.pairs[i].role,     // Assign the user role
          country:teamData.pairs[i].country,
          passport:teamData.pairs[i].passport,
          date_of_arrival:new Date(teamData.pairs[i].date_of_arrival),
          airline:teamData.pairs[i].airline,
          flight_number:teamData.pairs[i].flight_number,
          shirt_size:teamData.pairs[i].shirt_size 
        });
      }
      setEdit(false);
      setSuccessMessage("Your team has been updated succesfully!");
      //  location.reload()
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };
  const validateInput = () => {
    // Validate coach information
    if (
      !teamData.coach.name ||
      !teamData.coach.last_name ||
      !teamData.coach.email ||
      !teamData.coach.phone ||
      teamData.coach.dupr === null
    ) {
      alert("Coach information is incomplete. Please fill in all fields.");
      return false;
    }

    // Validate pairs information
    for (let i = 0; i < teamData.pairs.length; i++) {
      const pair = teamData.pairs[i];
      if (
        !pair.name ||
        !pair.last_name ||
        !pair.email ||
        !pair.phone ||
        pair.dupr === null
      ) {
        alert(
          `Player ${
            i + 1
          } information is incomplete. Please fill in all fields.`
        );
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
    setTeamData((prevTeamData) => {
      const updatedData = { ...prevTeamData };

      if (category === "coach") {
        updatedData.coach[fieldName] = value;
      } else if (category === "pairs") {
        updatedData.pairs[index][fieldName] = value;
      } else if (category === "coordinator") {
        updatedData.coordinator[fieldName] = value;
      } else if (category === "captain") {
        updatedData.captain[fieldName] = value;
      }

      return updatedData;
    });
  };

  const addPair = (e) => {
    e.preventDefault();
    if (teamData.pairs.length <= 7) {
      setTeamData((prevTeamData) => ({
        ...prevTeamData,
        pairs: [
          ...prevTeamData.pairs,
          {
            name: "",
            last_name: "",
            email: "",
            phone: "",
            dupr: null,
            passport: "",
            date_of_arrival: null,
            airline: "",
            flight_number: "",
            shirt_size: "",
          },
        ],
      }));
    }
  };

  // components/RegistrationForm.js

  const registerTeamMember = async (newTeamRef, memberData, role) => {
    try {
      // Create user account in Firebase Authentication
      const { email } = memberData;
      const password = generateRandomPassword();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the newly created user's UID
      const userId = userCredential.user.uid;
      console.log(userId);
      const roleReference = await doc(db, "roles", role);
      // Save additional information to the database
      const newUserRef = await addDoc(
        collection(db, "users"),
        {
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
        },
        userId
      );

      console.log(memberData);
      return newUserRef;
    } catch (error) {
      throw error;
    }
  };

  // components/RegistrationForm.js

  // const nodemailer = require('nodemailer');

  const updateTeamMembers = async (newTeamRef, pairs, role) => {
    try {
      const updatePromises = [];

      for (const pair of pairs) {
        const newUserRef = await registerTeamMember(newTeamRef, pair, role);
        updatePromises.push(
          updateDoc(newTeamRef, { team_members: arrayUnion(newUserRef) })
        );
      }

      await Promise.all(updatePromises);

      console.log("Team members updated successfully.");
    } catch (error) {
      console.error("Error updating team members:", error);
      throw error;
    }
  };


  const handleRemovePair = (index) => {
    if (teamData.pairs.length > 2) {
      setTeamData((prevTeamData) => {
        const updatedPairs = [...prevTeamData.pairs];
        updatedPairs.splice(index, 1); // Remove the pair and the corresponding second member
        return { ...prevTeamData, pairs: updatedPairs };
      });
    }
  };

  const { user, loading } = useAuth();
  const router = useRouter();

  console.log("mjnbhvgcfvhbjnk", user, loading);
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // Redirect to the login page if the user is not authenticated
    }
    if (user && user?.team) {
      fillData();
    }
  }, [user, loading, router]);

  if (loading) {
    // You can also render a loading spinner or other UI while checking authentication
    return <Loader loading={loading} />;
  }

  const payNow=async()=>{
    const teamRef = await doc(
      db,
      "teams",
      user.team.id
    );

    setTeamRef(teamRef)
 
    setRegister(true)
  }
  return (
    <main className="flex min-h-screen main">
      <Register
      team={teamRef}
        open={register}
        setOpen={() => {
          setRegister(!register);
        }}
      />
      <SuccessMessage
        message={successMessage}
        setMessage={(value) => {
          setSuccessMessage(value);
        }}
      />
      <Navbar />
      {user && (
        <div className="dashboard">
          {user.team && user.role.name=='Coordinator' && !user.team?.payment_status
          &&<div className="inscription-banner"><h2>You have not paid the inscription fee. Please complete the payment before September 1st to participate.</h2><button onClick={()=>{payNow()}}>Pay Now</button></div>}
          <div className="header-dashboard">
            <div class="gradient-circle">
              <img src={user.country.image} />
            </div>
            <h2>
              Welcome, {user.name} {user.last_name}
            </h2>
            <h3>{user.role.name}</h3>
          </div>

          {user.team ? (
            <div className="row">
              <div className="column-55-2">
                <div className="row-title">
                  <h2>TEAM</h2>
                </div>
                <div className="form-container">
                  <div className="space-y-12">
                    <div
                      className={`border-b border-gray-900/10 pb-12 ${
                        !edit && showCoordinator ? "" : "accordion"
                      }`}
                    >
                      {edit ? (
                        <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                          Coordinator Information
                        </h2>
                      ) : (
                        <div className="accordion-button-container">
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                            Coordinator - {user.team.coordinator.name}{" "}
                            {user.team.coordinator.last_name}
                          </h2>
                          <div
                            className="accordion-button"
                            onClick={() => {
                              setShowCoordinator(!showCoordinator);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={
                                !showCoordinator ? faChevronDown : faChevronUp
                              }
                              className="accordion-icon"
                            />
                          </div>
                        </div>
                      )}

                      {edit ? (
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-first-name"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              First name
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                id="coordinator-first-name"
                                name="coordinator-first-name"
                                autoComplete="given-name"
                                value={teamData.coordinator.name}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
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
                              htmlFor="coordinator-last-name"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Last name
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                id="coordinator-last-name"
                                name="coordinator-last-name"
                                autoComplete="family-name"
                                value={teamData.coordinator.last_name}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
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
                              htmlFor="coordinator-email"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Email address
                            </label>
                            <div className="mt-2">
                              <input
                                id="coordinator-email"
                                name="coordinator-email"
                                type="email"
                                autoComplete="email"
                                value={teamData.coordinator.email}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
                                    null,
                                    "email",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter email address"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Phone number
                            </label>
                            <div className="mt-2">
                              <input
                                id="coordinator-phone"
                                name="coordinator-phone"
                                type="text"
                                autoComplete="phone"
                                value={teamData.coordinator.phone}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
                                    null,
                                    "phone",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter phone number"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              DUPR Ranking
                            </label>
                            <div className="mt-2">
                              <input
                                id="coordinator-dupr"
                                name="coordinator-dupr"
                                type="number"
                                value={teamData.coordinator.dupr}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
                                    null,
                                    "dupr",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter DUPR Ranking"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Shirt Size
                            </label>
                            <div className="mt-2">
                              <input
                                id="coordinator-shirt-size"
                                name="coordinator-shirt-size"
                                type="text"
                                value={teamData.coordinator.shirt_size}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
                                    null,
                                    "shirt_size",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter shirt size"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Passport
                            </label>
                            <div className="mt-2">
                              <input
                                id="coordinator-passport"
                                name="coordinator-passport"
                                type="text"
                                value={teamData.coordinator.passport}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
                                    null,
                                    "passport",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter passport number"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Date of Arrival
                            </label>
                            <div className="mt-2 relative">
                              <div className="datepicker">
                                <Datepicker
                                  value={teamData.coordinator.date_of_arrival}
                                  onSelectedDateChanged={(e) => {
                                    handleInputChange(
                                      "coordinator",
                                      null,
                                      "date_of_arrival",
                                      format(e, "MM/dd/yyyy")
                                    );
                                  }}
                                  format={"MM/DD/YYYY"}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Airline
                            </label>
                            <div className="mt-2">
                              <input
                                id="coordinator-airline"
                                name="coordinator-airline"
                                type="text"
                                value={teamData.coordinator.airline}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
                                    null,
                                    "airline",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter airline"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Flight number
                            </label>
                            <div className="mt-2">
                              <input
                                id="coordinator-flight-number"
                                name="coordinator-flight-number"
                                type="text"
                                value={teamData.coordinator.flight_number}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coordinator",
                                    null,
                                    "flight_number",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter flight number"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={` ${
                            showCoordinator
                              ? "mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 show"
                              : "no-show"
                          }`}
                        >
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-first-name"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              First name
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                type="text"
                                id="coordinator-first-name"
                                name="coordinator-first-name"
                                autoComplete="given-name"
                                value={teamData.coordinator.name}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-last-name"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Last name
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                type="text"
                                id="coordinator-last-name"
                                name="coordinator-last-name"
                                autoComplete="family-name"
                                value={teamData.coordinator.last_name}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-email"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Email address
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coordinator-email"
                                name="coordinator-email"
                                type="email"
                                autoComplete="email"
                                value={teamData.coordinator.email}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Phone number
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coordinator-phone"
                                name="coordinator-phone"
                                type="text"
                                autoComplete="phone"
                                value={teamData.coordinator.phone}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              DUPR Ranking
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coordinator-dupr"
                                name="coordinator-dupr"
                                type="number"
                                value={teamData.coordinator.dupr}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Shirt Size
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coordinator-shirt-size"
                                name="coordinator-shirt-size"
                                type="text"
                                value={teamData.coordinator.shirt_size}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Passport
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coordinator-passport"
                                name="coordinator-passport"
                                type="text"
                                value={teamData.coordinator.passport}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Date of Arrival
                            </label>
                            <div className="mt-2 relative">
                              <input
                                disabled={true}
                                id="coordinator-passport"
                                name="coordinator-passport"
                                type="text"
                                value={teamData.coordinator.date_of_arrival}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Airline
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coordinator-airline"
                                name="coordinator-airline"
                                type="text"
                                value={teamData.coordinator.airline}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coordinator-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Flight number
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coordinator-flight-number"
                                name="coordinator-flight-number"
                                type="text"
                                value={teamData.coordinator.flight_number}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={`border-b border-gray-900/10 pb-12 ${
                        !edit && showCoach ? "" : "accordion"
                      }`}
                    >
                      {edit ? (
                        <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                          Coach Information
                        </h2>
                      ) : (
                        <div className="accordion-button-container">
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                            Coach - {user.team.coach.name}{" "}
                            {user.team.coach.last_name}
                          </h2>
                          <div
                            className="accordion-button"
                            onClick={() => {
                              setShowCoach(!showCoach);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={!showCoach ? faChevronDown : faChevronUp}
                              className="accordion-icon"
                            />
                          </div>
                        </div>
                      )}

                      {edit ? (
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
                                  handleInputChange(
                                    "coach",
                                    null,
                                    "email",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter email address"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coach-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Phone number
                            </label>
                            <div className="mt-2">
                              <input
                                id="coach-phone"
                                name="coach-phone"
                                type="text"
                                autoComplete="phone"
                                value={teamData.coach.phone}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coach",
                                    null,
                                    "phone",
                                    e.target.value
                                  )
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
                                value={teamData.coach.dupr}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coach",
                                    null,
                                    "dupr",
                                    e.target.value
                                  )
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
                              <input
                                id="coach-shirt-size"
                                name="coach-shirt-size"
                                type="text"
                                value={teamData.coach.shirt_size}
                                onChange={(e) =>
                                  handleInputChange(
                                    "coach",
                                    null,
                                    "shirt_size",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter shirt size"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
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
                                  handleInputChange(
                                    "coach",
                                    null,
                                    "passport",
                                    e.target.value
                                  )
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
                                  onSelectedDateChanged={(e) => {
                                    handleInputChange(
                                      "coach",
                                      null,
                                      "date_of_arrival",
                                      format(e, "MM/dd/yyyy")
                                    );
                                  }}
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
                                  handleInputChange(
                                    "coach",
                                    null,
                                    "airline",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "coach",
                                    null,
                                    "flight_number",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter flight number"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={` ${
                            showCoach
                              ? "mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 show"
                              : "no-show"
                          }`}
                        >
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coach-first-name"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              First name
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                type="text"
                                id="coach-first-name"
                                name="coach-first-name"
                                autoComplete="given-name"
                                value={teamData.coach.name}
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
                                disabled={true}
                                type="text"
                                id="coach-last-name"
                                name="coach-last-name"
                                autoComplete="family-name"
                                value={teamData.coach.last_name}
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
                                disabled={true}
                                id="coach-email"
                                name="coach-email"
                                type="email"
                                autoComplete="email"
                                value={teamData.coach.email}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="coach-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Phone number
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="coach-phone"
                                name="coach-phone"
                                type="text"
                                autoComplete="phone"
                                value={teamData.coach.phone}
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
                                disabled={true}
                                id="coach-dupr"
                                name="coach-dupr"
                                type="number"
                                value={teamData.coach.dupr}
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
                              <input
                                disabled={true}
                                id="coach-shirt-size"
                                name="coach-shirt-size"
                                type="text"
                                value={teamData.coach.shirt_size}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
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
                                disabled={true}
                                id="coach-passport"
                                name="coach-passport"
                                type="text"
                                value={teamData.coach.passport}
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
                              <div className="mt-2">
                                <input
                                  disabled={true}
                                  id="coach-passport"
                                  name="coach-passport"
                                  type="text"
                                  value={teamData.coach.date_of_arrival}
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
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
                                disabled={true}
                                id="coach-airline"
                                name="coach-airline"
                                type="text"
                                value={teamData.coach.airline}
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
                                disabled={true}
                                id="coach-flight-number"
                                name="coach-flight-number"
                                type="text"
                                value={teamData.coach.flight_number}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={`border-b border-gray-900/10 pb-12 ${
                        !edit && showCoach ? "" : "accordion"
                      }`}
                    >
                      {edit ? (
                        <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                          Captain Information
                        </h2>
                      ) : (
                        <div className="accordion-button-container">
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                            Captain - {user.team.captain.name}{" "}
                            {user.team.captain.last_name}
                          </h2>
                          <div
                            className="accordion-button"
                            onClick={() => {
                              setShowCaptain(!showCaptain);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={!showCaptain ? faChevronDown : faChevronUp}
                              className="accordion-icon"
                            />
                          </div>
                        </div>
                      )}

                      {edit ? (
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
                                  handleInputChange(
                                    "captain",
                                    null,
                                    "email",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter email address"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
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
                                  handleInputChange(
                                    "captain",
                                    null,
                                    "phone",
                                    e.target.value
                                  )
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
                                value={teamData.captain.dupr}
                                onChange={(e) =>
                                  handleInputChange(
                                    "captain",
                                    null,
                                    "dupr",
                                    e.target.value
                                  )
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
                              <input
                                id="captain-shirt-size"
                                name="captain-shirt-size"
                                type="text"
                                value={teamData.captain.shirt_size}
                                onChange={(e) =>
                                  handleInputChange(
                                    "captain",
                                    null,
                                    "shirt_size",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter shirt size"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
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
                                  handleInputChange(
                                    "captain",
                                    null,
                                    "passport",
                                    e.target.value
                                  )
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
                                  onSelectedDateChanged={(e) => {
                                    handleInputChange(
                                      "captain",
                                      null,
                                      "date_of_arrival",
                                      format(e, "MM/dd/yyyy")
                                    );
                                  }}
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
                                  handleInputChange(
                                    "captain",
                                    null,
                                    "airline",
                                    e.target.value
                                  )
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
                                  handleInputChange(
                                    "captain",
                                    null,
                                    "flight_number",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter flight number"
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={` ${
                            showCaptain
                              ? "mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 show"
                              : "no-show"
                          }`}
                        >
                          <div className="sm:col-span-3">
                            <label
                              htmlFor="captain-first-name"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              First name
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                type="text"
                                id="captain-first-name"
                                name="captain-first-name"
                                autoComplete="given-name"
                                value={teamData.captain.name}
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
                                disabled={true}
                                type="text"
                                id="captain-last-name"
                                name="captain-last-name"
                                autoComplete="family-name"
                                value={teamData.captain.last_name}
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
                                disabled={true}
                                id="captain-email"
                                name="captain-email"
                                type="email"
                                autoComplete="email"
                                value={teamData.captain.email}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-3">
                            <label
                              htmlFor="captain-dupr"
                              className="block text-sm font-medium leading-6 text-gray-900 form-title"
                            >
                              Phone number
                            </label>
                            <div className="mt-2">
                              <input
                                disabled={true}
                                id="captain-phone"
                                name="captain-phone"
                                type="text"
                                autoComplete="phone"
                                value={teamData.captain.phone}
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
                                disabled={true}
                                id="captain-dupr"
                                name="captain-dupr"
                                type="number"
                                value={teamData.captain.dupr}
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
                              <input
                                disabled={true}
                                id="captain-shirt-size"
                                name="captain-shirt-size"
                                type="text"
                                value={teamData.captain.shirt_size}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
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
                                disabled={true}
                                id="captain-passport"
                                name="captain-passport"
                                type="text"
                                value={teamData.captain.passport}
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
                              <div className="mt-2">
                                <input
                                  disabled={true}
                                  id="captain-passport"
                                  name="captain-passport"
                                  type="text"
                                  value={teamData.captain.date_of_arrival}
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
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
                                disabled={true}
                                id="captain-airline"
                                name="captain-airline"
                                type="text"
                                value={teamData.captain.airline}
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
                                disabled={true}
                                id="captain-flight-number"
                                name="captain-flight-number"
                                type="text"
                                value={teamData.captain.flight_number}
                                className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={`border-b border-gray-900/10 pb-12 ${
                        edit ? "" : "accordion"
                      }`}
                    >
                      {edit ? (
                        <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                          Team Information
                        </h2>
                      ) : (
                        <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                          Team - {user.team.team_members.length}{" "}
                          {user.team.team_members.length > 1
                            ? "Players"
                            : "Player"}
                        </h2>
                      )}

                      {Array.from(
                        { length: teamData.pairs.length },
                        (_, index) =>
                          edit && ( // Remove the curly braces here
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10"
                            >
                              {/* First member of the pair */}

                              <h2 className="text-base font-semibold leading-7 text-gray-900 sm:col-span-5 form-title">
                                Player {index + 1}
                              </h2>
                              {teamData.pairs.length > 2 && (
                                <h2
                                  onClick={() => {
                                    handleRemovePair(index);
                                  }}
                                  style={{
                                    textAlign: "center",
                                    color: "#da9645",
                                    cursor: "pointer",
                                    borderColor: "#da9645",
                                  }}
                                  className="text-xs font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-100 opacity-80"
                                >
                                  Remove Player
                                </h2>
                              )}

                              <div className="sm:col-span-3">
                                <label
                                  htmlFor={`pair-first-name-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  First name
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    id={`pair-first-name-${index}`}
                                    name={`pair-first-name-${index}`}
                                    autoComplete="given-name"
                                    value={teamData.pairs[index].name}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "pairs",
                                        index,
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
                                  htmlFor={`pair-last-name-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Last name
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    id={`pair-last-name-${index}`}
                                    name={`pair-last-name-${index}`}
                                    autoComplete="family-name"
                                    value={teamData.pairs[index].last_name}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "pairs",
                                        index,
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
                                  htmlFor={`pair-email-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Email address
                                </label>
                                <div className="mt-2">
                                  <input
                                    id={`pair-email-${index}`}
                                    name={`pair-email-${index}`}
                                    type="email"
                                    autoComplete="email"
                                    value={teamData.pairs[index].email}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "pairs",
                                        index,
                                        "email",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter email address"
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                              <div className="sm:col-span-3">
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
                                    onChange={(e) =>
                                      handleInputChange(
                                        "pairs",
                                        index,
                                        "phone",
                                        e.target.value
                                      )
                                    }
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
                                    value={teamData.pairs[index].dupr}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "pairs",
                                        index,
                                        "dupr",
                                        e.target.value
                                      )
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
                                  <input
                                    id={`pair-shirt-size-${index}`}
                                    name={`pair-shirt-size-${index}`}
                                    type="text"
                                    value={teamData.pairs[index].shirt_size}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "pairs",
                                        index,
                                        "shirt_size",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter shirt size"
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
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
                                      handleInputChange(
                                        "pairs",
                                        index,
                                        "passport",
                                        e.target.value
                                      )
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
                                      value={
                                        teamData.pairs[index].date_of_arrival
                                      }
                                      onSelectedDateChanged={(e) => {
                                        handleInputChange(
                                          "pairs",
                                          index,
                                          "date_of_arrival",
                                          format(e, "MM/dd/yyyy")
                                        );
                                      }}
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
                                      handleInputChange(
                                        "pairs",
                                        index,
                                        "airline",
                                        e.target.value
                                      )
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
                                      handleInputChange(
                                        "pairs",
                                        index,
                                        "flight_number",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter flight number"
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                      )}

                      {Array.from(
                        { length: teamData.pairs.length },
                        (_, index) =>
                          !edit && ( // Remove the curly braces here
                            <div
                              key={index}
                              className={`grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10" ${
                                edit ? "" : "accordion"
                              }`}
                            >
                              <div className="accordion-button-container sm:col-span-6">
                                <h2
                                  className="text-base font-semibold leading-7 text-gray-900 sm:col-span-5 form-title"
                                  style={{ opacity: 0.8 }}
                                >
                                  Player {index + 1} -{" "}
                                  {user.team.team_members[index].first_name}
                                  {user.team.team_members[index].last_name}
                                </h2>
                                <div
                                  className="accordion-button"
                                  onClick={() => {
                                    setShowPairs((prevTeamData) => {
                                      const updatedData = { ...prevTeamData };

                                      updatedData[index] = !updatedData[index];

                                      return updatedData;
                                    });
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      !showPairs[index]
                                        ? faChevronDown
                                        : faChevronUp
                                    }
                                    className="accordion-icon"
                                  />
                                </div>
                              </div>

                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-first-name-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  First name
                                </label>
                                <div className="mt-2">
                                  <input
                                  disabled={true}
                                    type="text"
                                    id={`pair-first-name-${index}`}
                                    name={`pair-first-name-${index}`}
                                    autoComplete="given-name"
                                    value={teamData.pairs[index].name}
                              
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>

                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-last-name-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Last name
                                </label>
                                <div className="mt-2">
                                  <input
                                     disabled={true}
                                    type="text"
                                    id={`pair-last-name-${index}`}
                                    name={`pair-last-name-${index}`}
                                    autoComplete="family-name"
                                    value={teamData.pairs[index].last_name}
                                  
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>

                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-email-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Email address
                                </label>
                                <div className="mt-2">
                                  <input
                                     disabled={true}
                                    id={`pair-email-${index}`}
                                    name={`pair-email-${index}`}
                                    type="email"
                                    autoComplete="email"
                                    value={teamData.pairs[index].email}
                                  
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-phone-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Phone number
                                </label>
                                <div className="mt-2">
                                  <input
                                     disabled={true}
                                    id={`pair-phone-${index}`}
                                    name={`pair-phone-${index}`}
                                    type="text"
                                    autoComplete="phone"
                                    value={teamData.pairs[index].phone}
                                
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>

                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-dupr-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  DUPR Ranking
                                </label>
                                <div className="mt-2">
                                  <input
                                     disabled={true}
                                    id={`pair-phone-${index}`}
                                    name={`pair-phone-${index}`}
                                    type="number"
                                    value={teamData.pairs[index].dupr}
                                  
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-shirt-size-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Shirt Size
                                </label>
                                <div className="mt-2">
                                  <input
                                     disabled={true}
                                    id={`pair-shirt-size-${index}`}
                                    name={`pair-shirt-size-${index}`}
                                    type="text"
                                    value={teamData.pairs[index].shirt_size}
                                   
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-passport-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Passport
                                </label>
                                <div className="mt-2">
                                  <input
                                     disabled={true}
                                    id={`pair-passport-${index}`}
                                    name={`pair-passport-${index}`}
                                    type="text"
                                    value={teamData.pairs[index].passport}
                                
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-date-of-arrival-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Date of Arrival
                                </label>
                                <div className="mt-2">
                                  <input
                                     disabled={true}
                                    id={`pair-passport-${index}`}
                                    name={`pair-passport-${index}`}
                                    type="text"
                                    value={teamData.pairs[index].date_of_arrival}
                                
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-airline-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Airline
                                </label>
                                <div className="mt-2">
                                  <input
                                      disabled={true}
                                    id={`pair-airline-${index}`}
                                    name={`pair-airline-${index}`}
                                    type="text"
                                    value={teamData.pairs[index].airline}
                                  
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                              <div
                                className={`sm:col-span-3 ${
                                  showPairs[index] ? "show" : "no-show"
                                }`}
                              >
                                <label
                                  htmlFor={`pair-flight-number-${index}`}
                                  className="block text-sm font-medium leading-6 text-gray-900 form-title"
                                >
                                  Flight number
                                </label>
                                <div className="mt-2">
                                  <input
                                      disabled={true}
                                    id={`pair-flight-number-${index}`}
                                    name={`pair-flight-number-${index}`}
                                    type="text"
                                    value={teamData.pairs[index].flight_number}
                                   
                                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                      )}

                      {teamData.pairs.length < 8 && edit && (
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                          <h2
                            onClick={(e) => {
                              addPair(e);
                            }}
                            style={{
                              textAlign: "center",
                              color: "#200d04",
                              cursor: "pointer",
                              borderColor: "#da9645",
                              backgroundColor: "#da9645",
                            }}
                            className="text-sm font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-80 opacity-100"
                          >
                            + Add Player
                          </h2>
                        </div>
                      )}
                    </div>
                  </div>

                  {edit && user.role.name == "Coordinator" && 
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button type="button" className="secondary-button" onClick={()=>{setEdit(false)}}>
                        Cancel
                      </button>
                      <button
                        onClick={(e) => {
                          saveData();
                        }}
                        className="gold-button"
                      >
                        Save
                      </button>
                    </div>
}
{!edit && user.role.name == "Coordinator" &&
                    <div className="mt-6 flex items-center justify-end gap-x-6">
                      <button
                        onClick={(e) => {
                          setEdit(true);
                        }}
                        className="gold-button"
                      >
                        Edit
                      </button>
                    </div>}
               
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="column-55-2">
                <div className="row-title">
                  <h2>TEAM</h2>
                </div>
                <div className="w-full p-5 h-full empty-team">
                  <h2>Start by creating your team.</h2>
                  <div className="mt-6 flex items-center justify-end gap-x-6 h-full">
                    <button
                      onClick={(e) => {
                        setRegister(true);
                      }}
                      className="gold-button"
                    >
                      Create Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default ProtectedPage;
