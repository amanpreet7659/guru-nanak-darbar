import React from "react";
import "./About.css";
import about_img from "../../assets/about.jpg";
import play_icon from "../../assets/play-icon.png";

const About = ({ setPlayState }) => {
  return (
    <div className="about">
      <div className="about-left">
        <img src={about_img} alt="" className="about-img" />
        <img
          src={play_icon}
          alt=""
          className="play-icon"
          onClick={() => {
            setPlayState(true);
          }}
        />
      </div>
      <div className="about-right">
        <h3>ABOUT US</h3>
        <h2>A Place of Faith, Seva & Community</h2>
        <p>
          Sikh Virsa Sambhal Sabha is a place where faith, Gurbani, seva, and
          community come together. We aim to preserve and share the timeless
          teachings of Sikhism while creating a welcoming space where everyone
          can connect with their spiritual roots. Through Kirtan, Gurbani,
          Sangat, and Langar, we promote the values of equality, compassion,
          humility, and selfless service. Our vision is to inspire the next
          generation to understand, respect, and carry forward the rich heritage
          of Sikhism.
        </p>
      </div>
    </div>
  );
};

export default About;
