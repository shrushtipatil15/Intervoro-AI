import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", user);
      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-page">
      {/* Decorative glowing orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {/* Left showcase panel */}
      <div className="register-showcase">
        <span className="showcase-badge">✦ AI-Powered Interview Prep</span>

        <h2>
          Practice smarter.
          <br />
          <span>Get hired faster.</span>
        </h2>

        <p className="showcase-text">
          Simulate real interviews, get instant AI feedback, and walk into
          your next opportunity with confidence.
        </p>

        <ul className="showcase-features">
          <li>
            <span className="feature-icon">🎯</span>
            <div>
              <h4>Realistic Mock Interviews</h4>
              <p>Role-specific questions tailored to you.</p>
            </div>
          </li>
          <li>
            <span className="feature-icon">⚡</span>
            <div>
              <h4>Instant AI Feedback</h4>
              <p>Know what to improve right after each answer.</p>
            </div>
          </li>
          <li>
            <span className="feature-icon">📈</span>
            <div>
              <h4>Track Your Progress</h4>
              <p>See your growth with detailed performance insights.</p>
            </div>
          </li>
        </ul>

        <div className="showcase-stats">
          <div>
            <strong>24/7</strong>
            <span>Available</span>
          </div>
          <div>
            <strong>100+</strong>
            <span>Job Roles</span>
          </div>
          <div>
            <strong>Free</strong>
            <span>To Start</span>
          </div>
        </div>
      </div>

      {/* Registration card */}
      <div className="register-card">
        <h1>Create Account</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="register-login">
          Already signed in?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default Register;