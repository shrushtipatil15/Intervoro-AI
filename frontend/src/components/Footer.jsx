import { Link } from "react-router-dom";
import "../styles/Footer.css";
import {
    FaGlobe,
    FaInstagram,
    FaFacebookF,
    FaEnvelope
} from "react-icons/fa";
const handleDashboardClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
        navigate("/dashboard");
    } else {
        navigate("/register");
    }
};
function Footer() {

    return (

        <footer className="footer">

            <div className="footer-container">

                {/* Brand */}

                <div className="footer-brand">

                    <h2>Intervoro AI</h2>

                    <p>

                        Practice smarter with AI-powered mock interviews,
                        resume analysis, and personalized feedback to
                        land your dream job.

                    </p>

                </div>

                {/* Quick Links */}

                <div className="footer-column">

                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>

                    <Link to="/register">Get Started</Link>

                    <Link to="/login">Login</Link>

                    

                </div>

                {/* Features */}

                <div className="footer-column">

                   <h3>Features</h3>

<a href="/create-interview">AI Interviews</a>

<a href="/#resume-analyzer">Resume Analyzer</a>



<a href="/#report-preview">AI Feedback</a>

                </div>

                {/* Support */}

                <div className="footer-column">

                    <h3>Support</h3>

                    <a href="#">Help Center</a>

                    <a href="#">FAQs</a>

                    <a href="#">Privacy Policy</a>

                    <a href="#">Terms & Conditions</a>

                </div>

                {/* Contact */}

                <div className="footer-column">

                    <h3>Contact</h3>

                    <p>support@aiinterviewbot.com</p>

                    <p>Mumbai, India</p>
<div className="social-icons">

    {/* Website */}

    <a
        href="https://www.aiinterviewbot.com"
        target="_blank"
        rel="noopener noreferrer"
    >
        <FaGlobe />
    </a>

    {/* Email */}

    <a href="mailto:support@aiinterviewbot.com">
        <FaEnvelope />
    </a>

    {/* Instagram */}

    <a
        href="https://instagram.com/"
        target="_blank"
        rel="noopener noreferrer"
    >
        <FaInstagram />
    </a>

    {/* Facebook */}

    <a
        href="https://facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
    >
        <FaFacebookF />
    </a>

</div>

                </div>

            </div>

            <hr />

            <div className="footer-bottom">

                © 2026 AI Interview Bot. All Rights Reserved.

            </div>

        </footer>

    );

}

export default Footer;