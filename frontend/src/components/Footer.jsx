import { Link } from "react-router-dom";
import "../styles/Footer.css";
import {
    FaGlobe,
    FaInstagram,
    FaFacebookF,
    FaEnvelope
} from "react-icons/fa";
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

                    <a href="#features">Features</a>

                </div>

                {/* Features */}

                <div className="footer-column">

                    <h3>Features</h3>

                    <a href="#">AI Interviews</a>

                    <a href="#">Resume Analyzer</a>

                    <a href="#">Performance Dashboard</a>

                    <a href="#">AI Feedback</a>

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
        href="https://instagram.com/aiinterviewbot"
        target="_blank"
        rel="noopener noreferrer"
    >
        <FaInstagram />
    </a>

    {/* Facebook */}

    <a
        href="https://facebook.com/aiinterviewbot"
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