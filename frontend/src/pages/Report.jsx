
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Report.css";

function Report() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const fetchReport = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:8000/api/interview/result/${id}`,
                    {
                        headers: token
                            ? { Authorization: `Bearer ${token}` }
                            : {},
                    }
                );

                if (!cancelled) {
                    setReport(response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.detail ||
                        err.response?.data?.message ||
                        "Unable to load your interview report. Please try again."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchReport();
        } else {
            setError("Interview report ID is missing.");
            setLoading(false);
        }

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="report-page">
                <div className="report-status">
                    <div className="report-loader" />
                    <h2>Generating AI Report...</h2>
                    <p>Analyzing your interview performance.</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="report-page">
                <div className="report-status report-error">
                    <div className="error-icon">!</div>
                    <h2>Report Unavailable</h2>
                    <p>{error || "No report data was found."}</p>

                    <button
                        className="report-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Deduplicate repeated submissions using question text.
    // If a question was answered multiple times, keep its latest occurrence.
    const answers = (() => {
        const allAnswers = Array.isArray(report.answers)
            ? report.answers
            : [];

        const uniqueAnswers = new Map();

        allAnswers.forEach((answer) => {
            const questionKey = String(answer.question || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");

            if (!questionKey) return;

            uniqueAnswers.delete(questionKey);
            uniqueAnswers.set(questionKey, answer);
        });

        return Array.from(uniqueAnswers.values());
    })();

    // Calculate all score statistics from unique answers.
    const normalizedScores = answers.map((answer) =>
        Math.max(0, Math.min(10, Number(answer.score) || 0))
    );

    const averageScore = normalizedScores.length
        ? normalizedScores.reduce((sum, score) => sum + score, 0) /
          normalizedScores.length
        : 0;

    const performance = Math.round(averageScore * 10);

    // Do not use report.total_questions because it may include duplicates.
    const totalQuestions = answers.length;

    const totalScore = normalizedScores.reduce(
        (sum, score) => sum + score,
        0
    );

    const bestScore = normalizedScores.length
        ? Math.max(...normalizedScores)
        : 0;

    const lowestScore = normalizedScores.length
        ? Math.min(...normalizedScores)
        : 0;

    const grade = report.grade || "N/A";

    const strengths = Array.isArray(report.strengths)
        ? report.strengths
        : [];

    const weaknesses = Array.isArray(report.weaknesses)
        ? report.weaknesses
        : [];

    const getScoreClass = (score) => {
        if (score >= 8) return "score-high";
        if (score >= 6) return "score-medium";
        return "score-low";
    };

    const getPerformanceLabel = (score) => {
        if (score >= 9) return "Excellent";
        if (score >= 8) return "Very Good";
        if (score >= 7) return "Good";
        if (score >= 6) return "Satisfactory";
        return "Needs Improvement";
    };

    return (
        <div className="report-page">
            <div className="report-container">

                {/* Header */}
                <header className="report-header">
                    <div className="report-heading">
                        <span className="report-eyebrow">
                            INTERVORO AI · PERFORMANCE ANALYTICS
                        </span>

                        <h1>Your Interview Report</h1>

                        <p>
                            Review your results, understand your strengths,
                            and identify areas to improve.
                        </p>
                    </div>

                    <div className="report-grade-badge">
                        <span>Overall Grade</span>
                        <strong>{grade}</strong>
                    </div>
                </header>

                {/* Summary Cards */}
                <section className="report-summary">
                    <article className="summary-card">
                        <div className="summary-icon purple-icon">
                            <span>★</span>
                        </div>
                        <div>
                            <p>Average Score</p>
                            <h2>
                                {averageScore.toFixed(1)}
                                <small>/10</small>
                            </h2>
                            <span className="summary-caption">
                                {getPerformanceLabel(averageScore)}
                            </span>
                        </div>
                    </article>

                    <article className="summary-card">
                        <div className="summary-icon blue-icon">
                            <span>✓</span>
                        </div>
                        <div>
                            <p>Total Score</p>
                            <h2>
                                {totalScore}
                                <small> points</small>
                            </h2>
                            <span className="summary-caption">
                                Across evaluated answers
                            </span>
                        </div>
                    </article>

                    <article className="summary-card">
                        <div className="summary-icon cyan-icon">
                            <span>Q</span>
                        </div>
                        <div>
                            <p>Questions</p>
                            <h2>{totalQuestions}</h2>
                            <span className="summary-caption">
                                In this interview
                            </span>
                        </div>
                    </article>

                    <article className="summary-card">
                        <div className="summary-icon green-icon">
                            <span>↑</span>
                        </div>
                        <div>
                            <p>Best Answer</p>
                            <h2>
                                {bestScore}
                                <small>/10</small>
                            </h2>
                            <span className="summary-caption">
                                Highest question score
                            </span>
                        </div>
                    </article>
                </section>

                {/* Overall Performance */}
                <section className="report-panel performance-section">
                    <div className="section-heading">
                        <div>
                            <span className="section-eyebrow">OVERVIEW</span>
                            <h2>Overall Performance</h2>
                            <p>
                                Your average answer score converted to a percentage.
                            </p>
                        </div>
                    </div>

                    <div className="performance-layout">
                        <div className="performance-main">
                            <div className="performance-number">
                                <strong>{performance}%</strong>
                                <span>Performance score</span>
                            </div>

                            <div
                                className="progress-track"
                                role="progressbar"
                                aria-label="Overall performance"
                                aria-valuenow={performance}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="progress-fill"
                                    style={{ width: `${performance}%` }}
                                />
                            </div>

                            <div className="performance-scale">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>

                            <p className="performance-message">
                                {performance >= 80
                                    ? "Great work! Continue practising to maintain your performance."
                                    : performance >= 60
                                    ? "Good progress. Focus on improving answer accuracy and completeness."
                                    : "Keep practising. Review the feedback below to strengthen your answers."}
                            </p>
                        </div>

                        <div className="performance-donut-wrap">
                            <div
                                className="report-donut"
                                style={{
                                    "--performance": `${performance * 3.6}deg`,
                                }}
                                role="img"
                                aria-label={`${performance}% performance`}
                            >
                                <div className="donut-inner">
                                    <strong>{performance}%</strong>
                                    <span>Overall</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="performance-stats">
                        <div>
                            <span className="stat-dot best-dot" />
                            <span>Highest score</span>
                            <strong>{bestScore}/10</strong>
                        </div>
                        <div>
                            <span className="stat-dot lowest-dot" />
                            <span>Lowest score</span>
                            <strong>{lowestScore}/10</strong>
                        </div>
                        <div>
                            <span className="stat-dot average-dot" />
                            <span>Average score</span>
                            <strong>{averageScore.toFixed(1)}/10</strong>
                        </div>
                    </div>
                </section>

                {/* Question-wise Performance */}
                <section className="report-panel">
                    <div className="section-heading">
                        <div>
                            <span className="section-eyebrow">
                                SCORE BREAKDOWN
                            </span>
                            <h2>Question-wise Performance</h2>
                            <p>
                                See how you performed on each evaluated answer.
                            </p>
                        </div>
                    </div>

                    {answers.length > 0 ? (
                        <div className="question-score-list">
                            {answers.map((answer, index) => {
                                const score = normalizedScores[index];

                                return (
                                    <div
                                        className="question-score-item"
                                        key={`${id}-score-${index}`}
                                    >
                                        <div className="question-score-top">
                                            <span className="question-label">
                                                Question {index + 1}
                                            </span>

                                            <strong className={getScoreClass(score)}>
                                                {score}/10
                                            </strong>
                                        </div>

                                        <div
                                            className="question-progress-track"
                                            role="progressbar"
                                            aria-label={`Question ${index + 1} score`}
                                            aria-valuenow={score}
                                            aria-valuemin={0}
                                            aria-valuemax={10}
                                        >
                                            <div
                                                className={`question-progress-fill ${getScoreClass(score)}`}
                                                style={{
                                                    width: `${score * 10}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="question-preview">
                                            {answer.question ||
                                                `Evaluated answer ${index + 1}`}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="report-empty">
                            No question-wise scores are available in this report.
                        </p>
                    )}
                </section>

                {/* Strengths and Weaknesses */}
                <section className="report-feedback-grid">
                    <article className="report-panel feedback-card strengths-card">
                        <div className="feedback-heading">
                            <div className="feedback-icon">✓</div>
                            <div>
                                <h2>Strengths</h2>
                                <p>Areas where you performed well</p>
                            </div>
                        </div>

                        {strengths.length > 0 ? (
                            <ul className="feedback-list">
                                {strengths.map((item, index) => (
                                    <li key={`${id}-strength-${index}`}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="report-empty">
                                No separate strengths summary was provided.
                                Review your question-wise feedback below.
                            </p>
                        )}
                    </article>

                    <article className="report-panel feedback-card weaknesses-card">
                        <div className="feedback-heading">
                            <div className="feedback-icon">↗</div>
                            <div>
                                <h2>Areas to Improve</h2>
                                <p>Topics to focus on next</p>
                            </div>
                        </div>

                        {weaknesses.length > 0 ? (
                            <ul className="feedback-list">
                                {weaknesses.map((item, index) => (
                                    <li key={`${id}-weakness-${index}`}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="report-empty">
                                No separate improvement summary was provided.
                                Use the detailed feedback below to identify
                                areas to practise.
                            </p>
                        )}
                    </article>
                </section>

                {/* Detailed Answer Feedback */}
                <section className="report-panel detailed-feedback">
                    <div className="section-heading">
                        <div>
                            <span className="section-eyebrow">AI EVALUATION</span>
                            <h2>Detailed Answer Feedback</h2>
                            <p>
                                Review the feedback for each answer and learn
                                what you can improve.
                            </p>
                        </div>
                    </div>

                    {answers.length > 0 ? (
                        <div className="answer-list">
                            {answers.map((answer, index) => {
                                const score = normalizedScores[index];

                                return (
                                    <article
                                        className="report-answer"
                                        key={`${id}-answer-${index}`}
                                    >
                                        <div className="answer-header">
                                            <div className="answer-title">
                                                <span className="answer-number">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                <h3>Question {index + 1}</h3>
                                            </div>

                                            <span
                                                className={`answer-score ${getScoreClass(score)}`}
                                            >
                                                {score}/10
                                            </span>
                                        </div>

                                        <div className="answer-content">
                                            <h4>Your Question</h4>
                                            <p>
                                                {answer.question ||
                                                    "Question text is unavailable."}
                                            </p>
                                        </div>

                                        <div className="answer-content">
                                            <h4>Your Answer</h4>
                                            <p>
                                                {answer.answer ||
                                                    "No answer text is available."}
                                            </p>
                                        </div>

                                        <div className="answer-feedback-box">
                                            <h4>
                                                <span>✦</span> AI Feedback
                                            </h4>
                                            <p>
                                                {answer.feedback ||
                                                    "No detailed feedback is available for this answer."}
                                            </p>
                                        </div>

                                        {answer.correct_answer && (
                                            <div className="correct-answer-box">
                                                <h4>
                                                    Suggested Answer / Key Concepts
                                                </h4>
                                                <p>{answer.correct_answer}</p>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="report-empty">
                            No detailed answer evaluations are available.
                        </p>
                    )}
                </section>

                {/* Footer Actions */}
                <footer className="report-footer">
                    <p>
                        Every interview is an opportunity to learn and improve.
                    </p>

                    <div className="report-actions">
                        <button
                            className="report-button secondary-button"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back to Dashboard
                        </button>

                        <button
                            className="report-button primary-button"
                            onClick={() => navigate("/create-interview")}
                        >
                            Practise Again
                            <span aria-hidden="true"> →</span>
                        </button>
                    </div>
                </footer>

            </div>
        </div>
    );
}

export default Report;
