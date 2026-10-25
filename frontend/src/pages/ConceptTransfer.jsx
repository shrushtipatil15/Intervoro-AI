
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/ConceptTransfer.css";

function ConceptTransfer() {
    const location = useLocation();
    const navigate = useNavigate();

    const getToken = () =>
        localStorage.getItem("token") ||
        localStorage.getItem("access_token") ||
        "";

    const getInterviewId = () => {
        const stateId = location.state?.interviewId;

        if (stateId) return String(stateId);

        const params = new URLSearchParams(location.search);
        const queryId = params.get("interviewId");

        if (queryId) return queryId;

        const reportMatch = window.location.pathname.match(
            /\/report\/([a-fA-F0-9]{24})/
        );

        return reportMatch ? reportMatch[1] : "";
    };

    const [interviewId, setInterviewId] = useState(getInterviewId);
    const [questionNumber, setQuestionNumber] = useState("");
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(false);
    const [loadingPractice, setLoadingPractice] = useState(false);
    const [error, setError] = useState("");
    const [practice, setPractice] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        const id = getInterviewId();

        if (id) {
            setInterviewId(id);
        }
    }, [location.state, location.search]);

    const loadAnsweredQuestions = async (event) => {
        event.preventDefault();

        const cleanId = interviewId.trim();

        if (!/^[a-fA-F0-9]{24}$/.test(cleanId)) {
            setError(
                "Enter a valid 24-character Interview ID, not the report URL."
            );
            setAnsweredQuestions([]);
            setQuestionNumber("");
            setPractice(null);
            return;
        }

        const token = getToken();

        if (!token) {
            setError("Please log in again before starting concept practice.");
            return;
        }

        setLoadingQuestions(true);
        setError("");
        setPractice(null);
        setAnsweredQuestions([]);
        setQuestionNumber("");

        try {
            const response = await API.get(
                `/concept-transfer/answered/${cleanId}`
            );

            const questions = response.data.answered_questions || [];

            if (!Array.isArray(questions) || questions.length === 0) {
                setError(
                    "No answered questions found. Answer an interview question first."
                );
                return;
            }

            setAnsweredQuestions(questions);
            setQuestionNumber(String(questions[0].question_number));
        } catch (err) {
            console.error(
                "Load answered questions failed:",
                err.response?.status,
                err.response?.data || err.message
            );

            if (err.response?.status === 401) {
                setError(
                    "Your login token is invalid. Log out, log in again, and retry."
                );
            } else {
                setError(
                    err.response?.data?.detail ||
                    "Could not load answered questions. Please try again."
                );
            }
        } finally {
            setLoadingQuestions(false);
        }
    };

    const selectedQuestion = answeredQuestions.find(
        (question) =>
            String(question.question_number) === String(questionNumber)
    );

    const isFullScore = Number(selectedQuestion?.score) === 10;

    const startPractice = async (event) => {
        event.preventDefault();

        if (!interviewId.trim() || !questionNumber) {
            setError("Select an answered question first.");
            return;
        }

        if (isFullScore) {
            setError("");
            setPractice(null);
            return;
        }

        const token = getToken();

        if (!token) {
            setError("Please log in again before starting concept practice.");
            return;
        }

        setLoadingPractice(true);
        setError("");
        setPractice(null);

        try {
            const response = await API.post(
                "/concept-transfer/start",
                {
                    interview_id: interviewId.trim(),
                    question_number: Number(questionNumber),
                }
            );

            setPractice(response.data);
        } catch (err) {
            console.error(
                "Start concept practice failed:",
                err.response?.status,
                err.response?.data || err.message
            );

            if (err.response?.status === 401) {
                setError(
                    "Your login token is invalid. Log out, log in again, and retry."
                );
            } else {
                setError(
                    err.response?.data?.detail ||
                    "Could not generate concept practice. Please try again."
                );
            }
        } finally {
            setLoadingPractice(false);
        }
    };

    return (
        <div className="concept-transfer-page">
            <div className="concept-transfer-container">
                <h1>Concept Transfer Verification</h1>

                <p className="concept-transfer-intro">
                    Identify concepts that need improvement, understand them
                    through clear explanations, and practise with new questions.
                </p>

                <form onSubmit={loadAnsweredQuestions}>
                    <label htmlFor="interviewId">Interview ID</label>

                    <input
                        id="interviewId"
                        type="text"
                        value={interviewId}
                        onChange={(event) =>
                            setInterviewId(event.target.value)
                        }
                        placeholder="Enter your 24-character Interview ID"
                        required
                    />

                    <button type="submit" disabled={loadingQuestions}>
                        {loadingQuestions
                            ? "Loading Answered Questions..."
                            : "Load Answered Questions"}
                    </button>
                </form>

                {answeredQuestions.length > 0 && (
                    <form onSubmit={startPractice}>
                        <label htmlFor="questionNumber">
                            Select an Answered Question
                        </label>

                        <select
                            id="questionNumber"
                            value={questionNumber}
                            onChange={(event) => {
                                setQuestionNumber(event.target.value);
                                setPractice(null);
                                setError("");
                            }}
                            required
                        >
                            {answeredQuestions.map((question) => (
                                <option
                                    key={question.question_number}
                                    value={question.question_number}
                                >
                                    Question {question.question_number}
                                    {question.score !== undefined
                                        ? ` — Score: ${question.score}/10`
                                        : ""}
                                </option>
                            ))}
                        </select>

                        {isFullScore ? (
                            <p
                                className="concept-transfer-help"
                                role="status"
                            >
                                Nothing to improve! You scored 10/10 on this
                                question.
                            </p>
                        ) : (
                            <button
                                type="submit"
                                disabled={loadingPractice}
                            >
                                {loadingPractice
                                    ? "Generating Practice..."
                                    : "Start Concept Practice"}
                            </button>
                        )}
                    </form>
                )}

                {error && (
                    <p className="concept-transfer-error" role="alert">
                        {error}
                    </p>
                )}

                {practice && !isFullScore && (
                    <div className="concept-transfer-results">
                        <h2>Concept Analysis</h2>

                        <h3>Weak Concept</h3>
                        <p>{practice.weak_concept}</p>

                        <h3>Concept Explanation</h3>
                        <p>
                            {practice.concept_explanation ||
                                practice.explanation ||
                                "No concept explanation was returned."}
                        </p>

                        <h3>Why You Need to Improve</h3>
                        <p>{practice.reason}</p>

                        {practice.original_question && (
                            <>
                                <h3>Original Question</h3>
                                <p>{practice.original_question}</p>
                            </>
                        )}

                        {practice.original_score !== undefined && (
                            <>
                                <h3>Original Score</h3>
                                <p>{practice.original_score}/10</p>
                            </>
                        )}

                        <h2>Practice Questions</h2>

                        {practice.practice_questions?.map((question, index) => (
                            <div
                                className="concept-practice-question"
                                key={index}
                            >
                                <strong>Question {index + 1}:</strong>{" "}
                                {question}
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    className="concept-transfer-back"
                    onClick={() => navigate("/dashboard")}
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default ConceptTransfer;
