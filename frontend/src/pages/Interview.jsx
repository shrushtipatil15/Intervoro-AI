
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import "../styles/Interview.css";

function Interview() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const response = await API.get(`/interview/${id}`);

                if (!Array.isArray(response.data.questions)) {
                    throw new Error("Interview questions are missing");
                }

                setQuestions(response.data.questions);
            } catch (err) {
                console.error(
                    "Failed to load interview:",
                    err.response?.data || err.message
                );

                setError("Failed to load interview.");
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    const nextQuestion = async () => {
        if (submitting) return;

        if (!questions.length) {
            setError("No questions available.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const payload = {
                interview_id: id,
                question_number: currentQuestion + 1,
                answer: answers[currentQuestion] || ""
            };

            console.log("Submitting answer:", payload);

            const response = await API.post(
                "/interview/answer",
                payload
            );

            console.log("Answer submitted:", response.data);

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion((previous) => previous + 1);
            } else {
                alert("Interview Completed Successfully!");
                navigate(`/result/${id}`);
            }
        } catch (err) {
            console.error(
                "Answer submission failed:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.detail ||
                "Failed to submit answer. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0 && !submitting) {
            setCurrentQuestion((previous) => previous - 1);
        }
    };

    if (loading) {
        return (
            <h2 className="loading">
                Loading Interview...
            </h2>
        );
    }

    if (error && questions.length === 0) {
        return (
            <h2 className="loading">
                {error}
            </h2>
        );
    }

    if (questions.length === 0) {
        return (
            <h2 className="loading">
                No questions found.
            </h2>
        );
    }

    return (
        <div className="page-container">
            <div className="interview-container">

                <h1>AI Interview Session</h1>

                <h3>
                    Question {currentQuestion + 1} of {questions.length}
                </h3>

                <div className="question-card">
                    <p>{questions[currentQuestion]}</p>

                    <textarea
                        placeholder="Write your answer here..."
                        value={answers[currentQuestion] || ""}
                        disabled={submitting}
                        onChange={(e) =>
                            setAnswers((previous) => ({
                                ...previous,
                                [currentQuestion]: e.target.value
                            }))
                        }
                    />
                </div>

                {error && (
                    <p style={{ color: "#ff6b6b" }}>
                        {error}
                    </p>
                )}

                <div className="button-group">

                    <button
                        className="prev-btn"
                        onClick={previousQuestion}
                        disabled={
                            currentQuestion === 0 || submitting
                        }
                    >
                        Previous
                    </button>

                    <button
                        className="next-btn"
                        onClick={nextQuestion}
                        disabled={submitting}
                    >
                        {submitting
                            ? "Submitting..."
                            : currentQuestion === questions.length - 1
                            ? "Finish Interview"
                            : "Next Question"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default Interview;
