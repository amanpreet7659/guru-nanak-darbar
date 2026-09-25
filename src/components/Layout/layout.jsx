import React from "react";
import Navbar from "../Navbar/Navbar";
import Title from "../Title/Title";
import Contact from "../Contact/Contact";
import Footer from "../Footer/Footer";
import { useTranslation } from "../../i18n";

const Layout = ({ children, showcontact = false }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Navbar />
      {children}
      {showcontact && (
        <>
          <Title
            subTitle={t("home.contactSub")}
            title={t("home.contactTitle")}
          />
          <Contact />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
