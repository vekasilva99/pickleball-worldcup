// pages/protected.js
"use client";
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebase/firebase";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the styles
import { Datepicker } from "flowbite-react";
import { format } from "date-fns";
import { collection, getDocs, doc, getDoc, where, collectionGroup, set, addDoc, setDoc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Navbar from "@/components/navbar3-senior";
import { Loader } from "@/components/Loader2";
import Register from "@/components/register2";
import axios from "axios";
import { SuccessMessage } from "@/components/SuccessMessage";
import Hotel from "@/components/hotel";
import Footer from "@/components/footer2";
import LazyImage from "@/components/LazyLoad";
import { ErrorMessage } from "@/components/ErrorMessage";

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
  const [hotel, setHotel] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user2, setuser2] = useState(null);
  const [register, setRegister] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showCaptain, setShowCaptain] = useState(false);
  const [showCoordinator, setShowCoordinator] = useState(false);
  const [showPairs, setShowPairs] = useState([false, false, false, false]);
  const [teamRef, setTeamRef] = useState(null);

  const fillData = () => {
    setTeamData((prevTeamData) => {
      const updatedData = { ...prevTeamData };

      updatedData.coach = user2.team.coach;

      if (typeof user2.team.coach?.date_of_arrival == "object" && user2.team.coach?.date_of_arrival != null && user2.team.coach?.date_of_arrival != undefined) {
        let prueba = format(user2.team.coach?.date_of_arrival.toDate(), "MM/dd/yyyy");
        updatedData.coach.date_of_arrival = prueba;
      }
      if (typeof user2.team.coach?.birthdate == "object" && user2.team.coach?.birthdate != null && user2.team.coach?.birthdate != undefined) {
        let prueba = format(user2.team.coach?.birthdate.toDate(), "MM/dd/yyyy");
        updatedData.coach.birthdate = prueba;
      }

      updatedData.captain = user2.team.captain;
      if(user2.team.captain.date_of_arrival){
      if (typeof user2.team.captain.date_of_arrival == "object" && user2.team.captain.date_of_arrival != null && user2.team.captain.date_of_arrival != undefined) {
        let prueba = format(user2.team.captain.date_of_arrival.toDate(), "MM/dd/yyyy");
        updatedData.captain.date_of_arrival = prueba;
      }
    }
      if(user2.team.captain.birthdate ){
      if (typeof user2.team.captain.birthdate == "object" && user2.team.captain.birthdate != null && user2.team.captain.birthdate != undefined) {
        let prueba = format(user2.team.captain.birthdate.toDate(), "MM/dd/yyyy");
        updatedData.captain.birthdate = prueba;
      }
    }
      updatedData.coordinator = user2.team.coordinator;
      if(user2.team.coordinator.date_of_arrival){
      if (typeof user2.team.coordinator.date_of_arrival == "object" && user2.team.coordinator.date_of_arrival != null && user2.team.coordinator.date_of_arrival != undefined) {
        let prueba = format(user2.team.coordinator.date_of_arrival.toDate(), "MM/dd/yyyy");
        updatedData.coordinator.date_of_arrival = prueba;
      }
    }
      if(user2.team.coordinator.birthdate ){
      if (typeof user2.team.coordinator.birthdate == "object" && user2.team.coordinator.birthdate != null && user2.team.coordinator.birthdate != undefined) {
        let prueba = format(user2.team.coordinator.birthdate.toDate(), "MM/dd/yyyy");
        updatedData.coordinator.birthdate = prueba;
      }
    }

      for (let i = 0; i < user2.team.team_members.length; i++) {
        updatedData.pairs[i] = user2.team.team_members[i];
        if(user2.team.team_members[i]?.date_of_arrival){
        if (typeof user2.team.team_members[i].date_of_arrival == "object" && user2.team.team_members[i].date_of_arrival != null && user2.team.team_members[i].date_of_arrival != undefined) {
          let prueba = format(user2.team.team_members[i].date_of_arrival.toDate(), "MM/dd/yyyy");
          updatedData.pairs[i].date_of_arrival = prueba;
        }
      }
        if(user2.team.team_members[i]?.birthdate){
        if (typeof user2.team.team_members[i]?.birthdate == "object" && user2.team.team_members[i].birthdate != null && user2.team.team_members[i].birthdate != undefined) {
          let prueba = format(user2.team.team_members[i].birthdate.toDate(), "MM/dd/yyyy");
          updatedData.pairs[i].birthdate = prueba;
        }
      }
      }

      console.log("freregre", updatedData,user2.team);

      return updatedData;
    });
  };

  const sendEmail = async (email, password, coordinator, country, link) => {
    try {
      await axios.post("/api/send-email2", {
        email: email,
        password: password,
        coordinator: coordinator,
        country: country,
        link: link,
        countryImage: user.country.image,
      });
      //console.log('Email sent successfully');
    } catch (error) {
      console.error("Error sending email: ", error);
    }
  };

  const saveData = async () => {
    try {
      const coordinatorReference = await doc(db, "users", teamData.coordinator.id);

      const newTeamRef = await doc(db, "teams", user.team.id);

      const countryRef = await doc(db, "countries", user.country.id);

      console.log("kjinbhgvcfvhbjnkml,;", countryRef);
      const coordinatorDocSnapshot = await getDoc(coordinatorReference);

      //       const dateStringCoordinator=teamData.coordinator.date_of_arrival ? teamData.coordinator.date_of_arrival : null
      //       let month,day,year;
      // //console.log('mkjnhbnjmk',dateStringCoordinator)
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
          email: teamData.coordinator.email, // Fix: Use the correct email field instead of last_name
          phone: teamData.coordinator.phone,
          dupr: Number(teamData.coordinator.dupr),
          role: teamData.coordinator.role, // Assign the user2 role
          country: teamData.coordinator.country,
          passport: teamData.coordinator.passport ? teamData.coordinator.passport : null,
          date_of_arrival: teamData.coordinator.date_of_arrival ? new Date(teamData.coordinator.date_of_arrival) : null,
          birthdate: teamData.coordinator.birthdate ? new Date(teamData.coordinator.birthdate) : null,
          airline: teamData.coordinator.airline ? teamData.coordinator.airline : null,
          flight_number: teamData.coordinator.flight_number ? teamData.coordinator.flight_number : null,
          shirt_size: teamData.coordinator.shirt_size ? teamData.coordinator.shirt_size : null,
          senior: true,
        });
      }

      const coachReference = await doc(db, "users", teamData.coach?.id);
      const coachDocSnapshot = await getDoc(coachReference);

      if (coachDocSnapshot.exists()) {
        const coachData = coachDocSnapshot.data();

        if (coachData.email != teamData.coach?.email) {
          console.log("COACH", teamData.coach);
          const coachData = await registerTeamMember(newTeamRef, teamData.coach, "8l9gFgT0smIiDSyCOzx6", countryRef);
          await updateDoc(newTeamRef, { coach: coachData });
          await deleteDoc(doc(db, "users", teamData.coach?.id));
        } else {
          await setDoc(coachReference, {
            name: teamData.coach?.name,
            last_name: teamData.coach?.last_name,
            email: teamData.coach?.email, // Fix: Use the correct email field instead of last_name
            phone: teamData.coach?.phone,
            dupr: Number(teamData.coach?.dupr),
            role: teamData.coach?.role, // Assign the user2 role
            country: teamData.coach?.country,
            passport: teamData.coach?.passport ? teamData.coach?.passport : null,
            date_of_arrival: teamData.coach?.date_of_arrival ? new Date(teamData.coach?.date_of_arrival) : null,
            birthdate: teamData.coach?.birthdate ? new Date(teamData.coach?.birthdate) : null,
            airline: teamData.coach?.airline ? teamData.coach?.airline : null,
            flight_number: teamData.coach?.flight_number ? teamData.coach?.flight_number : null,
            shirt_size: teamData.coach?.shirt_size ? teamData.coach?.shirt_size : null,
            senior: true,
          });
        }
      }
      const captainReference = await doc(db, "users", teamData.captain.id);
      const captainDocSnapshot = await getDoc(captainReference);
      //console.log(teamData.captain.date_of_arrival)
      if (captainDocSnapshot.exists()) {
        const captainData = captainDocSnapshot.data();
        if (captainData.email != teamData.captain.email) {
          console.log("CAPTAIN", teamData.captain);
          const captainData = await registerTeamMember(newTeamRef, teamData.captain, "hmUMi4XcozY2qQx9DudP", countryRef);
          await updateDoc(newTeamRef, { captain: captainData });
          await deleteDoc(doc(db, "users", teamData.captain.id));
        } else {
          await setDoc(captainReference, {
            name: teamData.captain.name,
            last_name: teamData.captain.last_name,
            email: teamData.captain.email, // Fix: Use the correct email field instead of last_name
            phone: teamData.captain.phone,
            dupr: Number(teamData.captain.dupr),
            role: teamData.captain.role, // Assign the user2 role
            country: teamData.captain.country,
            passport: teamData.captain.passport ? teamData.captain.passport : null,
            date_of_arrival: teamData.captain.date_of_arrival ? new Date(teamData.captain.date_of_arrival) : null,
            birthdate: teamData.captain.birthdate ? new Date(teamData.captain.birthdate) : null,
            airline: teamData.captain.airline ? teamData.captain.airline : null,
            flight_number: teamData.captain.flight_number ? teamData.captain.flight_number : null,
            shirt_size: teamData.captain.shirt_size ? teamData.captain.shirt_size : null,
            senior: true,
          });
        }
      }

      let aux = [];
      for (let i = 0; i < teamData.pairs.length; i++) {
        if (teamData.pairs[i].id) {
          let memberReference = await doc(db, "users", teamData.pairs[i].id);
          let memberDocSnapshot = await getDoc(memberReference);
          if (memberDocSnapshot.exists()) {
            const memberData = memberDocSnapshot.data();
            if (memberData.email != teamData.pairs[i].email) {
              const newMemberData = await registerTeamMember(newTeamRef, teamData.pairs[i], "pnUrrBdDSsZEXX4tjjDd", countryRef);
              aux.push(newMemberData);
              await deleteDoc(doc(db, "users", teamData.pairs[i].id));
            } else {
              await setDoc(memberReference, {
                name: teamData.pairs[i].name,
                last_name: teamData.pairs[i].last_name,
                email: teamData.pairs[i].email,
                phone: teamData.pairs[i].phone,
                dupr: Number(teamData.pairs[i].dupr),
                role: teamData.pairs[i].role,
                country: teamData.pairs[i].country,
                passport: teamData.pairs[i].passport ? teamData.pairs[i].passport : null,
                date_of_arrival: teamData.pairs[i].date_of_arrival ? new Date(teamData.pairs[i].date_of_arrival) : null,
                birthdate: teamData.pairs[i].birthdate ? new Date(teamData.pairs[i].birthdate) : null,
                airline: teamData.pairs[i].airline ? teamData.pairs[i].airline : null,
                flight_number: teamData.pairs[i].flight_number ? teamData.pairs[i].flight_number : null,
                shirt_size: teamData.pairs[i].shirt_size ? teamData.pairs[i].shirt_size : null,
                senior: true,
              });
              aux.push(memberReference);
            }
          }
        } else {
          const memberData = await registerTeamMember(newTeamRef, teamData.pairs[i], "pnUrrBdDSsZEXX4tjjDd", countryRef);
          aux.push(memberData);
        }
      }

      await updateDoc(newTeamRef, { team_members: aux });
      setEdit(false);

      setSuccessMessage("Your team has been updated succesfully!");
      //  location.reload()
    } catch (error) {
      setErrorMessage("There was an error when updating your team. Please try again and if the error persists contact the admin.");
      console.error("Login error:", error.message);
    }
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

  const registerTeamMember = async (newTeamRef, memberData, role, countryRef) => {
    try {
      // Create user account in Firebase Authentication
      const { email } = memberData;
      const password = generateRandomPassword();
      // const userCredential = await createUserWithEmailAndPassword(auth,email, password);

      // // Get the newly created user's UID
      // const userId = userCredential.user.uid;
      // //console.log(userId)
      const roleReference = await doc(db, "roles", role);
      // Save additional information to the database
      //console.log('mewjkcwm',memberData)
      const newUserRef = await addDoc(collection(db, "users"), {
        name: memberData.name,
        last_name: memberData.last_name,
        email: memberData.email, // Fix: Use the correct email field instead of last_name
        phone: memberData.phone,
        dupr: Number(memberData.dupr),
        role: roleReference, // Assign the user role
        country: countryRef,
        passport: memberData.passport ? memberData.passport : "",
        date_of_arrival: memberData.date_of_arrival ? new Date(memberData.date_of_arrival) : null,
        airline: memberData.airline ? memberData.airline : "",
        flight_number: memberData.flight_number ? memberData.flight_number : "",
        shirt_size: memberData.shirt_size ? memberData.shirt_size : "",
        senior: true,
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
      sendEmail(memberData.email, password, user.name + " " + user.last_name, user.country.name, `https://www.copamundialdepickleball.com/${newUserRef.id}/${newTeamRef.id}`);
      // sendEmail(memberData.email,password,user.name+" "+user.last_name,user.country.name,`http://localhost:3000/${newUserRef.id}/${newTeamRef.id}`)
      return newUserRef;
    } catch (error) {
      setErrorMessage("There was an error when updating your team. Please try again and if the error persists contact the admin.");
      throw error;
    }
  };

  // components/RegistrationForm.js

  // const nodemailer = require('nodemailer');

  const updateTeamMembers = async (newTeamRef, pairs, role) => {
    try {
      const updatePromises = [];

      for (const pair of pairs) {
        const newuser2Ref = await registerTeamMember(newTeamRef, pair, role);
        updatePromises.push(updateDoc(newTeamRef, { team_members: arrayUnion(newuser2Ref) }));
      }

      await Promise.all(updatePromises);

      //console.log("Team members updated successfully.");
    } catch (error) {
      console.error("Error updating team members:", error);
      throw error;
    }
  };

  const handleRemovePair = (index) => {
    if (teamData.pairs.length > 1) {
      setTeamData((prevTeamData) => {
        const updatedPairs = [...prevTeamData.pairs];
        updatedPairs.splice(index, 1); // Remove the pair and the corresponding second member
        return { ...prevTeamData, pairs: updatedPairs };
      });
    }
  };

  useEffect(() => {
    if (user2 && user2?.team) {
      console.log("mjkinvihenrvijernuvnreverjvk", user2);
      fillData();
    }
  }, [user2]);
  const { user, loading, getInfo } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // Redirect to the login page if the user2 is not authenticated
    } else if (!loading && user && !user.senior) {
      router.replace("/dashboard");
    }
    if (user) {
      setuser2(user);
    }
  }, [user, loading, router]);

  if (loading) {
    // You can also render a loading spinner or other UI while checking authentication
    return <Loader loading={loading} />;
  }

  const payNow = async () => {
    const teamRef = await doc(db, "teams", user2.team.id);

    setTeamRef(teamRef);

    setRegister(true);
  };
  return (
    <>
      <main className="flex min-h-screen main">
        <LazyImage src="/2403 World Cup - Web SENIOR EDITION-15.png" width={1800} height={1800} className="background-overlay" />

        <Register
          team={teamRef}
          open={register}
          setOpen={() => {
            setRegister(!register);
          }}
          setuser2={(user) => {
            setuser2(user);
          }}
        />
        <SuccessMessage
        message={successMessage}
        setMessage={(value) => {
          setSuccessMessage(value);
        }}
      />
        <ErrorMessage
          message={errorMessage}
          setMessage={(value) => {
            setErrorMessage(value);
          }}
        />
        <Navbar />
        {user2 && (
          <div className="dashboard senior">
            {user2.team && user2.role.name == "Coordinator" && !user2.team?.payment_status && (
              <div className="inscription-banner">
                <h2>You have not paid the inscription fee. Please complete the payment before September 1st to participate.</h2>
                <button
                  onClick={() => {
                    payNow();
                  }}
                >
                  Pay Now
                </button>
              </div>
            )}
            <div className="header-dashboard senior">
              <div class="gradient-circle" style={{ backgroundColor: "transparent" }}>
                <LazyImage src={user2.country.image_senior} width={300} height={300} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <h2>Welcome, {user2.name}</h2>
                <h3>{user2.role.name}</h3>
              </div>
            </div>

            {user2.team ? (
              <div className="row spacebetween">
                <div className="column-55-2">
                  <div className="row-title senior">
                    <h2>TEAM</h2>
                  </div>
                  <div className="form-container">
                    <div className="space-y-12">
                      <div className={`border-b border-gray-900/10 pb-12 ${!edit && showCoordinator ? "" : "accordion"}`}>
                        {edit ? (
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">Coordinator Information</h2>
                        ) : (
                          <div className="accordion-button-container">
                            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                              Coordinator -{" "}
                              <span style={{ color: "#CCCCCC", fontStyle: "italic" }}>
                                {user2.team.coordinator.name} {user2.team.coordinator.last_name}
                              </span>
                            </h2>
                            <div
                              className="accordion-button"
                              onClick={() => {
                                setShowCoordinator(!showCoordinator);
                              }}
                            >
                              <LazyImage src="/2403 World Cup - Web SENIOR EDITION-11.png" width={100} height={100} className="accordion-icon" />
                            </div>
                          </div>
                        )}

                        {edit ? (
                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-first-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                First name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="coordinator-first-name"
                                  name="coordinator-first-name"
                                  autoComplete="given-name"
                                  value={teamData.coordinator.name}
                                  onChange={(e) => handleInputChange("coordinator", null, "name", e.target.value)}
                                  placeholder="Enter first name"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-last-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Last name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="coordinator-last-name"
                                  name="coordinator-last-name"
                                  autoComplete="family-name"
                                  value={teamData.coordinator.last_name}
                                  onChange={(e) => handleInputChange("coordinator", null, "last_name", e.target.value)}
                                  placeholder="Enter last name"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Birthdate
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    maxDate={new Date(1974, 11, 31)}
                                    value={teamData.coordinator.birthdate}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("coordinator", null, "birthdate", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-3"></div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-email" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Email address
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coordinator-email"
                                  name="coordinator-email"
                                  type="email"
                                  autoComplete="email"
                                  value={teamData.coordinator.email}
                                  disabled={true}
                                  onChange={(e) => handleInputChange("coordinator", null, "email", e.target.value)}
                                  placeholder="Enter email address"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Phone number
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coordinator-phone"
                                  name="coordinator-phone"
                                  type="text"
                                  autoComplete="phone"
                                  value={teamData.coordinator.phone}
                                  onChange={(e) => handleInputChange("coordinator", null, "phone", e.target.value)}
                                  placeholder="Enter phone number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                DUPR Ranking
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coordinator-dupr"
                                  name="coordinator-dupr"
                                  type="number"
                                  step={"0.01"}
                                  min={"2.5"}
                                  max={"5.4"}
                                  value={teamData.coordinator.dupr}
                                  onChange={(e) => handleInputChange("coordinator", null, "dupr", e.target.value)}
                                  placeholder="Enter DUPR Ranking"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Shirt Size
                              </label>
                              <div className="mt-2">
                                <select
                                  id="coordinator-shirt-size"
                                  name="coordinator-shirt-size"
                                  type="text"
                                  value={teamData.coordinator.shirt_size}
                                  onChange={(e) => handleInputChange("coordinator", null, "shirt_size", e.target.value)}
                                  placeholder="Enter shirt size"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                >
                                  <option value={"XS"}>XS</option>
                                  <option value={"S"}>S</option>
                                  <option value={"M"}>M</option>
                                  <option value={"L"}>L</option>
                                  <option value={"XL"}>XL</option>
                                </select>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Passport
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coordinator-passport"
                                  name="coordinator-passport"
                                  type="text"
                                  value={teamData.coordinator.passport}
                                  onChange={(e) => handleInputChange("coordinator", null, "passport", e.target.value)}
                                  placeholder="Enter passport number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Date of Arrival
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    value={teamData.coordinator.date_of_arrival}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("coordinator", null, "date_of_arrival", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Airline
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coordinator-airline"
                                  name="coordinator-airline"
                                  type="text"
                                  value={teamData.coordinator.airline}
                                  onChange={(e) => handleInputChange("coordinator", null, "airline", e.target.value)}
                                  placeholder="Enter airline"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Flight number
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coordinator-flight-number"
                                  name="coordinator-flight-number"
                                  type="text"
                                  value={teamData.coordinator.flight_number}
                                  onChange={(e) => handleInputChange("coordinator", null, "flight_number", e.target.value)}
                                  placeholder="Enter flight number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={` ${showCoordinator ? "mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 show" : "no-show"}`}>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-first-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                First name
                              </label>
                              <div className="mt-2">
                                <input disabled={true} type="text" id="coordinator-first-name" name="coordinator-first-name" autoComplete="given-name" value={teamData.coordinator.name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-last-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Last name
                              </label>
                              <div className="mt-2">
                                <input disabled={true} type="text" id="coordinator-last-name" name="coordinator-last-name" autoComplete="family-name" value={teamData.coordinator.last_name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Birthdate
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    maxDate={new Date(1974, 11, 31)}
                                    value={teamData.coordinator.birthdate}
                                    disabled={true}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("coordinator", null, "birthdate", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-3"></div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-email" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Email address
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coordinator-email" name="coordinator-email" type="email" autoComplete="email" value={teamData.coordinator.email} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Phone number
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coordinator-phone" name="coordinator-phone" type="text" autoComplete="phone" value={teamData.coordinator.phone} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                DUPR Ranking
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coordinator-dupr" name="coordinator-dupr" type="number" step={"0.01"} min={"2.5"} max={"5.4"} value={teamData.coordinator.dupr} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Shirt Size
                              </label>
                              <div className="mt-2">
                                <select disabled={true} id="coordinator-shirt-size" name="coordinator-shirt-size" type="text" value={teamData.coordinator.shirt_size} className="block w-full rounded-md sm:text-sm sm:leading-6 input">
                                  <option value={"XS"}>XS</option>
                                  <option value={"S"}>S</option>
                                  <option value={"M"}>M</option>
                                  <option value={"L"}>L</option>
                                  <option value={"XL"}>XL</option>
                                </select>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Passport
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coordinator-passport" name="coordinator-passport" type="text" value={teamData.coordinator.passport} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Date of Arrival
                              </label>
                              <div className="mt-2 relative">
                                <input disabled={true} id="coordinator-passport" name="coordinator-passport" type="text" value={teamData.coordinator.date_of_arrival} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Airline
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coordinator-airline" name="coordinator-airline" type="text" value={teamData.coordinator.airline} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coordinator-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Flight number
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coordinator-flight-number" name="coordinator-flight-number" type="text" value={teamData.coordinator.flight_number} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`border-b border-gray-900/10 pb-12 ${!edit && showCoach ? "" : "accordion"}`}>
                        {edit ? (
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">Coach Information</h2>
                        ) : (
                          <div className="accordion-button-container">
                            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                              Coach -{" "}
                              <span style={{ color: "#CCCCCC", fontStyle: "italic" }}>
                                {user2.team.coach?.name} {user2.team.coach?.last_name}
                              </span>
                            </h2>
                            <div
                              className="accordion-button"
                              onClick={() => {
                                setShowCoach(!showCoach);
                              }}
                            >
                              <LazyImage src="/2403 World Cup - Web SENIOR EDITION-11.png" width={100} height={100} className="accordion-icon" />
                            </div>
                          </div>
                        )}

                        {edit ? (
                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-first-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                First name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="coach-first-name"
                                  name="coach-first-name"
                                  autoComplete="given-name"
                                  value={teamData.coach?.name}
                                  onChange={(e) => handleInputChange("coach", null, "name", e.target.value)}
                                  placeholder="Enter first name"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coach-last-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Last name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="coach-last-name"
                                  name="coach-last-name"
                                  autoComplete="family-name"
                                  value={teamData.coach?.last_name}
                                  onChange={(e) => handleInputChange("coach", null, "last_name", e.target.value)}
                                  placeholder="Enter last name"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Birthdate
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    maxDate={new Date(1974, 11, 31)}
                                    value={teamData.coach?.birthdate}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("coach", null, "birthdate", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-3"></div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-email" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Email address
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coach-email"
                                  name="coach-email"
                                  type="email"
                                  autoComplete="email"
                                  value={teamData.coach?.email}
                                  onChange={(e) => handleInputChange("coach", null, "email", e.target.value)}
                                  placeholder="Enter email address"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Phone number
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coach-phone"
                                  name="coach-phone"
                                  type="text"
                                  autoComplete="phone"
                                  value={teamData.coach?.phone}
                                  onChange={(e) => handleInputChange("coach", null, "phone", e.target.value)}
                                  placeholder="Enter phone number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                DUPR Ranking
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coach-dupr"
                                  name="coach-dupr"
                                  type="number"
                                  step={"0.01"}
                                  min={"2.5"}
                                  max={"5.4"}
                                  value={teamData.coach?.dupr}
                                  onChange={(e) => handleInputChange("coach", null, "dupr", e.target.value)}
                                  placeholder="Enter DUPR Ranking"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Shirt Size
                              </label>
                              <div className="mt-2">
                                <select
                                  id="coach-shirt-size"
                                  name="coach-shirt-size"
                                  type="text"
                                  value={teamData.coach?.shirt_size}
                                  onChange={(e) => handleInputChange("coach", null, "shirt_size", e.target.value)}
                                  placeholder="Enter shirt size"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                >
                                  <option value={"XS"}>XS</option>
                                  <option value={"S"}>S</option>
                                  <option value={"M"}>M</option>
                                  <option value={"L"}>L</option>
                                  <option value={"XL"}>XL</option>
                                </select>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Passport
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coach-passport"
                                  name="coach-passport"
                                  type="text"
                                  value={teamData.coach?.passport}
                                  onChange={(e) => handleInputChange("coach", null, "passport", e.target.value)}
                                  placeholder="Enter passport number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Date of Arrival
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    value={teamData.coach?.date_of_arrival}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("coach", null, "date_of_arrival", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Airline
                              </label>
                              <div className="mt-2">
                                <input id="coach-airline" name="coach-airline" type="text" value={teamData.coach?.airline} onChange={(e) => handleInputChange("coach", null, "airline", e.target.value)} placeholder="Enter airline" className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Flight number
                              </label>
                              <div className="mt-2">
                                <input
                                  id="coach-flight-number"
                                  name="coach-flight-number"
                                  type="text"
                                  value={teamData.coach?.flight_number}
                                  onChange={(e) => handleInputChange("coach", null, "flight_number", e.target.value)}
                                  placeholder="Enter flight number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={` ${showCoach ? "mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 show" : "no-show"}`}>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-first-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                First name
                              </label>
                              <div className="mt-2">
                                <input disabled={true} type="text" id="coach-first-name" name="coach-first-name" autoComplete="given-name" value={teamData.coach?.name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coach-last-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Last name
                              </label>
                              <div className="mt-2">
                                <input disabled={true} type="text" id="coach-last-name" name="coach-last-name" autoComplete="family-name" value={teamData.coach?.last_name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Birthdate
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    maxDate={new Date(1974, 11, 31)}
                                    value={teamData.coach?.birthdate}
                                    disabled={true}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("coach", null, "birthdate", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-3"></div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-email" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Email address
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coach-email" name="coach-email" type="email" autoComplete="email" value={teamData.coach?.email} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Phone number
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coach-phone" name="coach-phone" type="text" autoComplete="phone" value={teamData.coach?.phone} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                DUPR Ranking
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coach-dupr" name="coach-dupr" type="number" step={"0.01"} min={"2.5"} max={"5.4"} value={teamData.coach?.dupr} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Shirt Size
                              </label>
                              <div className="mt-2">
                                <select disabled={true} id="coach-shirt-size" name="coach-shirt-size" type="text" value={teamData.coach?.shirt_size} className="block w-full rounded-md sm:text-sm sm:leading-6 input">
                                  <option value={"XS"}>XS</option>
                                  <option value={"S"}>S</option>
                                  <option value={"M"}>M</option>
                                  <option value={"L"}>L</option>
                                  <option value={"XL"}>XL</option>
                                </select>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Passport
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coach-passport" name="coach-passport" type="text" value={teamData.coach?.passport} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Date of Arrival
                              </label>
                              <div className="mt-2 relative">
                                <div className="mt-2">
                                  <input disabled={true} id="coach-passport" name="coach-passport" type="text" value={teamData.coach?.date_of_arrival} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Airline
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coach-airline" name="coach-airline" type="text" value={teamData.coach?.airline} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Flight number
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="coach-flight-number" name="coach-flight-number" type="text" value={teamData.coach?.flight_number} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`border-b border-gray-900/10 pb-12 ${!edit && showCoach ? "" : "accordion"}`}>
                        {edit ? (
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">Captain Information</h2>
                        ) : (
                          <div className="accordion-button-container">
                            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                              Captain - {user2.team.captain.name} {user2.team.captain.last_name}
                            </h2>
                            <div
                              className="accordion-button"
                              onClick={() => {
                                setShowCaptain(!showCaptain);
                              }}
                            >
                              <LazyImage src="/2403 World Cup - Web SENIOR EDITION-11.png" width={100} height={100} className="accordion-icon" />
                            </div>
                          </div>
                        )}

                        {edit ? (
                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-first-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                First name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="captain-first-name"
                                  name="captain-first-name"
                                  autoComplete="given-name"
                                  value={teamData.captain.name}
                                  onChange={(e) => handleInputChange("captain", null, "name", e.target.value)}
                                  placeholder="Enter first name"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="captain-last-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Last name
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  id="captain-last-name"
                                  name="captain-last-name"
                                  autoComplete="family-name"
                                  value={teamData.captain.last_name}
                                  onChange={(e) => handleInputChange("captain", null, "last_name", e.target.value)}
                                  placeholder="Enter last name"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Birthdate
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    maxDate={new Date(1974, 11, 31)}
                                    value={teamData.captain.birthdate}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("captain", null, "birthdate", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-3"></div>

                            <div className="sm:col-span-3">
                              <label htmlFor="captain-email" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Email address
                              </label>
                              <div className="mt-2">
                                <input
                                  id="captain-email"
                                  name="captain-email"
                                  type="email"
                                  autoComplete="email"
                                  value={teamData.captain.email}
                                  onChange={(e) => handleInputChange("captain", null, "email", e.target.value)}
                                  placeholder="Enter email address"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Phone number
                              </label>
                              <div className="mt-2">
                                <input
                                  id="captain-phone"
                                  name="captain-phone"
                                  type="text"
                                  autoComplete="phone"
                                  value={teamData.captain.phone}
                                  onChange={(e) => handleInputChange("captain", null, "phone", e.target.value)}
                                  placeholder="Enter phone number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                DUPR Ranking
                              </label>
                              <div className="mt-2">
                                <input
                                  id="captain-dupr"
                                  name="captain-dupr"
                                  type="number"
                                  step={"0.01"}
                                  min={"2.5"}
                                  max={"5.4"}
                                  value={teamData.captain.dupr}
                                  onChange={(e) => handleInputChange("captain", null, "dupr", e.target.value)}
                                  placeholder="Enter DUPR Ranking"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Shirt Size
                              </label>
                              <div className="mt-2">
                                <select
                                  id="captain-shirt-size"
                                  name="captain-shirt-size"
                                  type="text"
                                  value={teamData.captain.shirt_size}
                                  onChange={(e) => handleInputChange("captain", null, "shirt_size", e.target.value)}
                                  placeholder="Enter shirt size"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                >
                                  <option value={"XS"}>XS</option>
                                  <option value={"S"}>S</option>
                                  <option value={"M"}>M</option>
                                  <option value={"L"}>L</option>
                                  <option value={"XL"}>XL</option>
                                </select>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Passport
                              </label>
                              <div className="mt-2">
                                <input
                                  id="captain-passport"
                                  name="captain-passport"
                                  type="text"
                                  value={teamData.captain.passport}
                                  onChange={(e) => handleInputChange("captain", null, "passport", e.target.value)}
                                  placeholder="Enter passport number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Date of Arrival
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    value={teamData.captain.date_of_arrival}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("captain", null, "date_of_arrival", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Airline
                              </label>
                              <div className="mt-2">
                                <input
                                  id="captain-airline"
                                  name="captain-airline"
                                  type="text"
                                  value={teamData.captain.airline}
                                  onChange={(e) => handleInputChange("captain", null, "airline", e.target.value)}
                                  placeholder="Enter airline"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Flight number
                              </label>
                              <div className="mt-2">
                                <input
                                  id="captain-flight-number"
                                  name="captain-flight-number"
                                  type="text"
                                  value={teamData.captain.flight_number}
                                  onChange={(e) => handleInputChange("captain", null, "flight_number", e.target.value)}
                                  placeholder="Enter flight number"
                                  className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className={` ${showCaptain ? "mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 show" : "no-show"}`}>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-first-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                First name
                              </label>
                              <div className="mt-2">
                                <input disabled={true} type="text" id="captain-first-name" name="captain-first-name" autoComplete="given-name" value={teamData.captain.name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="captain-last-name" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Last name
                              </label>
                              <div className="mt-2">
                                <input disabled={true} type="text" id="captain-last-name" name="captain-last-name" autoComplete="family-name" value={teamData.captain.last_name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Birthdate
                              </label>
                              <div className="mt-2 relative">
                                <div className="datepicker">
                                  <Datepicker
                                    maxDate={new Date(1974, 11, 31)}
                                    value={teamData.captain.birthdate}
                                    disabled={true}
                                    onSelectedDateChanged={(e) => {
                                      handleInputChange("captain", null, "birthdate", format(e, "MM/dd/yyyy"));
                                    }}
                                    format={"MM/DD/YYYY"}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-3"></div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-email" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Email address
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="captain-email" name="captain-email" type="email" autoComplete="email" value={teamData.captain.email} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Phone number
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="captain-phone" name="captain-phone" type="text" autoComplete="phone" value={teamData.captain.phone} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                DUPR Ranking
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="captain-dupr" name="captain-dupr" type="number" step={"0.01"} min={"2.5"} max={"5.4"} value={teamData.captain.dupr} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Shirt Size
                              </label>
                              <div className="mt-2">
                                <select disabled={true} id="captain-shirt-size" name="captain-shirt-size" type="text" value={teamData.captain.shirt_size} className="block w-full rounded-md sm:text-sm sm:leading-6 input">
                                  <option value={"XS"}>XS</option>
                                  <option value={"S"}>S</option>
                                  <option value={"M"}>M</option>
                                  <option value={"L"}>L</option>
                                  <option value={"XL"}>XL</option>
                                </select>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Passport
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="captain-passport" name="captain-passport" type="text" value={teamData.captain.passport} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Date of Arrival
                              </label>
                              <div className="mt-2 relative">
                                <div className="mt-2">
                                  <input disabled={true} id="captain-passport" name="captain-passport" type="text" value={teamData.captain.date_of_arrival} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Airline
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="captain-airline" name="captain-airline" type="text" value={teamData.captain.airline} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                            <div className="sm:col-span-3">
                              <label htmlFor="captain-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                Flight number
                              </label>
                              <div className="mt-2">
                                <input disabled={true} id="captain-flight-number" name="captain-flight-number" type="text" value={teamData.captain.flight_number} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className={`border-b border-gray-900/10 pb-12 ${edit ? "" : "accordion"}`}>
                        {edit ? (
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">Team Information</h2>
                        ) : (
                          <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
                            <span style={{ color: "#CCCCCC", fontWeight: "bold", textTransform: "uppercase" }}>
                              {" "}
                              Team - {user2.team.team_members.length} {user2.team.team_members.length > 1 ? "Players" : "Player"}
                            </span>
                          </h2>
                        )}

                        {Array.from(
                          { length: teamData.pairs.length },
                          (_, index) =>
                            edit && ( // Remove the curly braces here
                              <div key={index} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-10">
                                {/* First member of the pair */}

                                <h2 className="text-base font-semibold leading-7 text-gray-900 sm:col-span-5 form-title">Player {index + 1}</h2>
                                {teamData.pairs.length > 1 && (
                                  <h2
                                    onClick={() => {
                                      handleRemovePair(index);
                                    }}
                                    style={{
                                      textAlign: "center",
                                      color: "#da9645",
                                      cursor: "pointer",
                                      borderColor: "#da9645",
                                      minWidth: "fit-content",
                                    }}
                                    className="text-xs font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-100 opacity-80"
                                  >
                                    Remove
                                  </h2>
                                )}

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
                                      value={teamData.pairs[index]?.name}
                                      onChange={(e) => handleInputChange("pairs", index, "name", e.target.value)}
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
                                      value={teamData.pairs[index]?.last_name}
                                      onChange={(e) => handleInputChange("pairs", index, "last_name", e.target.value)}
                                      placeholder="Enter last name"
                                      className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                    />
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Birthdate
                                  </label>
                                  <div className="mt-2 relative">
                                    <div className="datepicker">
                                      <Datepicker
                                        maxDate={new Date(1974, 11, 31)}
                                        value={teamData.pairs[index]?.birthdate}
                                        onSelectedDateChanged={(e) => {
                                          handleInputChange("pairs", index, "birthdate", format(e, "MM/dd/yyyy"));
                                        }}
                                        format={"MM/DD/YYYY"}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="sm:col-span-3"></div>
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
                                      value={teamData.pairs[index]?.email}
                                      onChange={(e) => handleInputChange("pairs", index, "email", e.target.value)}
                                      placeholder="Enter email address"
                                      className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                    />
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <label htmlFor={`pair-phone-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Phone number
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      id={`pair-phone-${index}`}
                                      name={`pair-phone-${index}`}
                                      type="text"
                                      autoComplete="phone"
                                      value={teamData.pairs[index]?.phone}
                                      onChange={(e) => handleInputChange("pairs", index, "phone", e.target.value)}
                                      placeholder="Enter phone number"
                                      className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                    />
                                  </div>
                                </div>

                                <div className="sm:col-span-3">
                                  <label htmlFor={`pair-dupr-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    DUPR Ranking
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      id={`pair-phone-${index}`}
                                      name={`pair-phone-${index}`}
                                      type="number"
                                      step={"0.01"}
                                      min={"2.5"}
                                      max={"5.4"}
                                      value={teamData.pairs[index]?.dupr}
                                      onChange={(e) => handleInputChange("pairs", index, "dupr", e.target.value)}
                                      placeholder="Enter DUPR Ranking"
                                      className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                    />
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <label htmlFor={`pair-shirt-size-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Shirt Size
                                  </label>
                                  <div className="mt-2">
                                    <select
                                      id={`pair-shirt-size-${index}`}
                                      name={`pair-shirt-size-${index}`}
                                      type="text"
                                      value={teamData.pairs[index]?.shirt_size}
                                      onChange={(e) => handleInputChange("pairs", index, "shirt_size", e.target.value)}
                                      placeholder="Enter shirt size"
                                      className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                    >
                                      <option value={"XS"}>XS</option>
                                      <option value={"S"}>S</option>
                                      <option value={"M"}>M</option>
                                      <option value={"L"}>L</option>
                                      <option value={"XL"}>XL</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <label htmlFor={`pair-passport-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Passport
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      id={`pair-passport-${index}`}
                                      name={`pair-passport-${index}`}
                                      type="text"
                                      value={teamData.pairs[index]?.passport}
                                      onChange={(e) => handleInputChange("pairs", index, "passport", e.target.value)}
                                      placeholder="Enter passport number"
                                      className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                    />
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <label htmlFor={`pair-date-of-arrival-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Date of Arrival
                                  </label>
                                  <div className="mt-2">
                                    <div className="datepicker">
                                      <Datepicker
                                        value={teamData.pairs[index]?.date_of_arrival}
                                        onSelectedDateChanged={(e) => {
                                          handleInputChange("pairs", index, "date_of_arrival", format(e, "MM/dd/yyyy"));
                                        }}
                                        format={"MM/DD/YYYY"}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <label htmlFor={`pair-airline-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Airline
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      id={`pair-airline-${index}`}
                                      name={`pair-airline-${index}`}
                                      type="text"
                                      value={teamData.pairs[index]?.airline}
                                      onChange={(e) => handleInputChange("pairs", index, "airline", e.target.value)}
                                      placeholder="Enter airline"
                                      className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                                    />
                                  </div>
                                </div>
                                <div className="sm:col-span-3">
                                  <label htmlFor={`pair-flight-number-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Flight number
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      id={`pair-flight-number-${index}`}
                                      name={`pair-flight-number-${index}`}
                                      type="text"
                                      value={teamData.pairs[index]?.flight_number}
                                      onChange={(e) => handleInputChange("pairs", index, "flight_number", e.target.value)}
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
                              <div key={index} className={`grid grid-cols-1 gap-x-6 sm:grid-cols-6 mt-10" ${edit ? "" : "accordion"}`}>
                                <div className="accordion-button-container sm:col-span-6">
                                  <h2 className="text-base font-semibold leading-7 text-gray-900 sm:col-span-5 form-title">
                                    Player {index + 1} -{" "}
                                    <span style={{ color: "#CCCCCC", fontStyle: "italic" }}>
                                      {teamData.pairs[index]?.name} {teamData.pairs[index]?.last_name}
                                    </span>
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
                                    <LazyImage src="/2403 World Cup - Web SENIOR EDITION-11.png" width={100} height={100} className="accordion-icon" />
                                  </div>
                                </div>

                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-first-name-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    First name
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} type="text" id={`pair-first-name-${index}`} name={`pair-first-name-${index}`} autoComplete="given-name" value={teamData.pairs[index]?.name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>

                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-last-name-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Last name
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} type="text" id={`pair-last-name-${index}`} name={`pair-last-name-${index}`} autoComplete="family-name" value={teamData.pairs[index]?.last_name} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor="coach-dupr" className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Birthdate
                                  </label>
                                  <div className="mt-2 relative">
                                    <div className="datepicker">
                                      <Datepicker
                                        maxDate={new Date(1974, 11, 31)}
                                        value={teamData.pairs[index]?.birthdate}
                                        onSelectedDateChanged={(e) => {
                                          handleInputChange("pairs", index, "birthdate", format(e, "MM/dd/yyyy"));
                                        }}
                                        format={"MM/DD/YYYY"}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}></div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-email-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Email address
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} id={`pair-email-${index}`} name={`pair-email-${index}`} type="email" autoComplete="email" value={teamData.pairs[index]?.email} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-phone-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Phone number
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} id={`pair-phone-${index}`} name={`pair-phone-${index}`} type="text" autoComplete="phone" value={teamData.pairs[index]?.phone} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>

                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-dupr-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    DUPR Ranking
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} id={`pair-phone-${index}`} name={`pair-phone-${index}`} type="number" step={"0.01"} min={"2.5"} max={"5.4"} value={teamData.pairs[index]?.dupr} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-shirt-size-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Shirt Size
                                  </label>
                                  <div className="mt-2">
                                    <select disabled={true} id={`pair-shirt-size-${index}`} name={`pair-shirt-size-${index}`} type="text" value={teamData.pairs[index]?.shirt_size} className="block w-full rounded-md sm:text-sm sm:leading-6 input">
                                      <option value={"XS"}>XS</option>
                                      <option value={"S"}>S</option>
                                      <option value={"M"}>M</option>
                                      <option value={"L"}>L</option>
                                      <option value={"XL"}>XL</option>
                                    </select>
                                  </div>
                                </div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-passport-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Passport
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} id={`pair-passport-${index}`} name={`pair-passport-${index}`} type="text" value={teamData.pairs[index]?.passport} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-date-of-arrival-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Date of Arrival
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} id={`pair-passport-${index}`} name={`pair-passport-${index}`} type="text" value={teamData.pairs[index]?.date_of_arrival} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-airline-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Airline
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} id={`pair-airline-${index}`} name={`pair-airline-${index}`} type="text" value={teamData.pairs[index]?.airline} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
                                  </div>
                                </div>
                                <div className={`sm:col-span-3 ${showPairs[index] ? "show" : "no-show"}`}>
                                  <label htmlFor={`pair-flight-number-${index}`} className="block text-sm font-medium leading-6 text-gray-900 form-title">
                                    Flight number
                                  </label>
                                  <div className="mt-2">
                                    <input disabled={true} id={`pair-flight-number-${index}`} name={`pair-flight-number-${index}`} type="text" value={teamData.pairs[index]?.flight_number} className="block w-full rounded-md sm:text-sm sm:leading-6 input" />
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
                                color: "#000",
                                cursor: "pointer",
                                borderColor: "#CCCCCC",
                                backgroundColor: "#CCCCCC",
                              }}
                              className="text-sm font-semibold leading-7 text-gray-900 sm:col-span-1 form-title border border-da9645 border-2 rounded-md p-2 transition-opacity duration-500 ease-in-out hover:opacity-80 opacity-100"
                            >
                              + Add Player
                            </h2>
                          </div>
                        )}
                      </div>
                    </div>

                    {edit && user2.role.name == "Coordinator" && (
                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => {
                            setEdit(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            saveData();
                          }}
                          className="senior gold-button2"
                        >
                          Save
                        </button>
                      </div>
                    )}
                    {!edit && user2.role.name == "Coordinator" && (
                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          onClick={(e) => {
                            setEdit(true);
                          }}
                          className="senior gold-button2"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="column-45-2">
                  <div className="option-dashboard senior">
                    <div className="gradient-circle2">
                      <LazyImage src="/2403 World Cup - Web SENIOR EDITION-13.png" width={200} height={200} />
                    </div>
                    <div className="content">
                      <h2>Fellowship Tour</h2>
                      <h3></h3>
                      <div className="button-container">
                        <button disabled>Coming Soon</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="column-55-2">
                  <div className="row-title senior">
                    <h2>TEAM</h2>
                  </div>
                  <div className="w-full p-5 h-full empty-team">
                    <h2>Start by creating your team.</h2>
                    <div className="mt-6 flex items-center justify-end gap-x-6 h-full">
                      {user?.role.name == "Coordinator" && (
                        <button
                          onClick={(e) => {
                            setRegister(true);
                          }}
                          className="senior gold-button"
                        >
                          Create Team
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <Footer />
      </main>
    </>
  );
};

export default ProtectedPage;
