import React from "react";
import "./Contact.css";
import msg_icon from "../../assets/msg-icon.png";
import mail_icon from "../../assets/mail-icon.png";
import phone_icon from "../../assets/phone-icon.png";
import location_icon from "../../assets/location-icon.png";
import white_arrow from "../../assets/white-arrow.png";
import { useTranslation } from "../../i18n";

const Contact = () => {
  const { t } = useTranslation();
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult(t("contact.sending"));
    const formData = new FormData(event.target);

    formData.append("access_key", "fd626018-d121-4f8b-a4fc-ebb5f53a1e33");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult(t("contact.submitted"));
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="contact">
      <div className="contact-col">
        <h3>
          {t("contact.sendMessage")} <img src={msg_icon} alt="" />
        </h3>
        <p>{t("contact.intro")}</p>
        <ul>
          <li>
            <img src={mail_icon} alt="" />
            amanpreetsingh7659@gmail.com
          </li>
          <li>
            <img src={phone_icon} alt="" />
            9855273953
          </li>
          <li>
            <img src={location_icon} alt="" />
            Vill. Barwali Kalan, PO. Barwali Khurd, Dist. Fatehgarh Sahib,
            Punjab, 141411
          </li>
        </ul>
      </div>
      <div className="contact-col">
        <form onSubmit={onSubmit}>
          <label>{t("contact.yourName")}</label>
          <input
            type="text"
            name="name"
            placeholder={t("contact.enterName")}
            required
          />
          <label>{t("contact.phoneNumber")}</label>
          <input
            type="tel"
            name="phone"
            placeholder={t("contact.enterPhone")}
            required
          />
          <label>{t("contact.writeMessage")}</label>
          <textarea
            name="message"
            rows="6"
            placeholder={t("contact.enterMessage")}
            required
          ></textarea>
          <button type="submit" className="actionbtn dark-actionbtn">
            {t("common.submit")} <img src={white_arrow} alt="" />
          </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  );
};

export default Contact;
