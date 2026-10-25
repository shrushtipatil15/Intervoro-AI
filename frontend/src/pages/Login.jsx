import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setUser((previous) => ({
            ...previous,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const res = await API.post("/auth/login", {
                email: user.email.trim(),
                password: user.password,
            });

            const token =
                res.data.access_token || res.data.token;

            if (!token) {
                throw new Error("Login response did not contain a token.");
            }

            // Save the authentication token.
            localStorage.setItem("token", token);

            // Save user information if the backend returns it.
            let loggedInUser = res.data.user;

            if (!loggedInUser || typeof loggedInUser !== "object") {
                loggedInUser = { email: user.email.trim() };
            }

            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );

            // Tell the navbar that login has succeeded.
            window.dispatchEvent(new Event("authChange"));

            alert("Login Successful");

            // Navigate only after successful authentication.
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login error:", error);

            alert(
                error.response?.data?.detail ||
                error.message ||
                "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
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

            <div className="login-card">
                <h1>Welcome </h1>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={user.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={user.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="login-register">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/register")}>
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;