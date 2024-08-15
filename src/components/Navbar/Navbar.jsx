import React, { useState, useEffect } from "react";
import "./Navbar.css";
// import logo from "../../assets/logo.png";
import logo from "../../assets/svg/logo.svg";
import { Link } from "react-scroll";
import menu_icon from "../../assets/menu-icon.png";
import Logo from "../../assets/svg/logo";

const Navbar = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 50 ? setSticky(true) : setSticky(false);
    });
  }, []);

  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMenu = () => {
    mobileMenu ? setMobileMenu(false) : setMobileMenu(true);
  };
  return (
    <nav
      className={`maincontainer ${sticky ? "dark-nav" : "light-nav"}`}
      // style={{ maxWidth: "100%" }}
    >
      <Logo height="100px" width="500px" />
      <ul className={mobileMenu ? "" : "hide-mobile-menu"}>
        <li>
          <Link to="main" smooth={true} offset={0} duration={500}>
            Home
          </Link>
        </li>
        {/* <li>
          <Link to="program" smooth={true} offset={-260} duration={500}>
            Program
          </Link>
        </li> */}
        <li>
          <Link to="about" smooth={true} offset={-150} duration={500}>
            About us
          </Link>
        </li>
        {/* <li>
          <Link to="campus" smooth={true} offset={-260} duration={500}>
            Campus
          </Link>
        </li> */}
        {/* <li>
          <Link to="testimonials" smooth={true} offset={-260} duration={500}>
            Testimonials
          </Link>
        </li> */}
        <li>
          <Link
            to="contact"
            smooth={true}
            offset={-260}
            duration={500}
            className="actionbtn"
          >
            Contact Us
          </Link>
        </li>
      </ul>
      <img src={menu_icon} alt="" className="menu-icon" onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;
