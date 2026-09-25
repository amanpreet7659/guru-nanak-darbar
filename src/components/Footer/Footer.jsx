import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n";
import "./Footer.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <p>{t("footer.rights")}</p>
      <ul>
        <li>{t("footer.terms")}</li>
        <li>{t("footer.privacy")}</li>
        <li>
          <Link to="/admin/login" className="footer-admin-link">
            {t("common.admin")}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
