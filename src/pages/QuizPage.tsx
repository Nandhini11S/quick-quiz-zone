import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { QUESTIONS, shuffleQuestions, Question } from "@/data/questions";

// ── EmailJS credentials ─────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_eqq2x4w";
const EMAILJS_TEMPLATE_ID = "template_vt88u8r";
const EMAILJS_PUBLIC_KEY  = "QvCjPoCT5Zq9mpdRf";
// ────────────────────────────────────────────────────────────────────────────

const QUESTION_TIME = 60;  // 60 seconds per question
const TOTAL_QUESTIONS = 20;

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions]  = useState<Question[]>(() => shuffleQuestions(QUESTIONS));
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState<(number | null)[]>(Array(TOTAL_QUESTIONS).fill(null));
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Store answers in a ref so handleSubmit always sees the latest value
  const answersRef = useRef<(number | null)[]>(Array(TOTAL_QUESTIONS).fill(null));

  const studentName  = sessionStorage.getItem("quiz_name")  || "Unknown";
  const studentEmail = sessionStorage.getItem("quiz_email") || "unknown@email.com";

  // Guard: redirect to login if no session
  useEffect(() => {
    if (!sessionStorage.getItem("quiz_name")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitted) return;
      setSubmitted(true);
      clearInterval(timerRef.current!);

      const latestAnswers = answersRef.current;
      const score = latestAnswers.reduce((acc, ans, i) => {
        return acc + (ans === questions[i].correct ? 1 : 0);
      }, 0);

      const answerDetails = questions
        .map((q, i) => {
          const chosen = latestAnswers[i] !== null ? q.options[latestAnswers[i]!] : "NOT ANSWERED";
          const correct = q.options[q.correct];
          const status = latestAnswers[i] === q.correct ? "✓" : "✗";
          return `Q${i + 1}. ${q.question}\n   Selected: ${chosen}\n   Correct : ${correct} ${status}`;
        })
        .join("\n\n");

      const templateParams = {
        student_name:  studentName,
        student_email: studentEmail,
        submitted_at:  new Date().toLocaleString(),
        score:         `${score} / ${TOTAL_QUESTIONS}`,
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
    [submitted, questions, studentName, studentEmail, navigate]
  );

  // Per-question countdown — resets every time `current` changes
  useEffect(() => {
    if (submitted) return;
    setTimeLeft(QUESTION_TIME);
    clearInterval(timerRef.current!);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto-advance or auto-submit on last question
          if (current < TOTAL_QUESTIONS - 1) {
            setCurrent((c) => c + 1);
          } else {
            handleSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [current, submitted]); // eslint-disable-line

  const selectAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      answersRef.current = next;
      return next;
    });
  };

  const goNext = () => {
    if (current < TOTAL_QUESTIONS - 1) setCurrent((c) => c + 1);
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

  const pct = (timeLeft / QUESTION_TIME) * 100;
  const secs = String(timeLeft).padStart(2, "0");
  const answered = answers.filter((a) => a !== null).length;

  // Timer colour class
  const timerBarClass =
    timeLeft <= 10 ? "timer-danger" :
    timeLeft <= 20 ? "timer-warning" : "";

  const q = questions[current];

  return (
    <div
      className="min-h-screen bg-background flex flex-col scan-overlay"
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* ── Per-question timer bar ── */}
      <div
        className="fixed top-0 left-0 w-full z-50"
        onMouseEnter={() => setHoverTimer(true)}
        onMouseLeave={() => setHoverTimer(false)}
      >
        <div className="h-[3px] bg-muted w-full relative">
          <div
            className={`absolute left-0 top-0 h-full transition-none ${timerBarClass}`}
            style={{
              width: `${pct}%`,
              background: timerBarClass ? undefined : "hsl(var(--primary))",
              boxShadow: timerBarClass ? undefined : "0 0 8px hsl(var(--primary) / 0.5)",
            }}
          />
        </div>

        {/* Hover tooltip */}
        {hoverTimer && (
          <div className="absolute top-2 right-4 bg-background border border-primary px-3 py-1 text-xs text-primary tracking-widest"
            style={{ boxShadow: "0 0 10px hsl(var(--primary) / 0.3)" }}
          >
            {secs}s REMAINING
          </div>
        )}
      </div>

      {/* ── Main container ── */}
      <div className="flex-1 flex flex-col max-w-[820px] mx-auto w-full px-6 pt-10 pb-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-3">
            <span className="ece-badge">ECE DEPT</span>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">{studentName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground tracking-widest">
              {answered} / {TOTAL_QUESTIONS} ANSWERED
            </span>
            {/* Per-question countdown ring */}
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-bold tracking-widest tabular-nums ${
                  timeLeft <= 10 ? "text-destructive" :
                  timeLeft <= 20 ? "text-[hsl(var(--ece-amber))]" : "text-primary"
                }`}
              >
                {secs}s
              </span>
            </div>
          </div>
        </div>

        {/* Question counter */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-primary tracking-widest uppercase">
            Q_{String(current + 1).padStart(2, "0")} / {TOTAL_QUESTIONS}
          </span>
          <span className="text-xs text-muted-foreground tracking-widest">
            SYMPOSIUM TECHNICAL QUIZ
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-primary mb-6" style={{ boxShadow: "0 0 6px hsl(var(--primary) / 0.6)" }} />

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

          {current < TOTAL_QUESTIONS - 1 ? (
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
              style={{ boxShadow: "0 0 10px hsl(var(--primary) / 0.3)" }}
            >
              SUBMIT ↵
            </button>
          )}
        </div>

        {/* Question dot-map progress */}
        <div className="mt-8 flex flex-wrap gap-1.5 justify-center">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-5 h-5 text-[9px] flex items-center justify-center border transition-colors duration-100 ${
                i === current
                  ? "border-primary bg-primary text-primary-foreground"
                  : answers[i] !== null
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
