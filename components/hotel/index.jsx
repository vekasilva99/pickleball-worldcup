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
import {format,differenceInDays,parseISO,addDays} from 'date-fns'
import PaymentFormWrapper from "../PaymentForm2";
import { useRouter } from "next/navigation";




const generateRandomPassword = () => {
    // Implement your logic to generate a random password
    // This is a simple example, and you might want to use a more robust solution
    return Math.random().toString(36).slice(-8);
  };


export default function Hotel({open,setOpen,team,setuser2}) {
  const { user, loading, getInfo } = useAuth();
  const router=useRouter()
  const [selectedDate, setSelectedDate] = useState(null);
  const [option, setOptions] = useState(['10/21/2024','10/22/2024','10/23/2024','10/24/2024','10/25/2024','10/26/2024','10/27/2024','10/28/2024','10/29/2024']);
  const [option2, setOptions2] = useState(['10/21/2024','10/22/2024','10/23/2024','10/24/2024','10/25/2024','10/26/2024','10/27/2024','10/28/2024','10/29/2024']);
  const [teamRef, setTeamRef] = useState(team ? team :null);
  const [showPayment, setShowPayment] = useState(team ? true : false);
  const [payNow, setPayNow] = useState(team ? true : false);
  const [reservationRef, setReservationRef] = useState(null);
  const [rooms, setRooms] = useState(1);
  const [availableRooms, setAvailableRooms] = useState(true);
  const [reservation, setReservations] = useState([]);
  const [price, setPrice] = useState(0);
  const [startDate,setStartDate]=useState('10/21/2024')
  const [endDate,setEndDate]=useState('10/29/2024')
  const [reservatedRooms,setReservatedRooms]=useState({'10/21/2024':0,'10/22/2024':0,'10/23/2024':0,'10/24/2024':0,'10/25/2024':0,'10/26/2024':0,'10/27/2024':0,'10/28/2024':0,'10/29/2024':0})




const getReservations=async()=>{

  const reservationAux = await getDocs(
    collection(db, "hotel"),
    where("payment_status", "==", true)
  );

  let aux=[]
  reservationAux.forEach(async (doc) => {

   
    let data = doc.data();
    data.id=doc.id



    //console.log('mklnvkjlenjkfen',data)
    if(data.payment_status){
      aux.push(data)
    }

   
  });

  setReservations(aux)
  //console.log('jnbhbrugjrjgjkrgnjkr',aux)

}

// const setAvailability=()=>{
//   let auxNumber=[0,0,0,0,0,0,0,0]
//   for(let i=0;i<reservation.length;i++){
//     let date=format(reservation[i].start_date.toDate(),'MM/dd/yyyy')
//     let number=differenceInDays(new Date(reservation[i].end_date.seconds*1000),new Date(reservation[i].start_date.seconds*1000))
//     //console.log('NUMBER', number)
//     for(let j=0;j<=number;j++){
//       let day=format(addDays(new Date(reservation[i].start_date.seconds*1000),j),'MM/dd/yyyy')
//       //console.log(day)

//       if(day=='10/21/2024'){
//        auxNumber[0]+=reservation[i].rooms
//       }else if(day=='10/22/2024'){
//         auxNumber[1]+=reservation[i].rooms
//       }else if(day=='10/23/2024'){
//         auxNumber[2]+=reservation[i].rooms
//       }else if(day=='10/24/2024'){
//         auxNumber[3]+=reservation[i].rooms
//       }else if(day=='10/25/2024'){
//         auxNumber[4]+=reservation[i].rooms
//       }else if(day=='10/26/2024'){
//         auxNumber[5]+=reservation[i].rooms
//       }else if(day=='10/27/2024'){
//         auxNumber[6]+=reservation[i].rooms
//       }else if(day=='10/28/2024'){
//         auxNumber[7]+=reservation[i].rooms
//       }

//     }


//   }

//   let auxStartDate = option;
//   for (let i = auxNumber.length - 1; i >= 0; i--) {
//     if (auxNumber[i] === 2) {
//       //console.log(i);
//       auxStartDate.splice(i, 1);
//     }
//   }
  
  

 

// }
const setAvailability = () => {
  const startDate = new Date('10/21/2024'); // Replace with your start date
  const endDate = new Date('10/29/2024'); // Replace with your end date
  const maxRoomsAvailable = 34; // Replace with the maximum number of rooms available per day

  const reservedRooms = {};

  // Iterate over reservation data
  for (let i = 0; i < reservation.length; i++) {
    const reservationStartDate = new Date(reservation[i].start_date.seconds * 1000);
    const reservationEndDate = new Date(reservation[i].end_date.seconds * 1000);

    // Check if reservation overlaps with the selected date range
    if (reservationEndDate >= startDate && reservationStartDate <= endDate) {
      // Calculate the start and end dates for the reservation within the selected date range
      const start = reservationStartDate >= startDate ? reservationStartDate : startDate;
      const end = reservationEndDate <= endDate ? reservationEndDate : endDate;

      // Iterate over each day of the reservation
      const currentDate = new Date(start);
      while (currentDate <= end) {
        const dateString = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        if (!reservedRooms[dateString]) {
          reservedRooms[dateString] = 0;
        }
       
        if(format(currentDate,'MM/dd/yyyy') != format(end,'MM/dd/yyyy')){
        reservedRooms[dateString] += reservation[i].rooms;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  }

  //console.log('reserved',reservedRooms)
setReservatedRooms(reservedRooms)
  const availableDates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateString = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    if (!reservedRooms[dateString] || reservedRooms[dateString] < maxRoomsAvailable) {
      availableDates.push(dateString);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }


  if(availableDates.length>0){
    setStartDate(availableDates[0])
   
    if(availableDates[0] !="10/29/2024"){
      //console.log('mkjnbhgvcfdgvhbjnkmjnkbhgvhbjn',addDays(new Date(availableDates[0]),1))
      setEndDate(format(addDays(new Date(availableDates[0]),1),'MM/dd/yyyy'))
    }
  }
  setOptions(availableDates)
 

};


const checkRooms=()=>{
let start=new Date(startDate)
const maxRoomsAvailable = 34;
let twoRooms=true
while(start<new Date(endDate)){
  //console.log(start)
console.log('oijckhfeijwk',reservatedRooms[format(start,'MM/dd/yyyy')]+2)
  if(reservatedRooms[format(start,'MM/dd/yyyy')]+2>maxRoomsAvailable){
twoRooms=false
  }
  start=addDays(start,1)
}
console.log('jehnfikbehjwkf',twoRooms)
setAvailableRooms(twoRooms)
//console.log('ROOOMS',twoRooms)
}
const changeEndDate = (date) => {
let startDate=new Date(date)
let aux=[]
for(let i=0;i<=7;i++){
  //console.log(format(addDays(startDate,1),'MM/dd/yyyy'))
if(option.includes(format(addDays(startDate,1),'MM/dd/yyyy') )){
  aux.push(format(addDays(startDate,1),'MM/dd/yyyy'))
  startDate=addDays(startDate,1)
}else{
  break
}
  
}

if(aux.length==0){
  aux.push(format(addDays(new Date(date),1),'MM/dd/yyyy'))
}
//console.log('lkmjnbhgvcfdghvbjnkml,;',date,aux)
setOptions2(aux)
};

useEffect(() => {

  getReservations()
}, []);

useEffect(() => {

  changeEndDate(startDate)
  checkRooms()
  calcPrice()
}, [option]);

useEffect(() => {


  calcPrice()
}, [rooms]);

useEffect(() => {
  if(reservation.length>0){
    setAvailability()
  }
 
}, [reservation]);

useEffect(() => {
  if(reservationRef){
   setShowPayment(true)
  }
 
}, [reservationRef]);
const options = {
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "numeric",
		year: "numeric"
	}
}


const calcPrice=()=>{
  let start=new Date(startDate)
const maxRoomsAvailable = 34;
let nights=0
while(start<new Date(endDate)){
  console.log(start)
nights+=1
start=addDays(start,1)
  
}
setPrice(nights*60*rooms)

}

const makeReservation = async (e) => {
  e.preventDefault()

try {
  // Create a new team in the database

  console.log('jinfvuhbehjvbherk',user)
  const teamRef = await doc(db, 'teams', user.team.id);
  setTeamRef(teamRef)


  const newHotelRef = await addDoc(collection(db, 'hotel'),{team:teamRef,rooms:Number(rooms),start_date:new Date(startDate),end_date:new Date(endDate),total_price:price});
  //console.log('mkjnbhgvcfgvhbjnkm',newHotelRef)
  setReservationRef(newHotelRef)


  return teamRef.key;
} catch (error) {
  throw error;
}
};



  return (
    <div className={open ? `flex justify-center dark register-form-container ${styles.open}`:`flex justify-center dark register-form-container ${styles.close}`} >
      
      {!showPayment ?
      <form className="register-form">
        <div className="form-title-container">
          <h2>Book Stay</h2>
        </div>
        <div className="form-container">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900 form-title">
           Albergue Villa Deportiva Nacional (VIDENA)
            </h2>
         

<div className={styles.imageContainer}>
  <div className={styles.rowBig}>
<div className={styles.column}>
  <img src="hotel/2.webp"/>
  <img src="hotel/3.webp"/>
  <img src="hotel/4.webp"/>

</div>
<div className={styles.columnBig}>
<img src="hotel/1.webp"/>
</div>
  </div>
  <div className={styles.row}>
  <img src="hotel/6.webp"/>
  <img src="hotel/7.webp"/>
  <img src="hotel/5.webp"/>
  <img src="hotel/8.webp"/>
  <img src="hotel/9.webp"/>
  </div>
</div>
<h2 className="text-base font-semibold leading-7 text-gray-900 form-title" >
           Availability
            </h2>
            <div className={styles.dates}>
              <div className={styles.date}>      <select
                    type="text"
                    id="coach-first-name"
                    name="coach-first-name"
                    value={startDate}
                    onChange={(e)=>{setStartDate(e.target.value);changeEndDate(e.target.value)}}
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                    {option.map((date,index)=>{
                      if(date != "10/29/2024"){
                        return <option value={date}>{date}</option>
                      }

                    })}
                         
            
                    </select></div>
                    <h3>-</h3>
                    <div className={styles.date}>      <select
                    type="text"
                    id="coach-first-name"
                    name="coach-first-name"
                    value={endDate}
                    onChange={(e)=>{setEndDate(e.target.value)}}
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                    {option2.map((date,index)=>{
 return <option value={date}>{date}</option>
                    })}
                         
            
                    </select></div>

                    <button onClick={(e)=>{e.preventDefault();checkRooms();  calcPrice()}}>Change Search</button>
      
            </div>

<table class={`table-auto ${styles.table}`}>
  <thead>
    <tr >
      <th>Room type</th>
      <th>Number of guests</th>
      <th>Price</th>
      <th>Your choices</th>
      <th>Select amount</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>4 Individual Beds</td>
      <td>4 guests</td>
      <td>$60</td>
      <td>Non-refundable</td>
      <td style={{paddingRight:'0.5rem'}}> 
       <select
                    type="text"
                    id="coach-first-name"
                    name="coach-first-name"
                    value={rooms}
                    onChange={(e)=>{setRooms(e.target.value);  calcPrice()}}
                    className="block w-full rounded-md sm:text-sm sm:leading-6 input"
                  >
                          <option value={1}>1</option>
                          {availableRooms &&
                    <option value={2}>2</option>}
                    {/* {availableRooms && user?.country?.name=="New Zealand" &&
                    <option value={3}>3</option>
                    }
                     {availableRooms && user?.country?.name=="New Zealand" &&
                    <option value={4}>4</option>
                    } */}
                    </select>
                  </td>
      <td>{rooms} {rooms==1 ? 'room' :'rooms'} for <br/><span style={{fontSize:'1rem', fontWeight:"bold"}}>${price}.00</span></td>
    </tr>
  </tbody>
</table>
         
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
          
            onClick={(e)=>{makeReservation(e)}}
            className="gold-button"
          >
           Book
          </button>
        </div>
        </div>
      </form>
      : <form className={`register-form payment-form`}>
      <div className="form-title-container">
        <h2>Payment</h2>
      </div>
      <div className="form-container">
      {!payNow &&<h3>Total: ${price}.00</h3>}

<PaymentFormWrapper setuser2={(user)=>{setuser2(user)}} teamRef={teamRef} reservationRef={reservationRef} total={price} setOpen={()=>{setOpen(false)}} team={team}/>

   
      </div>
    </form>}
    </div>
  );
}
