import { useState } from "react";
import axios from "axios";
import "./css/Contact.css";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [popup, setPopup] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { placeholder, value } = e.target;

    if (placeholder === "Your Name") {
      setFormData({ ...formData, name: value });
    } else if (placeholder === "Your Email") {
      setFormData({ ...formData, email: value });
    } else if (placeholder === "Subject") {
      setFormData({ ...formData, subject: value });
    } else if (placeholder === "Your Message") {
      setFormData({ ...formData, message: value });
    }
  };

  const handleSubmit = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/contact/send-message",
      formData
    );

   if (response.data.success) {
      setPopup(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setPopup(false);
      }, 3000);
    }

  } catch (error) {
    console.error("Error sending message:", error);
  }
};
  return (
    <div className="contact-page">
      {/* HEADER */}
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you. Reach us anytime.</p>
      </div>

      {/* CONTENT */}
      <div className="contact-container">
        {/* LEFT INFO */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>
            Have questions, feedback, or want to plan your next trip?
            Our team is ready to help you.
          </p>

          <div className="info-box">
            <i className="fa fa-map-marker"></i>
            <span>Bengaluru, Karnataka, India</span>
          </div>

          <div className="info-box">
            <i className="fa fa-envelope"></i>
            <span>sentinelx@gmail.com</span>
          </div>

          <div className="info-box">
            <i className="fa fa-phone"></i>
            <span>+91 9752179918</span>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="contact-form">
          <h2>Send Message</h2>

          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />

          <textarea
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button onClick={handleSubmit}>Send Message</button>
        </div>
      </div>

      {/* SUCCESS POPUP */}
     {popup && (
  <div className="success-overlay">
    <div className="success-popup">
      ✅ Message Sent Successfully!
    </div>
  </div>
)}
    </div>
  );
};

export default Contact;
