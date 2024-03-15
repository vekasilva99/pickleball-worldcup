// pages/index.js
"use client"
import React,{useState} from "react";
import { useRouter,useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const images=['/peru/DSC_3509.webp','/peru/image00003.webp','/peru/image00020.webp','/peru/image00080.webp','/peru/image00128.webp','/peru/image00137.webp','/peru/IMG_1558-2.webp','/peru/SANG0664.webp','/peru/SANG0718.webp','/peru/SANG1600.webp','/peru/SANG1631.webp','/peru/SANG1665.webp']
export default function Home() {
  const router = useRouter();
  const [selected,setSelected]=useState(0)
  const params=useParams()
//console.log('mkjnhbgvbjnkml',params )

const next=()=>{
  console.log('hola',selected)
  if((images.length/3)-1>selected){
  
    setSelected(selected+1)
  }else{
    setSelected(0)
  }
}

const prev=()=>{
  console.log('hola',selected)
  if(selected>0){
  
    setSelected(selected-1)
  }else{
    setSelected((images.length/3)-1)
  }
}
  return (
    <main className="flex min-h-screen main">
      <Navbar />
      <div className="home">
      <img src="/02/World Cup - Web HOME_background image.webp" className="home-background"/>
        <div className="column-55">
   
        <video autoPlay muted controls={false}>
        <source src="https://firebasestorage.googleapis.com/v0/b/pickleball-worldcup.appspot.com/o/IMG_2678.MOV?alt=media&token=9872fa82-65bc-410d-bd08-a5a5cca41db3" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
        </div>
        <div className="column-45">
          <div className="row">
            <img src="/peru/SANG1631.webp"/>
            <div>
            <h2>PERU, CHAMPION AT HOME</h2>
            <h3>Peru wins the first pickleball world cup in history.</h3>
            </div>
          </div>
          <div className="row">
            <img src="/DSC_3206.webp" />
            <div>
            <h2>A LOOK TO THE PRESS CONFERENCE</h2>
            <h3>Relive the presentation of the II Tournament and the 2023 World Cup - Special Edition.</h3>
            </div>
       
          </div>
        </div>
        <button className="home-button">Log In</button>
      </div>

      <div className="gallery-section">
        <div className="title"><h2>Gallery</h2>
    <img  src='/arrow-left.webp'  onClick={()=>{prev()}}/>
        </div>
        
        <div className="gallery">
        <img  src='/arrow-right.webp' className="arrow-gallery" onClick={()=>{next()}}/>
          {images.map((image,index)=>{
            if(index==0){
              return <img src={image} style={{marginLeft:(-selected*100).toString()+"%"}}/>
            }else{
 return <img src={image}/>
            }
          })}
        </div>
      </div>

      <div className="tour-section">
        <div className="tour-content">
          <h2>FELLOWSHIP TOUR</h2>
          <h3>Designed for participating teams and pickleball enthusiasts, our tour offers a unique experience to connect with other players and explore the city.</h3>
          <button>Coming soon</button>
        </div>
        <img src="/footer/World Cup - Web HOME_tour section image.webp" />
      </div>
      <Footer/>
    </main>
  );
}


