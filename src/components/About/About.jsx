import React from "react";
import "./About.css";
import about_img from "../../assets/about.jpg";
import play_icon from "../../assets/play-icon.png";
import { useTranslation } from "../../i18n";

const About = ({ setPlayState }) => {
  const { t } = useTranslation();

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
        <h3>{t("about.heading")}</h3>
        <h2>{t("about.title")}</h2>
        <p>{t("about.body")}</p>
      </div>
    </div>
  );
};

export default About;
