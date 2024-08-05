// Your authentication hook
import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "@/firebase/firebase"; // Replace with your actual Firebase import path
import { doc, getDoc, getDocs, collection, where,query } from "firebase/firestore";
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserDataFromFirestore = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        userData.id=userDocSnapshot.id

        // Assuming there's a 'role' field to determine user's role
        const userRoleDocSnapshot = await getDoc(userData.role);
        const userRole = userRoleDocSnapshot.data();
        const countryDocSnapshot = await getDoc(userData.country);
        const country = countryDocSnapshot.data();
        //console.log('ROL',userRole)
        country.id=countryDocSnapshot.id;
        if (userRole.name === "Coordinator") {
          // Fetch team data based on the Coordinator or coach role
          // Assuming 'CoordinatorId' is a reference to the user table
          const teamsQuerySnapshot = await getTeamsByCoordinator(userDocRef);

          if (!teamsQuerySnapshot.empty) {
           
            const teamDocSnapshot = teamsQuerySnapshot.docs[0];
            const teamData = teamDocSnapshot.data();
            userData.team = {
              id: teamDocSnapshot.id,
              ...teamData,
            };
            const teamDoc = doc(db, "teams", teamDocSnapshot.id);
            console.log('ENTREEEEEEE',userData)
            const reservationQuerySnapshot= await getReservation(teamDoc)
            console.log('jnhubgyvftcdrxesdrfcgvhbjnk',reservationQuerySnapshot)
            if (!reservationQuerySnapshot.empty) {
              let auxReservations=[]
              reservationQuerySnapshot.docs.map((reservation)=>
                auxReservations.push({id:reservation.id,...reservation.data()})
              )
              console.log("jinivjnekv",auxReservations)
              const reservationDocSnapshot = reservationQuerySnapshot.docs[0];
              const reservationData = reservationDocSnapshot.data();
              userData.team.reservation = auxReservations
            }

            const tourQuerySnapshot= await getTour(userDocRef)
            console.log('jnhubgyvftcdrxesdrfcgvhbjnk',tourQuerySnapshot)
            if (!tourQuerySnapshot.empty) {
              let auxTour=[]
              tourQuerySnapshot.docs.map((reservation)=>
                auxTour.push({id:reservation.id,...reservation.data()})
              )
              console.log("jinivjnekv",auxTour)
              userData.tour = auxTour
            }
          } else {
            userData.team = null; // User is not a Coordinator or coach of any team
          }
        } 
        else if (userRole.name === "Coach") {
          // Fetch team data based on the Coordinator or coach role
          // Assuming 'CoordinatorId' is a reference to the user table
          const teamsQuerySnapshot = await getTeamsByCoach(userDocRef);

          if (!teamsQuerySnapshot.empty) {
            const teamDocSnapshot = teamsQuerySnapshot.docs[0];
            const teamData = teamDocSnapshot.data();
            userData.team = {
              id: teamDocSnapshot.id,
              ...teamData,
            };
            const teamDoc = doc(db, "teams", teamDocSnapshot.id);
            console.log('ENTREEEEEEE',userData)
            const reservationQuerySnapshot= await getReservation(teamDoc)
            console.log('jnhubgyvftcdrxesdrfcgvhbjnk',reservationQuerySnapshot)
            if (!reservationQuerySnapshot.empty) {
              const reservationDocSnapshot = reservationQuerySnapshot.docs[0];
              const reservationData = reservationDocSnapshot.data();
              userData.team.reservation = {
                id: reservationDocSnapshot.id,
                ...reservationData,
              };
            }
            const tourQuerySnapshot= await getTour(userDocRef)
            console.log('jnhubgyvftcdrxesdrfcgvhbjnk',tourQuerySnapshot)
            if (!tourQuerySnapshot.empty) {
              let auxTour=[]
              tourQuerySnapshot.docs.map((reservation)=>
                auxTour.push({id:reservation.id,...reservation.data()})
              )
              console.log("jinivjnekv",auxTour)
              userData.tour = auxTour
            }
          } else {
            userData.team = null; // User is not a Coordinator or coach of any team
          }
        }  else if (userRole.name === "Captain") {
    
          // Fetch team data based on the Coordinator or coach role
          // Assuming 'CoordinatorId' is a reference to the user table
          const teamsQuerySnapshot = await getTeamsByCaptain(userDocRef);
          //console.log('entre')
          if (!teamsQuerySnapshot.empty) {
            const teamDocSnapshot = teamsQuerySnapshot.docs[0];
            const teamData = teamDocSnapshot.data();
            userData.team = {
              id: teamDocSnapshot.id,
              ...teamData,
            };
            const teamDoc = doc(db, "teams", teamDocSnapshot.id);
            console.log('ENTREEEEEEE',userData)
            const reservationQuerySnapshot= await getReservation(teamDoc)
            console.log('jnhubgyvftcdrxesdrfcgvhbjnk',reservationQuerySnapshot)
            if (!reservationQuerySnapshot.empty) {
              const reservationDocSnapshot = reservationQuerySnapshot.docs[0];
              const reservationData = reservationDocSnapshot.data();
              userData.team.reservation = {
                id: reservationDocSnapshot.id,
                ...reservationData,
              };
            }
            const tourQuerySnapshot= await getTour(userDocRef)
            console.log('jnhubgyvftcdrxesdrfcgvhbjnk',tourQuerySnapshot)
            if (!tourQuerySnapshot.empty) {
              let auxTour=[]
              tourQuerySnapshot.docs.map((reservation)=>
                auxTour.push({id:reservation.id,...reservation.data()})
              )
              console.log("jinivjnekv",auxTour)
              userData.tour = auxTour
            }
          } else {
            userData.team = null; // User is not a Coordinator or coach of any team
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
       const teamDoc = doc(db, "teams", teamDocSnapshot.id);
       console.log('ENTREEEEEEE',userData)
       const reservationQuerySnapshot= await getReservation(teamDoc)
       console.log('jnhubgyvftcdrxesdrfcgvhbjnk',reservationQuerySnapshot)
       if (!reservationQuerySnapshot.empty) {
         const reservationDocSnapshot = reservationQuerySnapshot.docs[0];
         const reservationData = reservationDocSnapshot.data();
         userData.team.reservation = {
           id: reservationDocSnapshot.id,
           ...reservationData,
         };
       }
       const tourQuerySnapshot= await getTour(userDocRef)
       console.log('jnhubgyvftcdrxesdrfcgvhbjnk',tourQuerySnapshot)
       if (!tourQuerySnapshot.empty) {
         let auxTour=[]
         tourQuerySnapshot.docs.map((reservation)=>
           auxTour.push({id:reservation.id,...reservation.data()})
         )
         console.log("jinivjnekv",auxTour)
         userData.tour = auxTour
       }
     } else {
       userData.team = null; // User is not a team member
     }
        }

        // ... Other code to fetch and include other role information

        if(userData.team !=null){
          userData.team.coordinator= userData.team.coordinator ? await getTeamInformation(userData.team.coordinator) : {}
          userData.team.coach= userData.team.coach ? await getTeamInformation(userData.team.coach) : {}
          //console.log('CAPTAIN',userData.team.captain)
          userData.team.captain=userData.team.captain ? await getTeamInformation(userData.team.captain) : {}
          for (let i = 0; i < userData.team.team_members.length; i++) {
            console.log("bgegjwhehwugegvuwye")
            userData.team.team_members[i] = await getTeamInformation(userData.team.team_members[i]);
          }
        }
        userData.country=country

        userData.role=userRole
        //console.log('kmkrmkvmr',userRole)
        //console.log(userData)
        return userData;
      } else {
        console.error("User document does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data from Firestore:", error);
      throw error;
    }
  };

  const getTeamInformation = async (userDocRef) => {
    try {
      console.log('UNUNN',userDocRef)
      const userDocSnapshot = await getDoc(userDocRef);
      console.log('UNUNN',userDocSnapshot.exists())
      if (userDocSnapshot.exists()) {
        const userData = await userDocSnapshot.data();
        userData.id=userDocSnapshot.id
  
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching team information:', error);
      throw error;
    }
  };

  // Helper function to get teams by coordinator or coach
  const getTeamsByCoordinator = async (userDocRef) => {
    // Implement your Firestore query to get teams by Coordinator or coach
    const teamsQuerySnapshot = await getDocs(
      query(collection(db, "teams"), where("coordinator", "==", userDocRef),where("payment_status","==",true))
    );

    return teamsQuerySnapshot;
  };
  
  const getTeamsByCoach = async (userDocRef) => {
    // Implement your Firestore query to get teams by coordinator or coach
    const teamsQuerySnapshot = await getDocs(
      query(collection(db, "teams"),
      where("coach", "==", userDocRef),where("payment_status","==",true))
    );

    return teamsQuerySnapshot;
  };

  const getTeamsByCaptain = async (userDocRef) => {
    // Implement your Firestore query to get teams by coordinator or coach
    const teamsQuerySnapshot = await getDocs(
      query(collection(db, "teams"),
      where("captain", "==", userDocRef),where("payment_status","==",true))
    );

    return teamsQuerySnapshot;
  };

  const getReservation = async (teamDocRef) => {
    console.log('ferfrefer',teamDocRef)
    // Implement your Firestore query to get teams by coordinator or coach
    const teamsQuerySnapshot = await getDocs(
    query(collection(db, "hotel"),
      where("team", "==", teamDocRef),where("payment_status","==",true))
    );

    return teamsQuerySnapshot;
  };


  const getTour = async (DocRef) => {
    // Implement your Firestore query to get teams by coordinator or coach
    const teamsQuerySnapshot = await getDocs(
    query(collection(db, "tour"),
      where("user", "==", DocRef),where("payment_status","==",true))
    );

    return teamsQuerySnapshot;
  };

  // Helper function to get teams by member
  const getTeamsByMember = async (memberUid) => {
    // Implement your Firestore query to get teams by member UID
    const userDocRef = doc(db, "users", memberUid);
    const teamsQuerySnapshot = await getDocs(
     query(collection(db, 'teams'),
      where('team_members', 'array-contains', userDocRef),where("payment_status","==",true))
    );
  
    console.log('jihnvwjv',teamsQuerySnapshot,memberUid)
    return teamsQuerySnapshot;
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // User is signed in
        const userDataFromFirestore = await getUserDataFromFirestore(
          authUser.uid

        );

        console.log('lkmjnhbgvhbjnkmldckwmenkv',userDataFromFirestore)
        //console.log("jncjkedcnjek", userDataFromFirestore);
        if(userDataFromFirestore){
          setUser({

            uid: authUser.uid,
            email: authUser.email,
            ...userDataFromFirestore, // Include additional data from Firestore
          });
        }else{
          setUser(null);
        }
      
      } else {
        // User is signed out
        setUser(null);
      }

      setLoading(false);
   
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const getInfo=async(user)=>{
    //console.log('LLLEGUEEE')
setLoading(true)
    const userDataFromFirestore = await getUserDataFromFirestore(
      user.uid
    );

    //console.log("jncjkedcnjebrbeghtegtek", userDataFromFirestore);
    setUser({
      uid: user.uid,
      email:user.email,
      ...userDataFromFirestore, // Include additional data from Firestore
    });
  

  setLoading(false)
  return {
    uid: user.uid,
    email:user.email,
    ...userDataFromFirestore, // Include additional data from Firestore
  }
  }

  const signIn = async (email, password) => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return { user, loading, signIn, signOutUser,getUserDataFromFirestore,getInfo,setLoading};
};

export default useAuth;
