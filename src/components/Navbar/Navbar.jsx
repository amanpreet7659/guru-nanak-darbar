import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import menu_icon from "../../assets/menu-icon.png";
import Logo from "../../assets/svg/logo";

const Navbar = () => {
  const navigate = useNavigate();
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
          <Link
            to="main"
            smooth={true}
            offset={0}
            duration={500}
            onClick={() => {
              navigate("/");
            }}
          >
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
        <li>
          <RouterLink to="/waheguru-simran/register">
            Registration 2026-27
          </RouterLink>
        </li>
        <li>
          <Link
            to="contact"
            smooth={true}
            offset={-260}
            duration={500}
            // className="actionbtn"
          >
            Contact Us
          </Link>
        </li>
        <li>
          <RouterLink to="/admin/login">
            Admin Login
          </RouterLink>
        </li>
      </ul>
      <img src={menu_icon} alt="" className="menu-icon" onClick={toggleMenu} />
    </nav>
  );
};

export default Navbar;
