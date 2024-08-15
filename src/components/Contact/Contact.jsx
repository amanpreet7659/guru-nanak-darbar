import React from 'react'
import './Contact.css'
import msg_icon from '../../assets/msg-icon.png'
import mail_icon from '../../assets/mail-icon.png'
import phone_icon from '../../assets/phone-icon.png'
import location_icon from '../../assets/location-icon.png'
import white_arrow from '../../assets/white-arrow.png'

const Contact = () => {
    const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "fd626018-d121-4f8b-a4fc-ebb5f53a1e33");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };
  return (
    <div className='contact'>
        <div className="contact-col">
            <h3> Send us Message <img src={msg_icon} alt="" /></h3>
            <p> asedrftyu89i0oplkjhgrefwdasdfgy asdrftyuiolkjhgfd drytdfgc b ye 7reyi7r 7yyty hiu u r gyg ryerg herhu urwy uweruwhr  uhiure  jroiu  uh iurhui  h e huier sehufh erui  ge tree gf  gg uy  eg trg huirehu  hiuh gre </p>
            <ul>
                <li><img src={mail_icon} alt="" />Simran@gmail.com</li>
                <li><img src={phone_icon} alt="" />1800- 989-0989</li>
                <li> <img src={location_icon} alt=""/>adress adressadress adressadress adress adressadress adress  adress adress </li>
            </ul>
        </div>
        <div className="contact-col">
            <form onSubmit={onSubmit}>
                <label >Your name</label>
                <input type="text" name='name' placeholder='Enter your Name' required/>
                <label >Phone Number</label>
                <input type="tel" name='phone' placeholder='Enter your phone number' required />
                <label > Write Your Messages here</label>
                <textarea name="message" rows="6" placeholder=' Enter Your Message' required></textarea>
                <button type='submit' className='actionbtn dark-actionbtn'>Submit now <img src={white_arrow} alt="" /></button>
            </form>
            <span>{result}</span>
        </div>
    </div>
  )
}

export default Contact