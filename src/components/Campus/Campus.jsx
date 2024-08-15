import React from "react";
import "./Campus.css";
import gallery_1 from "../../assets/gallery-1.png";
import gallery_2 from "../../assets/gallery-2.png";
import gallery_3 from "../../assets/gallery-3.png";
import gallery_4 from "../../assets/gallery-4.png";
import white_arrow from "../../assets/white-arrow.png";

const Campus = () => {
  return (
    <div className="campus">
      <div className="gallery">
        <img
          src="https://images.meesho.com/images/products/370832094/ty07u_512.webp"
          alt=""
          className="image"
        />
        <img
          src="https://mail.satyaagrah.com/images/2022/June/bahadur9juneP.jpg"
          alt=""
          className="image"
        />
        <img
          src="https://www.boloji.com/articlephotos/a51838-2.jpg"
          alt=""
          className="image"
        />
        <img
          src="https://wallpapercave.com/wp/wp11716775.jpg"
          alt=""
          className="image"
        />
      </div>
      <button className="actionbtn dark-actionbtn">
        See more here <img src={white_arrow} alt="" />
      </button>
    </div>
  );
};

export default Campus;
