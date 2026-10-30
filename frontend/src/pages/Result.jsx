
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/Result.css";

function Result() {
    const { id } = useParams();
const navigate = useNavigate();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            if (!id) {
                console.error("Interview ID is missing.");
                alert("Interview ID is missing.");
                return;
            }

            try {
                console.log("Fetching result for interview:", id);

                const res = await API.get(
                    `/interview/result/${id}`
                );

                console.log("Result received:", res.data);

                setResult(res.data);
            } catch (error) {
                console.error(
                    "Failed to load result:",
                    error.response?.data || error
                );

                alert("Failed to load result");
            }
        };

        fetchResult();
    }, [id]);

    if (!result) {
        return (
            <h2 className="loading">
                Generating AI Report...
            </h2>
        );
    }

    // Performance calculations
    const answers = Array.isArray(result.answers)
        ? result.answers
        : [];

    // Remove duplicate answers using question_number.
    // Keep the latest occurrence if a question was submitted more than once.
    const uniqueAnswers = [
        ...new Map(
            answers.map((item, index) => [
                item.question_number != null
                    ? String(item.question_number)
                    : `question-${index}`,
                item,
            ])
        ).values(),
    ];

    // Remove duplicate strengths (case-insensitive)
    const uniqueStrengths = [
        ...new Map(
            (Array.isArray(result.strengths) ? result.strengths : [])
                .filter((item) => typeof item === "string" && item.trim())
                .map((item) => [item.trim().toLowerCase(), item.trim()])
        ).values(),
    ];

    // Remove duplicate weaknesses (case-insensitive)
    const uniqueWeaknesses = [
        ...new Map(
            (Array.isArray(result.weaknesses) ? result.weaknesses : [])
                .filter((item) => typeof item === "string" && item.trim())
                .map((item) => [item.trim().toLowerCase(), item.trim()])
        ).values(),
    ];

    const averageScore = Math.max(
        0,
        Math.min(10, Number(result.average_score) || 0)
    );

    const performance = Math.round(averageScore * 10);

    // Display the number of unique questions actually returned.
    const totalQuestions = uniqueAnswers.length;

    const totalScore = uniqueAnswers.reduce(
        (sum, item) => sum + (Number(item.score) || 0),
        0
    );

    const scores = uniqueAnswers.map((item) =>
        Math.max(
            0,
            Math.min(10, Number(item.score) || 0)
        )
    );

    const bestScore = scores.length
        ? Math.max(...scores)
        : 0;

    const lowestScore = scores.length
        ? Math.min(...scores)
        : 0;

    const performanceLabel =
        averageScore >= 9
            ? "Excellent"
            : averageScore >= 8
            ? "Very Good"
            : averageScore >= 7
            ? "Good"
            : averageScore >= 6
            ? "Satisfactory"
            : "Needs Improvement";

    const getScoreClass = (score) => {
        if (score >= 8) return "high";
        if (score >= 6) return "medium";
        return "low";
    };

    return (
        <div className="page-container">
            <div className="result-container">

                <div className="result-header">
                    <span className="result-eyebrow">
                        INTERVORO AI • PERFORMANCE ANALYTICS
                    </span>

                    <h1>
                        Interview Performance Report
                    </h1>

                    <p className="result-subtitle">
                        Review your performance, understand your
                        strengths, and identify areas to improve.
                    </p>
                </div>

                {/* Score Card */}

                <div className="score-card">
                    <span className="score-label">
                        YOUR OVERALL GRADE
                    </span>

                    <h2>
                        {result.grade || "N/A"}
                    </h2>

                    <p>
                        Average Score: {averageScore.toFixed(1)}/10
                    </p>

                    <p>
                        Total Score: {totalScore}
                    </p>
                </div>

                {/* Overall Performance and Progress */}

                <section className="performance-section">
                    <div className="performance-heading">
                        <div>
                            <span className="section-eyebrow">
                                PERFORMANCE OVERVIEW
                            </span>

                            <h2>Overall Performance</h2>

                            <p>
                                Your overall interview evaluation
                                based on your answer scores.
                            </p>
                        </div>

                        <span
                            className={`performance-status ${getScoreClass(averageScore)}`}
                        >
                            {performanceLabel}
                        </span>
                    </div>

                    <div className="performance-content">

                        <div className="performance-donut">
                            <div
                                className="donut-progress"
                                style={{
                                    "--performance": `${performance}%`
                                }}
                            >
                                <div className="donut-inner">
                                    <strong>{performance}%</strong>
                                    <span>Performance</span>
                                </div>
                            </div>
                        </div>

                        <div className="progress-details">
                            <div className="progress-info">
                                <div>
                                    <span>Average Score</span>
                                    <strong>
                                        {averageScore.toFixed(1)}/10
                                    </strong>
                                </div>

                                <span className="progress-percentage">
                                    {performance}%
                                </span>
                            </div>

                            <div
                                className="performance-progress-track"
                                role="progressbar"
                                aria-label="Overall interview performance"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={performance}
                            >
                                <div
                                    className="performance-progress-fill"
                                    style={{
                                        width: `${performance}%`
                                    }}
                                />
                            </div>

                            <p className="performance-description">
                                {performanceLabel === "Excellent"
                                    ? "Excellent work! You demonstrated strong performance in this interview."
                                    : performanceLabel === "Very Good"
                                    ? "Great work! Review your feedback to polish your answers further."
                                    : performanceLabel === "Good"
                                    ? "Good progress! Focus on improving the details and completeness of your answers."
                                    : performanceLabel === "Satisfactory"
                                    ? "You have a foundation to build on. Practice the concepts where your scores were lower."
                                    : "Keep practising! Review the AI feedback and strengthen your understanding of key concepts."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Performance Statistics */}

                <section className="result-stats">
                    <div className="result-stat-card">
                        <span className="stat-icon">📋</span>
                        <p>Total Questions</p>
                        <h3>{totalQuestions}</h3>
                        <span className="stat-caption">
                            In this interview
                        </span>
                    </div>

                    <div className="result-stat-card">
                        <span className="stat-icon">✓</span>
                        <p>Answers Reviewed</p>
                        <h3>{uniqueAnswers.length}</h3>
                        <span className="stat-caption">
                            Evaluated by AI
                        </span>
                    </div>

                    <div className="result-stat-card">
                        <span className="stat-icon">🏆</span>
                        <p>Best Answer</p>
                        <h3>{bestScore}/10</h3>
                        <span className="stat-caption">
                            Highest answer score
                        </span>
                    </div>

                    <div className="result-stat-card">
                        <span className="stat-icon">🎯</span>
                        <p>Lowest Answer</p>
                        <h3>{lowestScore}/10</h3>
                        <span className="stat-caption">
                            Opportunity to improve
                        </span>
                    </div>
                </section>

                {/* Strengths and Areas to Improve */}

                <div className="feedback-grid">

                    {/* Strengths */}

                    <div className="feedback-card">
                        <h3>💪 Strengths</h3>

                        {uniqueStrengths.length > 0 ? (
                            uniqueStrengths.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))
                        ) : (
                            <p className="no-feedback">
                                No specific strengths were identified.
                            </p>
                        )}
                    </div>

                    {/* Areas to Improve */}

                    <div className="feedback-card">
                        <h3>📈 Areas to Improve</h3>

                        {uniqueWeaknesses.length > 0 ? (
                            uniqueWeaknesses.map((item, index) => (
                                <p key={index}>{item}</p>
                            ))
                        ) : (
                            <p className="no-improvements">
                                🎉 Excellent performance! No significant
                                areas for improvement were identified.
                                Keep up the great work!
                            </p>
                        )}
                    </div>
                </div>

                {/* Question Review */}

                <h2 className="review-title">
                    Question Review ({uniqueAnswers.length} Questions)
                </h2>

                {uniqueAnswers.length > 0 ? (
                    uniqueAnswers.map((item, index) => {
                        const score = Math.max(
                            0,
                            Math.min(10, Number(item.score) || 0)
                        );

                        return (
                            <div
                                className="answer-card"
                                key={`${id}-answer-${item.question_number ?? index}`}
                            >
                                <div className="answer-card-header">
                                    <h3>
                                        Question{" "}
                                        {item.question_number ?? index + 1}
                                    </h3>

                                    <span
                                        className={`answer-score-badge ${getScoreClass(score)}`}
                                    >
                                        {score}/10
                                    </span>
                                </div>

                                <p>
                                    <b>Question:</b>{" "}
                                    {item.question || "Question not available"}
                                </p>

                                <p>
                                    <b>Your Answer:</b>{" "}
                                    {item.answer || "No answer provided"}
                                </p>

                                <div className="answer-mini-progress">
                                    <div
                                        className="answer-mini-progress-fill"
                                        style={{
                                            width: `${score * 10}%`
                                        }}
                                    />
                                </div>

                                <p>
                                    <b>AI Feedback:</b>{" "}
                                    {item.feedback || "No feedback available"}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-answers">
                        No answer details are available for this interview.
                    </div>
                )}

                {/* Footer */}

                <div className="result-footer">
                    <p>
                        Keep practising to improve your interview skills
                        and technical understanding.
                    </p><button type="button"
        className="dashboard-button"
        onClick={() => navigate("/dashboard")}
    >
        ← Back to Dashboard
    </button>
                </div>

            </div>
        </div>
    );
}

export default Result;
