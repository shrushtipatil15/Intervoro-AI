
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/InterviewHistory.css";

function InterviewHistory() {
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });

        const fetchHistory = async () => {
            try {
                const token =
                    localStorage.getItem("token") ||
                    localStorage.getItem("access_token");

                if (!token) {
                    setError("Please log in to view your interview history.");
                    return;
                }

                const response = await API.get("/interview/history");
                const data = response.data;

                setInterviews(
                    Array.isArray(data)
                        ? data
                        : data.interviews || data.history || []
                );
            } catch (err) {
                console.error(
                    "Interview history error:",
                    err.response?.status,
                    err.response?.data || err.message
                );

                if (err.response?.status === 401) {
                    setError(
                        "Your login session is invalid. Please log out and log in again."
                    );
                } else {
                    setError(
                        err.response?.data?.detail ||
                        "Unable to load interview history."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const copyInterviewId = async (id) => {
        try {
            await navigator.clipboard.writeText(String(id));
            alert("Interview ID copied!");
        } catch {
            alert("Unable to copy the ID. Please copy it manually.");
        }
    };

    const openPractice = (interview) => {
        navigate("/concept-transfer", {
            state: { interviewId: interview.interview_id },
        });
    };

    const openReport = (interview) => {
        navigate(`/report/${interview.interview_id}`);
    };

    const getDate = (interview) => {
        const value =
            interview.created_at ||
            interview.date ||
            interview.createdAt;

        if (!value) return "Date unavailable";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "Date unavailable"
            : date.toLocaleString();
    };

    return (
        <div className="history-page">
            <h1 className="history-heading">Interview History</h1>

            <p className="history-subtitle">
                Review your previous interviews and practise your weak concepts.
            </p>

            {loading ? (
                <div className="history-message">
                    Loading interview history...
                </div>
            ) : (
                <>
                    {error && (
                        <div className="history-message" role="alert">
                            {error}
                        </div>
                    )}

                    {!error && interviews.length === 0 && (
                        <div className="history-message">
                            No interview history found. Complete an interview
                            to see it here.
                        </div>
                    )}

                    <div className="history-grid">
                        {interviews.map((interview, index) => {
                            const id = interview.interview_id;

                            return (
                                <div
                                    className="history-card"
                                    key={id || index}
                                >
                                    <div className="history-role-row">
                                        <h2 className="history-role">
                                            {interview.job_role ||
                                                interview.role ||
                                                interview.technology ||
                                                "Interview"}
                                        </h2>

                                        <span className="history-badge">
                                            {interview.difficulty || "Standard"}
                                        </span>
                                    </div>

                                    <div className="history-info-grid">
                                        <div className="history-info">
                                            <span className="history-info-label">
                                                Grade
                                            </span>
                                            <span className="history-info-value">
                                                {interview.grade ||
                                                    interview.report?.grade ||
                                                    "—"}
                                            </span>
                                        </div>

                                        <div className="history-info">
                                            <span className="history-info-label">
                                                Date
                                            </span>
                                            <span className="history-info-value">
                                                {getDate(interview)}
                                            </span>
                                        </div>

                                        <div className="history-info">
                                            <span className="history-info-label">
                                                Technology
                                            </span>
                                            <span className="history-info-value">
                                                {Array.isArray(interview.technology)
                                                    ? interview.technology.join(", ")
                                                    : interview.technology ||
                                                      interview.job_role ||
                                                      interview.role ||
                                                      "—"}
                                            </span>
                                        </div>

                                        <div className="history-info">
                                            <span className="history-info-label">
                                                Experience
                                            </span>
                                            <span className="history-info-value">
                                                {interview.experience_level ||
                                                    interview.experience ||
                                                    "—"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="history-interview-id">
                                        <span className="history-interview-id-label">
                                            Interview ID
                                        </span>
                                        <span className="history-interview-id-value">
                                            {id || "ID unavailable"}
                                        </span>
                                    </div>

                                    {id && (
                                        <>
                                            <button
                                                type="button"
                                                className="history-action"
                                                onClick={() => copyInterviewId(id)}
                                            >
                                                Copy ID
                                            </button>

                                            <button
                                                type="button"
                                                className="history-action"
                                                onClick={() => openReport(interview)}
                                            >
                                                View Report
                                            </button>

                                            <button
                                                type="button"
                                                className="history-action"
                                                onClick={() => openPractice(interview)}
                                            >
                                                Practice This Interview
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            <button
                type="button"
                className="history-back-button"
                onClick={() => navigate("/dashboard")}
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default InterviewHistory;
