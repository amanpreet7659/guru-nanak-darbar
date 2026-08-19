import React, { useRef } from "react";
import "./Testimonials.css";
import next_icon from "../../assets/next-icon.png";
import back_icon from "../../assets/back-icon.png";
import user_1 from "../../assets/dummy.jpg";
import user_2 from "../../assets/dummy.jpg";
import user_3 from "../../assets/dummy.jpg";
import user_4 from "../../assets/dummy.jpg";

const Testimonials = () => {
  const ownSlider = useRef();
  let tx = 0;

  const slideforward = () => {
    if (tx > -50) {
      tx -= 25;
    }
    ownSlider.current.style.transform = `translateX(${tx}%)`;
  };
  const slidebackward = () => {
    if (tx < 0) {
      tx += 25;
    }
    ownSlider.current.style.transform = `translateX(${tx}%)`;
  };

  return (
    <div className="testimonials">
      <img
        src={next_icon}
        alt=""
        className="next-actionbtn"
        onClick={slideforward}
      />
      <img
        src={back_icon}
        alt=""
        className="back-actionbtn"
        onClick={slidebackward}
      />
      <div className="own-slider">
        <ul ref={ownSlider}>
          <li className="own-slide-li">
            <div className="own-slide">
              <div className="user-info">
                <img src={user_1} alt="" />
                <div>
                  <h3>Jarnail Singh</h3>
                  <span>Sangat Member</span>
                </div>
              </div>
              <p>
                A peaceful place where we come together as a Sangat, listen to
                Gurbani, and experience the true spirit of seva and
                togetherness.
              </p>
            </div>
          </li>
          <li className="own-slide-li">
            <div className="own-slide">
              <div className="user-info">
                <img src={user_2} alt="" />
                <div>
                  <h3>Karamjit Kaur</h3>
                  <span>Community Member</span>
                </div>
              </div>
              <p>The Gurdwara Sahib provides a beautiful environment for spiritual connection and learning. Every visit brings a sense of peace, positivity, and belonging.</p>
            </div>
          </li>
          <li className="own-slide-li">
            <div className="own-slide">
              <div className="user-info">
                <img src={user_3} alt="" />
                <div>
                  <h3>Amanpreet Singh</h3>
                  <span>Sangat Member</span>
                </div>
              </div>
              <p>I truly appreciate the spirit of seva and equality here. It is a place where everyone comes together with love, respect, and faith, regardless of background.</p>
            </div>
          </li>
          <li className="own-slide-li">
            <div className="own-slide">
              <div className="user-info">
                <img src={user_4} alt="" />
                <div>
                  <h3>Amandeep Kaur</h3>
                  <span>Community Member</span>
                </div>
              </div>
              <p>A wonderful place to experience Gurbani, Kirtan, and the warmth of Sangat. The values of humility, compassion, and selfless service are beautifully reflected in the community.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Testimonials;
