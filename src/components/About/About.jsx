import React from 'react'
import './About.css'
import about_img from "../../assets/about.png"
import play_icon from "../../assets/play-icon.png"


const About = ({setPlayState}) => { 
  return (
    <div className="about">
        <div className="about-left">
            <img src={about_img} alt="" className='about-img'/>
            <img src={play_icon} alt="" className='play-icon' onClick={()=>{setPlayState(true)}}/> 
        </div> 
        <div className="about-right">
            <h3>ABOUT US</h3>
            <h2>Nurturing Tomorrow's Leader Today</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eligendi maiores, vitae necessitatibus libero veniam error aspernatur. Harum id facilis facere voluptates, praesentium tenetur debitis vel. Beatae repellendus minus quisquam enim.</p>
        </div>
    </div>
  )
}

export default About