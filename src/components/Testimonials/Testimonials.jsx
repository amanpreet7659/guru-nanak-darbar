import React, { useRef } from "react";
import "./Testimonials.css";
import next_icon from "../../assets/next-icon.png";
import back_icon from "../../assets/back-icon.png";
import user_1 from "../../assets/user-1.png";
import user_2 from "../../assets/user-2.png";
import user_3 from "../../assets/user-3.png";
import user_4 from "../../assets/user-4.png";

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
      <img src={next_icon} alt="" className="next-actionbtn" onClick={slideforward} />
      <img
        src={back_icon}
        alt=""
        className="back-actionbtn"
        onClick={slidebackward}
      />
      <div className="own-slider">
        <ul ref={ownSlider}>
          <li>
            <div className="own-slide">
              <div className="user-info">
                <img src={user_1} alt="" />
                <div>
                  <h3>User 1</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg{" "}
              </p>
            </div>
          </li>
          <li>
            <div className="own-slide">
              <div className="user-info">
                <img src={user_2} alt="" />
                <div>
                  <h3>User 2</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg{" "}
              </p>
            </div>
          </li>
          <li>
            <div className="own-slide">
              <div className="User-info">
                <img src={user_3} alt="" />
                <div>
                  <h3>User 3</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg{" "}
              </p>
            </div>
          </li>
          <li>
            <div className="own-slide">
              <div className="user-info">
                <img src={user_4} alt="" />
                <div>
                  <h3>User 4</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg{" "}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Testimonials;
