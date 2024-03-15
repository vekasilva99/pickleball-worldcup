// PaymentForm.js
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import useAuth from "@/hooks/useAuth";
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import {db,auth} from '@/firebase/firebase'
import { collection, getDocs, doc, getDoc,where, collectionGroup,set,addDoc,updateDoc,arrayUnion,setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

function PaymentForm({teamRef,setOpen,team,setuser2,reservationRef, total}) {
  const { user, loading, getInfo } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();
const router=useRouter()
  useEffect(() => {
    //console.log('TEAMdddMM',reservationRef)
    // Fetch the client secret from the server
    const fetchClientSecret = async () => {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ total: total }),
      });
      const { clientSecret: cs } = await response.json();
      setClientSecret(cs);
 
        await updateDoc(reservationRef,{payment_intent:cs});
   
      
   
    };



    fetchClientSecret();

  }, []);

  const handleSubmit = async (event) => {
  

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
   
        await updateDoc(reservationRef,{payment_status:true});


 
      let auxUser=await getInfo(user)
      setuser2(auxUser)
      setOpen()
      //console.log('Payment succeeded:', result.paymentIntent);
    }
  };


  return (
    <form >
      <div className='card-element-container'>
        <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
      </div>
   

      <div className="mt-6 flex items-center justify-end gap-x-6">

        <button
        onClick={(e)=>{e.preventDefault();handleSubmit(e)}} 
       disabled={!stripe}
          className="gold-button"
        >
         Pay ${total}.00
        </button>
      </div>
    </form>
  );
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '1.2rem',
      color:'white',
      iconColor:'#fef7be',
      fontFamily:'Poppins',
      '::placeholder':{
        color:'white'
      }
    },
    iconColor:'#fef7be'
  },
};

function PaymentFormWrapper({teamRef,setOpen,team,setuser2,reservationRef, total}) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm teamRef={teamRef} setOpen={setOpen} team={team} setuser2={(user)=>{setuser2(user)}} reservationRef={reservationRef} total={total}/>
    </Elements>
  );
}

export default PaymentFormWrapper;