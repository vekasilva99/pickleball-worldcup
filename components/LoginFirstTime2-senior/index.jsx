"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import styles from "./login.module.css";
import { auth } from "@/firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase"; // Replace with your actual Firebase import path


import { Loader } from "../Loader2";
import { ErrorMessage } from "../ErrorMessage";


export default function Login({ showLogin, setShowLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const router = useRouter();
  const params = useParams();
  //console.log("params", params);

  const changeUserInTeam = async (newUserRef) => {
    try {
      const teamReference = await doc(db, "teams", user.team.id);
      const teamDocSnapshot = await getDoc(teamReference);
      if (teamDocSnapshot.exists()) {
        const teamData = teamDocSnapshot.data();
        //console.log("TEAM", teamData);

        if (user.role.name == "Team Member") {
          for (let i = 0; i < teamData.team_members.length; i++) {
            //console.log("Holaaa", teamData.team_members[i].id);
            if (teamData.team_members[i].id == params.userId) {
              //console.log("IGUAL");
              teamData.team_members[i] = newUserRef;
            }
          }
        } else if (user.role.name == "Coach") {
          teamData.coach = newUserRef;
        }else if (user.role.name == "Captain") {
          teamData.captain = newUserRef;
        }
        await setDoc(teamReference, teamData);

        //console.log("TEAM NUEVO", teamData);
      }
    } catch (error) {
      setErrorMessage(error.message)
      console.error("Login error:", error.message);
    }
  };
  const handleLogin = async () => {
    if (password.trim() == "" || password2.trim() == "") {
      return;
    }

    if (password != password2) {
      setErrorMessage('Password do not match.')
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must have at least 6 characters.')
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        password
      );

      // Get the newly created user's UID
      const userId = userCredential.user.uid;
      //console.log("judiwjidwkd", userId);
      const userReference = await doc(db, "users", params.userId);
      const userDocSnapshot = await getDoc(userReference);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        //console.log(userData);

        const newUserRef = doc(db, "users", userId);
        
        await setDoc(newUserRef, {
          name: userData.name,
          last_name: userData.last_name,
          email: userData.email, // Fix: Use the correct email field instead of last_name
          phone: userData.phone,
          dupr: Number(userData.dupr),
          role: userData.role,
          country:userData.country,
          senior: true
        });
        const newUserDocSnapshot = await getDoc(newUserRef);
console.log(newUserDocSnapshot.data())
        if (newUserDocSnapshot === undefined) {
          console.error("Error creating user document.");
        } else {
         
          await deleteDoc(doc(db, "users", params.userId));
          //console.log("User document created successfully:", newUserRef);
       
          router.push('/dashboard/senior')
        }

    
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const getUserDataFromFirestore = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        // Assuming there's a 'role' field to determine user's role
        const userRoleDocSnapshot = await getDoc(userData.role);
        const userRole = userRoleDocSnapshot.data();
        const countryDocSnapshot= await getDoc(userData.country);
        const country = countryDocSnapshot.data();
        country.id=countryDocSnapshot.id
        if (userRole.name === "Coordinator") {
          // Fetch team data based on the Coordinator or coach role
          // Assuming 'coordinatorId' is a reference to the user table
          const teamsQuerySnapshot = await getTeamsByCoordinator(userDocRef);

          if (!teamsQuerySnapshot.empty) {
            const teamDocSnapshot = teamsQuerySnapshot.docs[0];
            const teamData = teamDocSnapshot.data();
            userData.team = {
              id: teamDocSnapshot.id,
              ...teamData,
            };
          } else {
            userData.team = null; // User is not a coordinator or coach of any team
          }
        } else if (userRole.name === "Coach") {
          // Fetch team data based on the coordinator or coach role
          // Assuming 'coordinatorId' is a reference to the user table
          const teamsQuerySnapshot = await getTeamsByCoach(userDocRef);

          if (!teamsQuerySnapshot.empty) {
            const teamDocSnapshot = teamsQuerySnapshot.docs[0];
            const teamData = teamDocSnapshot.data();
            userData.team = {
              id: teamDocSnapshot.id,
              ...teamData,
            };
          } else {
            userData.team = null; // User is not a coordinator or coach of any team
          }
        } else if (userRole.name === "Captain") {
          // Fetch team data based on the coordinator or coach role
          // Assuming 'coordinatorId' is a reference to the user table
          const teamsQuerySnapshot = await getTeamsByCaptain(userDocRef);

          if (!teamsQuerySnapshot.empty) {
            const teamDocSnapshot = teamsQuerySnapshot.docs[0];
            const teamData = teamDocSnapshot.data();
            userData.team = {
              id: teamDocSnapshot.id,
              ...teamData,
            };
          } else {
            userData.team = null; // User is not a coordinator or coach of any team
          }
        }else {
          // Handle team members
          const teamMembersQuerySnapshot = await getTeamsByMember(uid);

          if (!teamMembersQuerySnapshot.empty) {
            const teamDocSnapshot = teamMembersQuerySnapshot.docs[0];
            const teamData = teamDocSnapshot.data();
            userData.team = {
              id: teamDocSnapshot.id,
              ...teamData,
            };
          } else {
            userData.team = null; // User is not a team member
          }
        }

        // ... Other code to fetch and include other role information

        if (userData.team != null) {
          userData.team.coordinator = await getTeamInformation(
            userData.team.coordinator
          );
          userData.team.coach = await getTeamInformation(userData.team.coach);
          userData.team.captain = await getTeamInformation(userData.team.captain);
          for (let i = 0; i < userData.team.team_members.length; i++) {
            userData.team.team_members[i] = await getTeamInformation(
              userData.team.team_members[i]
            );
          }
        }

        userData.role = userRole;
        userData.country=country;

        //console.log(userData);
        setLoading(false);
        return userData;
      } else {
        setErrorMessage("User document does not exist.")
        console.error("User document does not exist.");
        return null;
      }
    } catch (error) {
      setErrorMessage("Oops. Something went wrong. Try again, if the error persists contact an admin.")
      console.error("Error fetching user data from Firestore:", error);
      throw error;
    }
  };

  const getTeamInformation = async (userDocRef) => {
    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = await userDocSnapshot.data();
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      
      console.error("Error fetching team information:", error);
      throw error;
    }
  };

  // Helper function to get teams by Coordinator or coach
  const getTeamsByCoordinator = async (userDocRef) => {
    // Implement your Firestore query to get teams by Coordinator or coach
    const teamsQuerySnapshot = await getDocs(
      collection(db, "teams"),
      where("coordinator", "==", userDocRef)
    );

    return teamsQuerySnapshot;
  };
  const getTeamsByCaptain = async (userDocRef) => {
    // Implement your Firestore query to get teams by Coordinator or coach
    const teamsQuerySnapshot = await getDocs(
      collection(db, "teams"),
      where("captain", "==", userDocRef)
    );

    return teamsQuerySnapshot;
  };
  const getTeamsByCoach = async (userDocRef) => {
    // Implement your Firestore query to get teams by coordinator or coach
    const teamsQuerySnapshot = await getDocs(
      collection(db, "teams"),
      where("coach", "==", userDocRef)
    );

    return teamsQuerySnapshot;
  };

  // Helper function to get teams by member
  const getTeamsByMember = async (memberUid) => {
    // Implement your Firestore query to get teams by member UID
    const teamsQuerySnapshot = await getDocs(
      collection(db, "teams"),
      where("team_members", "array-contains", memberUid)
    );

    return teamsQuerySnapshot;
  };

  const getInfo = async () => {
    const userDataFromFirestore = await getUserDataFromFirestore(params.userId);
    //console.log(userDataFromFirestore);
    if(userDataFromFirestore){
    setUser({
      uid: params.userId,
      ...userDataFromFirestore, // Include additional data from Firestore
    });
  }else{
    setUser(null)
  }
  setLoading(false)
  };
  useEffect(() => {
    if (params.userId) {
      getInfo();
    }
  }, [params]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/"); // Redirect to the login page if the user is not authenticated
    }else if(!loading && user && !user.senior){
      router.replace(`/${params.userId}`); 
    }
  }, [user, loading, router]);

  if (loading) {
    // You can also render a loading spinner or other UI while checking authentication
    return <Loader loading={loading} />;
  }

  const isLoginDisabled = email === "" || password === "";
  return (
    <>
     <ErrorMessage    message={errorMessage}
        setMessage={(value) => {
          setErrorMessage(value);
        }}/>
      {user && (
        <>
             <img src="/2403 World Cup - Web SENIOR EDITION-15.png" className={styles.overlay}/>
        <div
          className={
            showLogin
              ? styles.loginOverlay
              : `${styles.loginOverlay} ${styles.hidden}`
          }
        >
          <div className={styles.loginContainer}>
         
              <img src={user.country.image_senior} />
        
            <h1>Welcome to the Pickleball World Cup!</h1>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1 w-full">
              <div className="sm:col-span-5">
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    type="email"
                    autoComplete="email"
                    disabled={true}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    placeholder="Password"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
              <div className="sm:col-span-5">
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="password"
                    value={password2}
                    onChange={(e) => {
                      setPassword2(e.target.value);
                    }}
                    placeholder="Confirm Password"
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                onClick={() => {
                  handleLogin();
                }}
                className="senior gold-button3"
                // disabled={isLoginDisabled}
              >
                Log In
              </button>
            </div>
          </div>
     
        </div>
     
        </>
      )}
    </>
  );
}
