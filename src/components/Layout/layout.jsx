import React from "react";
import Navbar from "../Navbar/Navbar";
import Title from "../Title/Title";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";

const Layout = ({ children, showcontact = false }) => {
  return (
    <div>
      <Navbar />
      {children}
      {showcontact && (
        <>
          <Title subTitle="Contact Us" title="Get in Touch" />
          <Contact />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
