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

    useEffect(() => {

        const fetchInterview = async () => {

            try {

                const res = await API.get(`/interview/${id}`);

                setQuestions(res.data.questions);

            } catch (error) {

                console.log(error);
                alert("Failed to load interview");

            } finally {

                setLoading(false);

            }

        };

        fetchInterview();

    }, [id]);


    const nextQuestion = async () => {

        try {

            const payload = {

                interview_id: id,

                question_number: currentQuestion + 1,

                answer: answers[currentQuestion] || ""

            };

            console.log(payload);

            await API.post("/interview/answer", payload);

            if (currentQuestion < questions.length - 1) {

                setCurrentQuestion(currentQuestion + 1);

            } else {

                alert("Interview Completed");

                navigate(`/result/${id}`);

            }

        } catch (error) {

            console.log(error.response?.data);
            alert("Failed to submit answer");

        }

    };


    const previousQuestion = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(currentQuestion - 1);

        }

    };


    if (loading) {

        return (
            <h2 className="loading">
                Loading Interview...
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
                        onChange={(e) =>
                            setAnswers({
                                ...answers,
                                [currentQuestion]: e.target.value
                            })
                        }
                    />

                </div>

                <div className="button-group">

                    <button
                        className="prev-btn"
                        onClick={previousQuestion}
                        disabled={currentQuestion === 0}
                    >
                        Previous
                    </button>

                    <button
                        className="next-btn"
                        onClick={nextQuestion}
                    >
                        {currentQuestion === questions.length - 1
                            ? "Finish Interview"
                            : "Next Question"}
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Interview;