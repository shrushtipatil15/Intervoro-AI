
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user") || "{}");
const userName = user.name || user.username || user.full_name || "";
    return (
        <div className="dashboard-page">
            <main className="dashboard-container">
                <div className="dashboard-heading">
                    <h1>Welcome to Your Dashboard</h1>
                    {userName && (
    <h2 className="dashboard-user-name">
        {userName}
    </h2>
)}
                    <p>
                        Prepare for interviews, review your performance,
                        and strengthen your technical concepts.
                    </p>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-box">
                        <h2>Start New Interview</h2>
                        <p>
                            Create an AI-powered mock interview based on
                            your role and skills.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/create-interview")}
                        >
                            Start Interview
                        </button>
                    </div>

                    <div className="dashboard-box">
                        <h2>Interview History</h2>
                        <p>
                            View your previous interviews, feedback,
                            scores, and performance.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/interview-history")}
                        >
                            View History
                        </button>
                    </div>

                    <div className="dashboard-box concept-transfer-box">
                        <h2>Concept Transfer Verification</h2>
                        <p>
                            Identify weak concepts, understand them
                            through clear explanations, and practise
                            with new questions to verify your learning.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/concept-transfer")}
                        >
                            Start Concept Practice
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
