
import "../styles/About.css";
import { FaRobot, FaBrain, FaChartLine, FaUserTie } from "react-icons/fa";

const About = () => {
    return (
        <section className="about-section">
<div className="page-container">
            <div className="about-container">

                <div className="about-content">

                    <h1>
                        About <span>Intervoro AI</span>
                    </h1>

                    <p>
                        AI Interview Bot is an intelligent platform designed to
                        help students and professionals prepare for interviews
                        using Artificial Intelligence.
                    </p>

                    <p>
                        It generates personalized interview questions,
                        evaluates answers, and provides AI-powered feedback
                        to improve confidence and performance.
                    </p>


                    <button className="about-btn">
                        Explore More
                    </button>

                </div>


                <div className="about-cards">

                    <div className="about-card">
                        <FaRobot />
                        <h3>AI Powered</h3>
                        <p>
                            Smart question generation using advanced AI models.
                        </p>
                    </div>


                    <div className="about-card">
                        <FaBrain />
                        <h3>Smart Evaluation</h3>
                        <p>
                            Analyze responses and get detailed improvement tips.
                        </p>
                    </div>


                    <div className="about-card">
                        <FaChartLine />
                        <h3>Performance Tracking</h3>
                        <p>
                            Track interview progress and improve skills.
                        </p>
                    </div>


                    <div className="about-card">
                        <FaUserTie />
                        <h3>Career Preparation</h3>
                        <p>
                            Practice real-world interview experiences.
                        </p>
                    </div>

                </div>

            </div>
</div>
        </section>
    );
};

export default About;