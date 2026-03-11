import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { QUESTIONS, shuffleQuestions, Question } from "@/data/questions";

// ── EmailJS credentials ─────────────────────────────────────────────────────
// Replace these three values with your own from emailjs.com
const EMAILJS_SERVICE_ID  = "service_eqq2x4w";
const EMAILJS_TEMPLATE_ID = "template_vt88u8r";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
// ────────────────────────────────────────────────────────────────────────────

const TOTAL_TIME = 20 * 60; // seconds

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions]  = useState<Question[]>(() => shuffleQuestions(QUESTIONS));
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(20).fill(null));
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const studentName  = sessionStorage.getItem("quiz_name")  || "Unknown";
  const studentEmail = sessionStorage.getItem("quiz_email") || "unknown@email.com";

  // Guard: redirect to login if no session
  useEffect(() => {
    if (!sessionStorage.getItem("quiz_name")) {
      navigate("/");
    }
  }, [navigate]);

  // Countdown
  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [submitted]); // eslint-disable-line

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitted) return;
      setSubmitted(true);
      clearInterval(timerRef.current!);

      const score = answers.reduce((acc, ans, i) => {
        return acc + (ans === questions[i].correct ? 1 : 0);
      }, 0);

      const answerDetails = questions
        .map((q, i) => {
          const chosen = answers[i] !== null ? q.options[answers[i]!] : "NOT ANSWERED";
          const correct = q.options[q.correct];
          const status = answers[i] === q.correct ? "✓" : "✗";
          return `Q${i + 1}. ${q.question}\n   Selected: ${chosen}\n   Correct : ${correct} ${status}`;
        })
        .join("\n\n");

      const templateParams = {
        student_name:  studentName,
        student_email: studentEmail,
        submitted_at:  new Date().toLocaleString(),
        score:         `${score} / 20`,
        auto_submit:   auto ? "YES (time expired)" : "NO (manual submit)",
        answers:       answerDetails,
      };

      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
      } catch (err) {
        console.error("EmailJS error:", err);
      }

      navigate("/terminated");
    },
    [submitted, answers, questions, studentName, studentEmail, navigate]
  );

  const selectAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  };

  const goNext = () => {
    if (current < 19) setCurrent((c) => c + 1);
  };

  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (submitted) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goPrev();
      if (e.key === "1") selectAnswer(0);
      if (e.key === "2") selectAnswer(1);
      if (e.key === "3") selectAnswer(2);
      if (e.key === "4") selectAnswer(3);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, submitted]); // eslint-disable-line

  const pct = (timeLeft / TOTAL_TIME) * 100;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const q = questions[current];
  const answered = answers.filter((a) => a !== null).length;

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Roboto Mono', monospace" }}>
      {/* ── Timer bar ── */}
      <div
        className="fixed top-0 left-0 w-full z-50"
        onMouseEnter={() => setHoverTimer(true)}
        onMouseLeave={() => setHoverTimer(false)}
      >
        {/* 1px depleting bar */}
        <div className="h-[2px] bg-background w-full relative">
          <div
            className="absolute left-0 top-0 h-full bg-primary transition-none"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Hover tooltip: time remaining */}
        {hoverTimer && (
          <div className="absolute top-2 right-4 bg-background border border-border px-3 py-1 text-xs text-primary tracking-widest">
            {mins}:{secs} REMAINING
          </div>
        )}
      </div>

      {/* ── Main container ── */}
      <div className="flex-1 flex flex-col max-w-[800px] mx-auto w-full px-6 pt-10 pb-8">

        {/* Header row */}
        <div className="flex items-center justify-between mb-8 pt-2">
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            {studentName}
          </span>
          <span className="text-xs text-muted-foreground tracking-widest">
            {answered} / 20 ANSWERED
          </span>
        </div>

        {/* Question counter */}
        <div className="mb-2">
          <span className="text-xs text-primary tracking-widest uppercase">
            Q_{String(current + 1).padStart(2, "0")} / 20
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* Question text */}
        <div className="mb-8 min-h-[80px]">
          <p className="text-foreground text-base leading-relaxed tracking-wide">
            {q.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-10">
          {q.options.map((opt, i) => {
            const isSelected = answers[current] === i;
            return (
              <div
                key={i}
                onClick={() => selectAnswer(i)}
                className={`quiz-option flex items-start gap-4${isSelected ? " selected" : ""}`}
              >
                <span className={`text-xs tracking-widest shrink-0 pt-0.5 ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                  [{i + 1}]
                </span>
                <span className="text-sm leading-relaxed">{opt}</span>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="text-xs tracking-widest uppercase border border-border px-5 py-2.5 text-foreground hover:border-primary hover:text-primary transition-colors duration-100 disabled:opacity-20 disabled:cursor-not-allowed"
          >
            ← PREV
          </button>

          <span className="text-xs text-muted-foreground tracking-widest">
            ← → ARROW KEYS
          </span>

          {current < 19 ? (
            <button
              onClick={goNext}
              className="text-xs tracking-widest uppercase border border-border px-5 py-2.5 text-foreground hover:border-primary hover:text-primary transition-colors duration-100"
            >
              NEXT →
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              className="text-xs tracking-widest uppercase border border-primary px-5 py-2.5 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
            >
              SUBMIT ↵
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
