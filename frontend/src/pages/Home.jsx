import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../styles/Home.css";

function Home() {
    const navigate = useNavigate();
    const resumeInputRef = useRef(null);

    const [jobRole, setJobRole] = useState("");
    const [loadingResume, setLoadingResume] = useState(false);
    const [resumeAnalysis, setResumeAnalysis] = useState(null);
    const [resumeError, setResumeError] = useState("");

    const features = [
        {
            icon: "🤖",
            title: "AI Mock Interviews",
            desc: "Practice AI-generated interviews tailored to your role.",
            action: () => navigate("/create-interview"),
        },
        {
            icon: "📄",
            title: "Resume Analyzer",
            desc: "Analyze your resume with ATS scoring and recommendations.",
            action: () =>
                document.getElementById("resume-analyzer")?.scrollIntoView({
                    behavior: "smooth",
                }),
        },
        {
            icon: "📊",
            title: "Performance Dashboard",
            desc: "Track your interview scores and improvements.",
            action: () => navigate("/dashboard"),
        },
        {
            icon: "🎤",
            title: "Interview Categories",
            desc: "Explore interview topics and categories.",
            action: () =>
                document.getElementById("categories")?.scrollIntoView({
                    behavior: "smooth",
                }),
        },
        {
            icon: "🧠",
            title: "AI Feedback",
            desc: "Receive technical and communication feedback.",
            action: () =>
                document.getElementById("report-preview")?.scrollIntoView({
                    behavior: "smooth",
                }),
        },
        {
            icon: "📈",
            title: "Progress Tracking",
            desc: "Monitor your progress and interview history.",
            action: () => navigate("/interview-history"),
        },
    ];

    const categories = [
        "Frontend", "Backend", "Full Stack", "Java", "Python", "C++",
        "React", "Node.js", "MongoDB", "SQL", "JavaScript", "Data Analyst",
        "DevOps", "Cloud", "Machine Learning", "Data Science",
        "Cyber Security", "UI/UX", "PHP", "+Other",
    ];

    const handleResumeSelection = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setResumeError("");
        setResumeAnalysis(null);

        if (!/\.(pdf|docx)$/i.test(file.name)) {
            setResumeError("Please select a PDF or DOCX resume.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setResumeError("Your resume must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        setLoadingResume(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("job_role", jobRole);

            const response = await API.post("/resume/analyze", formData);
            const data = response.data;

            if (!data?.analysis) {
                throw new Error("The server returned no analysis results.");
            }

            setResumeAnalysis(data.analysis);
        } catch (error) {
            console.error("Resume analysis error:", error);

            setResumeError(
                error.response?.data?.detail ||
                error.message ||
                "Unable to connect to the backend. Please check your backend URL and try again."
            );
        } finally {
            setLoadingResume(false);
            event.target.value = "";
        }
    };

    const bars = [38, 55, 48, 70, 86];

    const steps = [
        {
            title: "Create account",
            desc: "Register in seconds and set up your profile.",
            art: (
                <div className="hiw-glass hiw-form">
                    <div className="hiw-avatar">👤</div>
                    <div className="hiw-line w70" />
                    <div className="hiw-line w50" />
                    <div className="hiw-pill">Sign up</div>
                </div>
            ),
        },
        {
            title: "Generate questions",
            desc: "Pick a role or category and get questions written for it.",
            art: (
                <div className="hiw-stack">
                    <div className="hiw-glass hiw-chip active">
                        ⚛️ React Developer
                    </div>
                    <div className="hiw-glass hiw-chip">💻 Full Stack</div>
                    <div className="hiw-glass hiw-chip">🧠 Behavioral</div>
                </div>
            ),
        },
        {
            title: "Answer questions",
            desc: "Practice technical and HR questions in your own words.",
            art: (
                <div className="hiw-glass hiw-answer">
                    <span className="hiw-live">● Live</span>
                    <div className="hiw-q">Explain the Virtual DOM…</div>
                    <div className="hiw-wave">
                        {[10, 22, 14, 28, 18, 30, 12, 24, 16].map((h, i) => (
                            <i key={i} style={{ height: h }} />
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: "Receive feedback",
            desc: "Get a score and clear notes on every answer.",
            art: (
                <div className="hiw-glass hiw-feedback">
                    <div className="hiw-ring">
                        <b>84</b>
                        <small>/100</small>
                    </div>
                    <ul>
                        <li>✓ Relevance</li>
                        <li>✓ Structure</li>
                        <li>✓ Specificity</li>
                    </ul>
                </div>
            ),
        },
        {
            title: "Track progress",
            desc: "View reports and watch your scores.",
            art: (
                <div className="hiw-glass hiw-chart">
                    <div className="hiw-bars">
                        {bars.map((h, i) => (
                            <i key={i} style={{ height: `${h}%` }} />
                        ))}
                    </div>
                    <span className="hiw-trend"></span>
                </div>
            ),
        },
        {
            title: "Master Weak Concepts",
            desc: "Understand missed concepts, practise targeted questions, and apply your knowledge to new scenarios.",
            art: (
                <div className="hiw-glass hiw-answer">
                    <span className="hiw-live">AI Practice</span>
                    <div className="hiw-q">🧠 Concept Identified</div>
                    <div
                        style={{
                            fontSize: "13px",
                            color: "#c4b5fd",
                            marginBottom: "12px",
                        }}
                    >
                        SQL Joins
                    </div>
                    <div className="hiw-pill">
                        Practice New Scenario →
                    </div>
                </div>
            ),
        },
    ];

    const CSS = `
        .hiw {
            padding: 80px 6%;
            background: #080f1e;
            color: #f8fafc;
        }

        .hiw-inner {
            max-width: 1200px;
            margin: 0 auto;
        }

        .hiw-eyebrow {
            margin: 0 0 12px;
            color: #60a5fa;
            font-size: 15px;
            font-weight: 600;
        }

        .hiw-title {
            margin: 0 0 48px;
            max-width: 560px;
            font-size: clamp(32px, 4.4vw, 52px);
            font-weight: 500;
            line-height: 1.12;
            text-align: left;
        }

        .hiw-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 36px 28px;
        }

        .hiw-step {
            grid-column: auto;
        }

        .hiw-art {
            position: relative;
            height: 230px;
            border-radius: 24px;
            overflow: hidden;
            display: grid;
            place-items: center;
            background: radial-gradient(
                120% 120% at 20% 0%,
                #2f3fa8 0%,
                #1c2266 42%,
                #0c1230 100%
            );
            border: 1px solid #263b54;
            box-shadow: 0 24px 40px -24px rgba(0,0,0,.8);
        }

        .hiw-art::before {
            content: "";
            position: absolute;
            width: 220px;
            height: 220px;
            right: -60px;
            bottom: -90px;
            border-radius: 50%;
            background: rgba(128,56,236,.40);
            filter: blur(50px);
        }

        .hiw-head {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 22px 0 8px;
        }

        .hiw-num {
            flex: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #315efb, #8038ec);
            color: #ffffff;
            font-size: 14px;
            font-weight: 700;
        }

        .hiw-head h3 {
            margin: 0;
            font-size: 21px;
            font-weight: 500;
            text-align: left;
        }

        .hiw-desc {
            margin: 0;
            color: #a8b6cc;
            font-size: 15px;
            line-height: 1.65;
            text-align: left;
        }

        .hiw-glass {
            position: relative;
            z-index: 1;
            border-radius: 16px;
            padding: 14px 16px;
            background: rgba(255,255,255,.10);
            border: 1px solid rgba(255,255,255,.18);
            backdrop-filter: blur(8px);
            color: #fff;
            font-size: 14px;
        }

        .hiw-line {
            height: 8px;
            border-radius: 6px;
            background: rgba(255,255,255,.28);
            margin: 8px 0;
        }

        .w70 { width: 70%; }
        .w50 { width: 50%; }

        .hiw-form {
            width: 190px;
            text-align: center;
        }

        .hiw-form .hiw-line {
            margin-left: auto;
            margin-right: auto;
        }

        .hiw-avatar {
            width: 44px;
            height: 44px;
            margin: 0 auto 6px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #315efb, #8038ec);
            font-size: 20px;
        }

        .hiw-pill {
            margin-top: 12px;
            padding: 7px;
            border-radius: 999px;
            background: linear-gradient(110deg, #315efb, #8038ec);
            color: #ffffff;
            font-weight: 700;
            font-size: 13px;
        }

        .hiw-stack {
            position: relative;
            z-index: 1;
            display: grid;
            gap: 10px;
            width: 220px;
        }

        .hiw-chip {
            padding: 12px 16px;
            font-weight: 600;
        }

        .hiw-chip.active {
            background: rgba(128,56,236,.35);
            border-color: #a78bfa;
        }

        .hiw-answer {
            width: 230px;
        }

        .hiw-live {
            display: inline-block;
            margin-bottom: 8px;
            padding: 2px 8px;
            border-radius: 999px;
            background: #16a34a;
            font-size: 11px;
            font-weight: 700;
        }

        .hiw-q {
            font-weight: 600;
            margin-bottom: 12px;
        }

        .hiw-wave {
            display: flex;
            align-items: center;
            gap: 5px;
            height: 34px;
        }

        .hiw-wave i {
            width: 5px;
            border-radius: 4px;
            background: #a78bfa;
        }

        .hiw-feedback {
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .hiw-ring {
            width: 82px;
            height: 82px;
            border-radius: 50%;
            display: grid;
            place-content: center;
            text-align: center;
            background:
                radial-gradient(#0f1840 58%, transparent 60%),
                conic-gradient(#22c55e 84%, rgba(255,255,255,.15) 0);
        }

        .hiw-ring b {
            font-size: 24px;
            line-height: 1;
        }

        .hiw-ring small {
            font-size: 10px;
            color: #b8c2d8;
        }

        .hiw-feedback ul {
            margin: 0;
            padding: 0;
            list-style: none;
            display: grid;
            gap: 6px;
            font-weight: 600;
            font-size: 13px;
            text-align: left;
        }

        .hiw-feedback li {
            color: #86efac;
        }

        .hiw-chart {
            width: 230px;
        }

        .hiw-bars {
            display: flex;
            align-items: flex-end;
            gap: 10px;
            height: 84px;
        }

        .hiw-bars i {
            flex: 1;
            border-radius: 6px 6px 2px 2px;
            background: linear-gradient(#60a5fa, #8038ec);
        }

        .hiw-trend {
            display: block;
            margin-top: 10px;
            color: #86efac;
            font-weight: 600;
            font-size: 13px;
        }

        @media (max-width: 620px) {
            .hiw {
                padding: 56px 20px;
            }

            .hiw-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    return (
        <>
            <section className="hero" id="home">
                <div className="hero-left">
                    <h1>
                        Ace Your <span>AI Interview</span>
                    </h1>

                    <p>
                        Practice AI-powered interviews, analyze your resume,
                        improve communication skills and get instant feedback
                        to crack your dream job.
                    </p>

                    <button
                        type="button"
                        className="start-btn"
                        onClick={() => {
                            const token = localStorage.getItem("token");

                            if (token) {
                                navigate("/dashboard");
                            } else {
                                navigate("/register");
                            }
                        }}
                    >
                        Get Started
                    </button>
                </div>
            </section>

            <section className="features" id="features">
                <h2>Why Choose AI Interview Bot?</h2>

                <div className="feature-grid">
                    {features.map((feature) => (
                        <button
                            type="button"
                            key={feature.title}
                            className="feature-card"
                            onClick={feature.action}
                            aria-label={`Open ${feature.title}`}
                            style={{
                                position: "relative",
                                zIndex: 2,
                                pointerEvents: "auto",
                            }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </button>
                    ))}
                </div>
            </section>

            <section className="resume-section" id="resume-analyzer">
                <div className="resume-left">
                    <h2>AI Resume Analyzer</h2>

                    <p>
                        Upload your resume and receive an AI-generated
                        ATS-style score with intelligent suggestions to
                        improve your chances of getting shortlisted.
                    </p>

                    <ul>
                        <li>✔ ATS-style Resume Score</li>
                        <li>✔ Potential Missing Skills</li>
                        <li>✔ Formatting Feedback</li>
                        <li>✔ Keyword Matching</li>
                        <li>✔ Resume Summary</li>
                    </ul>

                    <label htmlFor="resume-job-role">
                        Target Job Role (optional)
                    </label>

                    <input
                        id="resume-job-role"
                        type="text"
                        value={jobRole}
                        onChange={(event) => setJobRole(event.target.value)}
                        placeholder="e.g. React Developer"
                        className="resume-role-input"
                    />

                    <input
                        ref={resumeInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleResumeSelection}
                        hidden
                    />

                    <button
                        type="button"
                        className="upload-btn"
                        disabled={loadingResume}
                        onClick={() => resumeInputRef.current?.click()}
                    >
                        {loadingResume
                            ? "Analyzing Resume..."
                            : "Upload Resume"}
                    </button>

                    {loadingResume && (
                        <p role="status">
                            Uploading your resume and getting AI feedback.
                            Please wait...
                        </p>
                    )}

                    {resumeError && (
                        <p
                            role="alert"
                            style={{
                                color: "#ff6b6b",
                                overflowWrap: "anywhere",
                            }}
                        >
                            {resumeError}
                        </p>
                    )}
                </div>

                <div className="resume-right">
                    <div className="resume-card">
                        <h3>ATS Resume Score</h3>

                        <div className="score-circle">
                            {resumeAnalysis
                                ? `${resumeAnalysis.ats_score}%`
                                : "--"}
                        </div>

                        <p>
                            {resumeAnalysis
                                ? "AI-generated ATS-style estimate"
                                : "Upload your resume to see your score"}
                        </p>

                        {resumeAnalysis && (
                            <div className="resume-results">
                                <h3>Resume Summary</h3>
                                <p>{resumeAnalysis.resume_summary}</p>

                                <h3>Strengths</h3>
                                <ul>
                                    {resumeAnalysis.strengths.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>

                                <h3>Potential Skill Gaps</h3>
                                <ul>
                                    {resumeAnalysis.missing_skills.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>

                                <h3>Suggested Improvements</h3>
                                <ul>
                                    {resumeAnalysis.improvements.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>

                                <h3>Matched Keywords</h3>
                                <ul>
                                    {resumeAnalysis.keyword_match.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>

                                <h3>Formatting Feedback</h3>
                                <p>{resumeAnalysis.formatting_feedback}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="hiw" id="how-it-works">
                <style>{CSS}</style>

                <div className="hiw-inner">
                    <p className="hiw-eyebrow">How it works</p>
                    <h2 className="hiw-title">How an Intervoro AI works</h2>

                    <div className="hiw-grid">
                        {steps.map((step, index) => (
                            <article className="hiw-step" key={step.title}>
                                <div className="hiw-art">{step.art}</div>

                                <div className="hiw-head">
                                    <span className="hiw-num">{index + 1}</span>
                                    <h3>{step.title}</h3>
                                </div>

                                <p className="hiw-desc">{step.desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="categories" id="categories">
                <h2>Interview Categories</h2>

                <div className="category-grid">
                    {categories.map((item) => (
                        <button
                            type="button"
                            className="category-card"
                            style={{
                                position: "relative",
                                zIndex: 2,
                                pointerEvents: "auto",
                            }}
                            key={item}
                            onClick={() =>
                                navigate("/create-interview", {
                                    state: { category: item },
                                })
                            }
                            title={`Practice ${item} interview questions`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </section>

            <section className="report-preview" id="report-preview">
                <div className="report-preview-header">
                    <span className="report-eyebrow">
                        YOUR PERFORMANCE, ANALYZED
                    </span>
                    <h2>AI Interview Report &amp; Result</h2>
                    <p>
                        Get a detailed breakdown of your interview performance,
                        understand your strengths and weaknesses, and discover
                        exactly what to improve next.
                    </p>
                </div>

                <div className="report-preview-card">
                    <div className="report-topbar">
                        <div>
                            <span className="report-label">INTERVORO AI</span>
                            <h3>Interview Performance Report</h3>
                            <p>Full Stack Developer · Sample Report</p>
                        </div>
                    </div>

                    <div className="report-overview">
                        <div className="report-score-panel">
                            <span className="report-label">OVERALL SCORE</span>
                            <div className="report-score-ring">
                                <div>
                                    <strong>8.4</strong>
                                    <span>/ 10</span>
                                </div>
                            </div>
                            <span className="report-grade">Grade A</span>
                            <p>Strong performance</p>
                        </div>

                        <div className="report-metrics">
                            <div className="report-metric">
                                <span className="metric-icon">📋</span>
                                <div>
                                    <strong>5</strong>
                                    <span>Questions Evaluated</span>
                                </div>
                            </div>

                            <div className="report-metric">
                                <span className="metric-icon">✓</span>
                                <div>
                                    <strong>4</strong>
                                    <span>Strong Answers</span>
                                </div>
                            </div>

                            <div className="report-metric">
                                <span className="metric-icon">🧠</span>
                                <div>
                                    <strong>2</strong>
                                    <span>Areas to Improve</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="report-section">
                        <div className="report-section-heading">
                            <div>
                                <span className="report-label">
                                    ANSWER ANALYSIS
                                </span>
                                <h4>Question-wise Performance</h4>
                            </div>
                            <span className="report-mini-badge">5 Questions</span>
                        </div>

                        <div className="report-question">
                            <div className="report-question-info">
                                <span className="report-q-number">01</span>
                                <div>
                                    <strong>
                                        Explain the Virtual DOM in React.
                                    </strong>
                                    <span>
                                        Technical correctness · Relevance
                                    </span>
                                </div>
                            </div>
                            <div className="report-question-score">
                                <strong>9.2</strong>
                                <span>/10</span>
                            </div>
                            <div className="report-progress">
                                <span style={{ width: "92%" }} />
                            </div>
                        </div>

                        <div className="report-question">
                            <div className="report-question-info">
                                <span className="report-q-number">02</span>
                                <div>
                                    <strong>How do SQL joins work?</strong>
                                    <span>
                                        Completeness · Conceptual understanding
                                    </span>
                                </div>
                            </div>
                            <div className="report-question-score">
                                <strong>6.5</strong>
                                <span>/10</span>
                            </div>
                            <div className="report-progress">
                                <span style={{ width: "65%" }} />
                            </div>
                        </div>

                        <div className="report-question">
                            <div className="report-question-info">
                                <span className="report-q-number">03</span>
                                <div>
                                    <strong>
                                        Explain REST API principles.
                                    </strong>
                                    <span>
                                        Accuracy · Answer structure
                                    </span>
                                </div>
                            </div>
                            <div className="report-question-score">
                                <strong>8.8</strong>
                                <span>/10</span>
                            </div>
                            <div className="report-progress">
                                <span style={{ width: "88%" }} />
                            </div>
                        </div>
                    </div>

                    <div className="report-insights">
                        <div className="report-insight report-strength">
                            <span className="insight-icon">↗</span>
                            <div>
                                <h4>Strengths</h4>
                                <p>
                                    Good technical explanations, relevant
                                    examples, and clear understanding of React
                                    concepts.
                                </p>
                            </div>
                        </div>

                        <div className="report-insight report-weakness">
                            <span className="insight-icon">◎</span>
                            <div>
                                <h4>Areas to Improve</h4>
                                <p>
                                    Strengthen SQL join concepts and include
                                    more detailed examples in technical answers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="report-recommendation">
                        <div className="recommendation-icon">✦</div>
                        <div>
                            <span className="report-label">
                                PERSONALIZED NEXT STEP
                            </span>
                            <h4>Master Your Weak Concepts</h4>
                            <p>
                                Review the missing concepts, practise targeted
                                questions, and test your understanding with new
                                scenarios.
                            </p>
                        </div>
                    </div>

                    <div className="report-footer">
                        <span>
                            ✦ AI-generated evaluation and personalized feedback
                        </span>
                        <span className="report-footer-tag">
                            SAMPLE PREVIEW
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;