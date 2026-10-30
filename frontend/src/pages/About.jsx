
import { useState } from "react";
import "../styles/About.css";
import {
    FaRobot,
    FaBrain,
    FaChartLine,
    FaUserTie,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";

const About = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        <section className="about-section">
            <div className="about-container">
                <div className="about-content">
                    <h1>
                        About <span>Intervoro AI</span>
                    </h1>

                    <p>
                        Intervoro AI is an AI-powered interview preparation
                        application designed to help students and professionals
                        practise technical interviews and improve their
                        answering skills.
                    </p>

                    <p>
                        It generates personalized interview questions,
                        evaluates answers, and provides AI-powered feedback
                        to help users understand their strengths and areas
                        for improvement.
                    </p>

                    <button
                        type="button"
                        className="about-btn"
                        onClick={() => setShowMore((previous) => !previous)}
                        aria-expanded={showMore}
                        aria-controls="about-more-details"
                    >
                        {showMore ? "Show Less" : "Explore More"}
                        {showMore ? (
                            <FaChevronUp />
                        ) : (
                            <FaChevronDown />
                        )}
                    </button>
                </div>

                <div className="about-cards">
                    <div className="about-card">
                        <FaRobot />
                        <h3>AI Powered</h3>
                        <p>
                            Generate interview questions tailored to your
                            selected role, experience, and technologies.
                        </p>
                    </div>

                    <div className="about-card">
                        <FaBrain />
                        <h3>Smart Evaluation</h3>
                        <p>
                            Receive AI-generated scores, feedback, strengths,
                            and areas to improve.
                        </p>
                    </div>

                    <div className="about-card">
                        <FaChartLine />
                        <h3>Performance Tracking</h3>
                        <p>
                            Review your interview performance and use
                            available progress insights.
                        </p>
                    </div>

                    <div className="about-card">
                        <FaUserTie />
                        <h3>Career Preparation</h3>
                        <p>
                            Build interview confidence through structured
                            practice in a learning-focused environment.
                        </p>
                    </div>
                </div>
            </div>

            {showMore && (
                <div
                    className="about-more-details"
                    id="about-more-details"
                >
                    <div className="about-details-heading">
                        <span className="about-eyebrow">
                            DISCOVER INTERVORO AI
                        </span>
                        <h2>More Than Interview Practice</h2>
                        <p>
                            Practise, understand your performance, and work
                            towards stronger technical answers through
                            AI-assisted learning.
                        </p>
                    </div>

                    <div className="about-details-grid">
                        <article className="about-detail-item">
                            <span className="about-detail-number">01</span>
                            <h3>Personalized Interview Practice</h3>
                            <p>
                                Choose your role, experience level, difficulty,
                                and technologies to practise relevant
                                interview questions.
                            </p>
                        </article>

                        <article className="about-detail-item">
                            <span className="about-detail-number">02</span>
                            <h3>Answer Evaluation</h3>
                            <p>
                                Get AI-generated evaluation and feedback to
                                help identify what you answered well and
                                what needs further improvement.
                            </p>
                        </article>

                        <article className="about-detail-item">
                            <span className="about-detail-number">03</span>
                            <h3>Identify Learning Gaps</h3>
                            <p>
                                Use feedback to recognize weaker concepts
                                and focus your preparation on topics that
                                need more attention.
                            </p>
                        </article>

                        <article className="about-detail-item">
                            <span className="about-detail-number">04</span>
                            <h3>Learn Through Practice</h3>
                            <p>
                                Strengthen your understanding by reviewing
                                feedback and practising concepts in different
                                contexts where the relevant practice feature
                                is available.
                            </p>
                        </article>
                    </div>

                    <div className="about-mission">
                        <h3>Our Mission</h3>
                        <p>
                            To make interview preparation more accessible,
                            structured, and informative by helping learners
                            practise at their own pace and understand how
                            they can improve.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default About;
