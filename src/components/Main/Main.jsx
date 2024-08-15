import React, { useRef } from "react";
import "./Main.css";
import dark_arrow from "../../assets/dark-arrow.png";
// import "./Testimonials.css";
import next_icon from "../../assets/next-icon.png";
import back_icon from "../../assets/back-icon.png";
import user_1 from "../../assets/user-1.png";
import user_2 from "../../assets/user-2.png";
import user_3 from "../../assets/user-3.png";
import user_4 from "../../assets/user-4.png";
const Main = () => {
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
    <div className="main maincontainer">

      {/* <img src={next_icon} alt="" className="next-actionbtn" onClick={slideforward} />
      <img
        src={back_icon}
        alt=""
        className="back-actionbtn"
        onClick={slidebackward}
      />
      <div className="own-slider">
        <ul ref={ownSlider}>
          <li>
            <div className="">
              <div className="">
                <img
                  src="https://i.pinimg.com/originals/98/7e/f1/987ef146ca14c2622144836ee12450a5.jpg"
                  alt=""
                />
                <div className="">
                  <h3>User 1</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg
              </p>
            </div>
          </li>
          <li>
            <div className="">
              <div className="">
                <img
                  src="https://i.pinimg.com/originals/98/7e/f1/987ef146ca14c2622144836ee12450a5.jpg"
                  alt=""
                />
                <div>
                  <h3>User 2</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg
              </p>
            </div>
          </li>
          <li>
            <div className="">
              <div className="">
                <img
                  src="https://i.pinimg.com/originals/98/7e/f1/987ef146ca14c2622144836ee12450a5.jpg"
                  alt=""
                />
                <div>
                  <h3>User 3</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg
              </p>
            </div>
          </li>
          <li>
            <div className="">
              <div className="">
                <img
                  src="https://i.pinimg.com/originals/98/7e/f1/987ef146ca14c2622144836ee12450a5.jpg"
                  alt=""
                />
                <div>
                  <h3>User 4</h3>
                  <span>Company User 1</span>
                </div>
              </div>
              <p>
                qwert tyui sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hgg qwert tyui
                sdfg dfgh fghj fgfvy ghg bhgbjhg hjghg hggqwert tyui sdfg dfgh
                fghj fgfvy ghg bhgbjhg hjghg hgg
              </p>
            </div>
          </li>
        </ul>
      </div> */}
      {/* <div className='main-text'>
            <h1 className='main-title'>Welcome to the ByteAspire Tech Blog!</h1>
            <p>
                This is a blog about tech and programming.
            </p>
            {/* <button className='actionbtn'>Explore more <img src={dark_arrow} alt="" /></button> 
        </div> */}
    </div>
  );
};

export default Main;
