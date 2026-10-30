import { useRef, useState, useEffect } from "react";
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

      const [activeSlide, setActiveSlide] = useState(0);

     const heroSlides = [
    {
        eyebrow: "AI-POWERED INTERVIEW PREPARATION",
        title: "Turn Your Skills Into Interview Confidence",
        description:
            "Practice real interview questions, discover your weaknesses, and improve with personalized AI feedback.",
        button: "Start Mock Interview",
        image: "/images/4.jpg",
        action: () => navigate(
            localStorage.getItem("token")
                ? "/create-interview"
                : "/register"
        ),
    },
    {
        eyebrow: "MASTER TECHNICAL CONCEPTS",
        title: "Learn Today. Crack Interviews Tomorrow.",
        description:
            "Strengthen your SQL, Python, Java, React, and other technical concepts with focused practice.",
        button: "Explore Categories",
        image: "/images/3.jpg",
        action: () =>
            document.getElementById("categories")?.scrollIntoView({
                behavior: "smooth",
            }),
    },
    {
        eyebrow: "SMART RESUME IMPROVEMENT",
        title: "Make Your Resume Interview-Ready",
        description:
            "Analyze your resume, identify potential skill gaps, and get AI-powered suggestions for improvement.",
        button: "Analyze My Resume",
        image: "/images/1.jpeg",
        action: () =>
            document.getElementById("resume-analyzer")?.scrollIntoView({
                behavior: "smooth",
            }),
    },{
    eyebrow: "PERSONALIZED AI FEEDBACK",
    title: "Know Your Strengths. Improve Your Answers.",
    description:
        "Get AI-powered scores, identify mistakes, and receive actionable feedback after every mock interview.",
    button: "Start Practising",
    image: "/images/5..jpg",
    action: () =>
        navigate(localStorage.getItem("token") ? "/create-interview" : "/register"),
},
{
    eyebrow: "TRACK YOUR PROGRESS",
    title: "See How Far You Have Come.",
    description:
        "Review your interview performance, understand your scores, and work towards becoming more confident.",
    button: "View Dashboard",
    image: "/images/2.jpg",
    action: () =>
        navigate(localStorage.getItem("token") ? "/dashboard" : "/register"),
},
{
    eyebrow: "PRACTISE WITH PURPOSE",
    title: "Turn Your Weaknesses Into Strengths.",
    description:
        "Focus on concepts that need improvement and practise applying your knowledge to new technical scenarios.",
    button: "Explore Concept Transfer",
    image: "/images/4.jpg",
    action: () =>
        navigate(
            localStorage.getItem("token")
                ? "/concept-transfer"
                : "/register"
        ),
},
{
    eyebrow: "YOUR CAREER STARTS HERE",
    title: "Prepare Smarter. Interview Better.",
    description:
        "Build a consistent practice routine with technical questions, answer evaluation, and personalized improvement guidance.",
    button: "Get Started",
    image: "/images/5..jpg",
    action: () =>
        navigate(localStorage.getItem("token") ? "/dashboard" : "/register"),
},

{
    eyebrow: "YOUR NEXT INTERVIEW AWAITS",
    title: "Practice Today. Perform With Confidence.",
    description:
        "Prepare for technical interviews at your own pace with role-based questions and AI-generated feedback.",
    button: "Start Your Journey",
    image: "/images/5..jpg",
    action: () =>
        navigate(localStorage.getItem("token") ? "/create-interview" : "/register"),
},
];

useEffect(() => {
    const timer = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
}, []);

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

  
const [typedText, setTypedText] = useState("");

useEffect(() => {
    const text = heroSlides[activeSlide].title;
    let index = 0;
    let timeoutId;

    setTypedText("");

    const typeNextCharacter = () => {
        index += 1;
        setTypedText(text.slice(0, index));

        if (index < text.length) {
            timeoutId = setTimeout(typeNextCharacter, 45);
        }
    };

    timeoutId = setTimeout(typeNextCharacter, 200);

    return () => clearTimeout(timeoutId);
}, [activeSlide]);

const [categorySearch, setCategorySearch] = useState("");
const [showAllCategories, setShowAllCategories] = useState(false);

const categories = [
    // 25 popular categories displayed initially
    { name: "Java", icon: "☕", tag: "PROGRAMMING" },
    { name: "Python", icon: "🐍", tag: "PROGRAMMING" },
    { name: "JavaScript", icon: "JS", tag: "FRONTEND" },
    { name: "TypeScript", icon: "TS", tag: "FRONTEND" },
    { name: "C", icon: "C", tag: "PROGRAMMING" },
    { name: "C++", icon: "C++", tag: "PROGRAMMING" },
    { name: "C#", icon: "C#", tag: "PROGRAMMING" },
    { name: "PHP", icon: "PHP", tag: "BACKEND" },
    { name: "Go", icon: "GO", tag: "BACKEND" },
    { name: "Rust", icon: "R", tag: "PROGRAMMING" },
    { name: "HTML", icon: "5", tag: "FRONTEND" },
    { name: "CSS", icon: "#", tag: "FRONTEND" },
    { name: "React", icon: "⚛", tag: "FRONTEND" },
    { name: "Angular", icon: "A", tag: "FRONTEND" },
    { name: "Vue.js", icon: "V", tag: "FRONTEND" },
    { name: "Node.js", icon: "N", tag: "BACKEND" },
    { name: "Express.js", icon: "Ex", tag: "BACKEND" },
    { name: "MERN Stack", icon: "M", tag: "FULL STACK" },
    { name: "SQL", icon: "▤", tag: "DATABASE" },
    { name: "MySQL", icon: "My", tag: "DATABASE" },
    { name: "MongoDB", icon: "M", tag: "DATABASE" },
    { name: "Data Structures", icon: "⌘", tag: "THEORETICAL" },
    { name: "Data Analyst", icon: "▥", tag: "DATA SCIENCE" },
    { name: "Machine Learning", icon: "✳", tag: "AI / ML" },
    { name: "HR Interview", icon: "♙", tag: "BEHAVIORAL" },

    // Additional categories available through search / View All
    { name: "Ruby", icon: "♦", tag: "PROGRAMMING" },
    { name: "Kotlin", icon: "K", tag: "PROGRAMMING" },
    { name: "Swift", icon: "S", tag: "PROGRAMMING" },
    { name: "R", icon: "R", tag: "DATA SCIENCE" },
    { name: "Dart", icon: "D", tag: "PROGRAMMING" },
    { name: "Scala", icon: "Sc", tag: "PROGRAMMING" },
    { name: "Perl", icon: "P", tag: "PROGRAMMING" },
    { name: "Bash / Shell", icon: "$", tag: "SCRIPTING" },
    { name: "Next.js", icon: "N", tag: "FRONTEND" },
    { name: "Django", icon: "D", tag: "BACKEND" },
    { name: "Flask", icon: "F", tag: "BACKEND" },
    { name: "Spring Boot", icon: "S", tag: "BACKEND" },
    { name: "ASP.NET", icon: "A", tag: "BACKEND" },
    { name: "PostgreSQL", icon: "Pg", tag: "DATABASE" },
    { name: "Oracle Database", icon: "O", tag: "DATABASE" },
    { name: "SQL Server", icon: "SQL", tag: "DATABASE" },
    { name: "Redis", icon: "R", tag: "DATABASE" },
    { name: "Algorithms", icon: "◇", tag: "THEORETICAL" },
    { name: "OOP", icon: "◎", tag: "THEORETICAL" },
    { name: "DBMS", icon: "▤", tag: "THEORETICAL" },
    { name: "Operating Systems", icon: "OS", tag: "THEORETICAL" },
    { name: "Computer Networks", icon: "↔", tag: "THEORETICAL" },
    { name: "System Design", icon: "▦", tag: "PRACTICAL" },
    { name: "Project-Based Interview", icon: "▣", tag: "PRACTICAL" },
    { name: "Scenario-Based Interview", icon: "◇", tag: "PRACTICAL" },
    { name: "Coding Interview", icon: "</>", tag: "PRACTICAL" },
    { name: "Behavioral Interview", icon: "♙", tag: "BEHAVIORAL" },
    { name: "Aptitude & Logical Reasoning", icon: "∑", tag: "APTITUDE" },
    { name: "Data Science", icon: "◉", tag: "DATA SCIENCE" },
    { name: "Artificial Intelligence", icon: "✳", tag: "AI / ML" },
    { name: "Generative AI", icon: "✧", tag: "AI / ML" },
    { name: "Deep Learning", icon: "◉", tag: "AI / ML" },
    { name: "NLP", icon: "Aa", tag: "AI / ML" },
    { name: "Excel", icon: "X", tag: "DATA ANALYTICS" },
    { name: "Power BI", icon: "▥", tag: "DATA ANALYTICS" },
    { name: "Tableau", icon: "T", tag: "DATA ANALYTICS" },
    { name: "Hadoop", icon: "H", tag: "BIG DATA" },
    { name: "Spark", icon: "✦", tag: "BIG DATA" },
    { name: "Docker", icon: "D", tag: "DEVOPS" },
    { name: "Kubernetes", icon: "K", tag: "DEVOPS" },
    { name: "Git & GitHub", icon: "⑂", tag: "DEVELOPER TOOLS" },
    { name: "Linux", icon: "L", tag: "OPERATING SYSTEMS" },
    { name: "AWS", icon: "☁", tag: "CLOUD" },
    { name: "Microsoft Azure", icon: "A", tag: "CLOUD" },
    { name: "Google Cloud", icon: "G", tag: "CLOUD" },
    { name: "CI/CD", icon: "↻", tag: "DEVOPS" },
];

const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearch.trim().toLowerCase())
);

const visibleCategories = categorySearch.trim()
    ? filteredCategories
    : showAllCategories
        ? categories
        : categories.slice(0, 15);

const handleResumeSelection = async (event) => {
        const file = event.target.files?.[0];
console.log("Resume upload function started");
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
const [showBackToTop, setShowBackToTop] = useState(false);

useEffect(() => {
    const handleScroll = () => {
        setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
}, []);
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
            color: #a18aff;
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
            
               

<section className="hero-carousel" id="home">
    {heroSlides.map((slide, index) => (
        <div
            key={slide.title}
            className={`hero-slide ${
                activeSlide === index ? "active" : ""
            }`}
            style={{
                backgroundImage: `linear-gradient(
                    90deg,
                    rgba(8, 11, 24, 0.97) 0%,
                    rgba(8, 11, 24, 0.44) 48%,
                    rgba(8, 11, 24, 0.2) 100%
                ), url("${slide.image}")`,
            }}
            aria-hidden={activeSlide !== index}
        >
            <div className="hero-slide-content">
                <span className="hero-eyebrow">
                    ✦ {slide.eyebrow}
                </span>

             
<h1 className="hero-typing-heading">
    {activeSlide === index ? typedText : slide.title}
    {activeSlide === index && (
        <span className="typing-cursor" aria-hidden="true">
            |
        </span>
    )}
</h1>


                <p>{slide.description}</p>

                <button
                    type="button"
                    className="start-btn"
                    onClick={slide.action}
                    tabIndex={activeSlide === index ? 0 : -1}
                >
                    {slide.button} →
                </button>
            </div>
        </div>
    ))}

    <button
        type="button"
        className="carousel-arrow prev"
        onClick={() =>
            setActiveSlide(
                (activeSlide - 1 + heroSlides.length) % heroSlides.length
            )
        }
        aria-label="Previous banner"
    >
        &#10094;
    </button>

    <button
        type="button"
        className="carousel-arrow next"
        onClick={() =>
            setActiveSlide((activeSlide + 1) % heroSlides.length)
        }
        aria-label="Next banner"
    >
        &#10095;
    </button>

    <div className="carousel-dots">
        {heroSlides.map((slide, index) => (
            <button
                key={slide.title}
                type="button"
                className={`carousel-dot ${
                    activeSlide === index ? "active" : ""
                }`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show banner ${index + 1}`}
                aria-current={activeSlide === index ? "true" : undefined}
            />
        ))}
    </div>
</section>

            <section className="features" id="features">
                <h2>Why Choose Intervoro AI ?</h2>

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
<div><p className="resume-file-hint">
    <span className="pdf-badge">Supported formats : PDF / DOC / DOCX · Max size: 5 MB</span>

</p>
</div>

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

           
{/* ================= INTERVIEW CATEGORIES ================= */}

<section className="categories reveal-on-scroll" id="categories">
    <div className="section-heading">
        <span className="section-eyebrow">
            MASTER YOUR TECH LANGUAGE
        </span>
        <h2>
            Explore Interview <span>Categories</span>
        </h2>
        <p>
            Discover your skills. Practise smarter. Get interview-ready.
        </p>
    </div>

    <div className="category-search-wrapper">
        <input
            type="search"
            className="category-search"
            placeholder="Search languages, frameworks, or skills..."
            aria-label="Search interview categories"
            value={categorySearch}
            onChange={(event) => {
                setCategorySearch(event.target.value);
                setShowAllCategories(false);
            }}
        />
    </div>

    <div className="category-grid">
        {visibleCategories.map((category) => (
            <button
                type="button"
                className="category-card"
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                title={`Practice ${category.name} interview questions`}
            >
                <div className="category-card-top">
                    <div className="category-icon" aria-hidden="true">
                        {category.icon}
                    </div>
                    <span className="category-arrow" aria-hidden="true">
                        ↗
                    </span>
                </div>

                <span className="category-tag">{category.tag}</span>

                <h3>{category.name}</h3>

                <span className="category-practice">
                    Start Practising <span aria-hidden="true">→</span>
                </span>
            </button>
        ))}
    </div>

    {filteredCategories.length === 0 && (
        <p className="category-empty">
            No matching categories found. Try another language or skill.
        </p>
    )}

    {!categorySearch.trim() && (
        <div className="category-view-more">
            <button
                type="button"
                className="category-view-button"
                onClick={() => setShowAllCategories((previous) => !previous)}
            >
                {showAllCategories ? "Show Less ↑" : "View All Categories →"}
            </button>
        </div>
    )}
</section>


{/* ================= CONCEPT TRANSFER ================= */}

<section className="concept-transfer" id="concept-transfer">
    <div className="concept-transfer-inner">
        <div className="concept-transfer-content">
            <span className="concept-transfer-eyebrow">
                ✦ LEARN • APPLY • IMPROVE
            </span>

            <h2>
                Turn Your <span>Weaknesses</span> Into Strengths
            </h2>

            <p className="concept-transfer-description">
                Don't stop at knowing what went wrong. Understand the
                concept, practise it with targeted questions, and test
                your knowledge in a completely new scenario.
            </p>

            <div className="concept-transfer-steps">
                <div className="concept-transfer-step">
                    <div className="concept-step-icon">01</div>
                    <div>
                        <h3>Identify Weak Concepts</h3>
                        <p>
                            Discover topics that need more practice
                            from your interview feedback.
                        </p>
                    </div>
                </div>

                <div className="concept-transfer-step">
                    <div className="concept-step-icon">02</div>
                    <div>
                        <h3>Learn and Practise</h3>
                        <p>
                            Strengthen your understanding with
                            focused explanations and practice.
                        </p>
                    </div>
                </div>

                <div className="concept-transfer-step">
                    <div className="concept-step-icon">03</div>
                    <div>
                        <h3>Apply in a New Scenario</h3>
                        <p>
                            Check whether you can use the same
                            concept in a different situation.
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="concept-transfer-button"
                onClick={() =>
                    navigate(
                        localStorage.getItem("token")
                            ? "/concept-transfer"
                            : "/register"
                    )
                }
            >
                Explore Concept Transfer
                <span aria-hidden="true">→</span>
            </button>

            <p className="concept-transfer-note">
                Practice with purpose. Improve one concept at a time.
            </p>
        </div>

        <div className="concept-transfer-visual">
            <div className="concept-visual-glow" />

            <div className="concept-visual-card">
                <div className="concept-visual-header">
                    <div>
                        <span className="concept-visual-label">
                            YOUR LEARNING JOURNEY
                        </span>
                        <h3>From Weakness to Mastery</h3>
                    </div>
                    <span className="concept-brain-icon">🧠</span>
                </div>

                <div className="concept-topic-card">
                    <div className="concept-topic-icon">⌘</div>
                    <div className="concept-topic-info">
                        <span>CONCEPT TO IMPROVE</span>
                        <strong>SQL Joins</strong>
                    </div>
                    <span className="concept-topic-status">
                        Practice
                    </span>
                </div>

                <div className="concept-journey-line">
                    <span />
                </div>

                <div className="concept-practice-card">
                    <span className="concept-practice-icon">✦</span>
                    <div>
                        <strong>Understand the Concept</strong>
                        <p>Review the idea and practise it.</p>
                    </div>
                    <span className="concept-check">✓</span>
                </div>

                <div className="concept-practice-card">
                    <span className="concept-practice-icon">↗</span>
                    <div>
                        <strong>Try a New Scenario</strong>
                        <p>Apply your knowledge to a fresh problem.</p>
                    </div>
                    <span className="concept-check">✓</span>
                </div>

                <div className="concept-learning-footer">
                    <span className="concept-learning-dot" />
                    Keep learning. Keep improving.
                </div>
            </div>

            <div className="concept-floating-badge">
                <span>✦</span>
                Personalized Practice
            </div>
        </div>
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
                {showBackToTop && (
    <button
        type="button"
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        title="Back to top"
    >
        ↑
    </button>
)}
            </section>
        </>
    );
}

export default Home;