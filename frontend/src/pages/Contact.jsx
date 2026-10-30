import  { useState } from "react";
import "../styles/Contact.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({
      name: "",
      email: "",
      message: ""
    });
  };

  return (
    <div className="contact-page">

      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>
          Have questions about AI Interview Bot? 
          We are here to help you.
        </p>
      </div>


      <div className="contact-container">

        {/* Contact Information */}
        <div className="contact-info">

          <h2>Get In Touch</h2>

          <div className="info-box">
            <FaEnvelope />
            <div>
              <h4>Email</h4>
              <p>support@aiinterviewbot.com</p>
            </div>
          </div>


          <div className="info-box">
            <FaPhone />
            <div>
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>


          <div className="info-box">
            <FaMapMarkerAlt />
            <div>
              <h4>Location</h4>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>

        </div>



        {/* Contact Form */}

        <form className="contact-form" onSubmit={handleSubmit}>

          <h2>Send Message</h2>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />


          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />


          <button type="submit">
            Send Message <FaPaperPlane />
          </button>

        </form>

      </div>

    </div>
  );
};

export default Contact;