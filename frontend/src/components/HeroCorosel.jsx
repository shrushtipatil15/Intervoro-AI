
import { useEffect, useState } from "react";

const slides = [
  { img: "/images/hero1.jpg", title: "AI Mock Interviews", text: "Role-specific questions generated in seconds." },
  { img: "/images/hero2.jpg", title: "Resume Analyzer", text: "ATS score, missing skills and keyword match." },
  { img: "/images/hero3.jpg", title: "Instant AI Feedback", text: "Technical and communication scoring on every answer." },
  { img: "/images/hero4.jpg", title: "Progress Dashboard", text: "Track streaks, scores and improvement over time." },
];

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [paused]);

  const go = (dir) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <div
      className="hc"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hc-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s) => (
          <div className="hc-slide" key={s.title}>
            <img src={s.img} alt={s.title} onError={(e) => (e.target.style.display = "none")} />
            <div className="hc-caption">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="hc-arrow hc-prev" onClick={() => go(-1)} aria-label="Previous slide">‹</button>
      <button className="hc-arrow hc-next" onClick={() => go(1)} aria-label="Next slide">›</button>

      <div className="hc-dots">
        {slides.map((s, i) => (
          <button
            key={s.title}
            className={i === index ? "active" : ""}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;