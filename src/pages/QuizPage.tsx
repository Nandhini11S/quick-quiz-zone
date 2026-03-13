import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { QUESTIONS, shuffleQuestions, Question } from "@/data/questions";

// ── EmailJS credentials ─────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_eqq2x4w";
const EMAILJS_TEMPLATE_ID = "template_vt88u8r";
const EMAILJS_PUBLIC_KEY  = "QvCjPoCT5Zq9mpdRf";
// ────────────────────────────────────────────────────────────────────────────

const QUESTION_TIME   = 60;
const TOTAL_QUESTIONS = 20;

const SUBJECT_COLORS: Record<string, string> = {
  "Digital Electronics":     "var(--ece-blue)",
  "Analog Circuits":         "var(--ece-purple)",
  "Signals & Systems":       "var(--ece-teal)",
  "Communications":          "var(--ece-amber)",
  "Electromagnetics":        "var(--ece-pink)",
  "Microprocessors":         "var(--ece-green)",
};

const getSubjectColor = (q: Question) => {
  if (!q.subject) return "var(--primary)";
  for (const key of Object.keys(SUBJECT_COLORS)) {
    if (q.subject?.includes(key)) return SUBJECT_COLORS[key];
  }
  return "var(--primary)";
};

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions]      = useState<Question[]>(() => shuffleQuestions(QUESTIONS));
  const [current, setCurrent]    = useState(0);
  const [answers, setAnswers]    = useState<(number | null)[]>(Array(TOTAL_QUESTIONS).fill(null));
  const [timeLeft, setTimeLeft]  = useState(QUESTION_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [hoverTimer, setHoverTimer] = useState(false);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef  = useRef<(number | null)[]>(Array(TOTAL_QUESTIONS).fill(null));

  const studentName  = sessionStorage.getItem("quiz_name")  || "Unknown";
  const studentEmail = sessionStorage.getItem("quiz_email") || "unknown@email.com";

  useEffect(() => {
    if (!sessionStorage.getItem("quiz_name")) navigate("/");
  }, [navigate]);

  const handleSubmit = useCallback(
    async (auto = false) => {
      if (submitted) return;
      setSubmitted(true);
      clearInterval(timerRef.current!);

      const latestAnswers = answersRef.current;
      const score = latestAnswers.reduce((acc, ans, i) =>
        acc + (ans === questions[i].correct ? 1 : 0), 0);

      const answerDetails = questions
        .map((q, i) => {
          const chosen  = latestAnswers[i] !== null ? q.options[latestAnswers[i]!] : "NOT ANSWERED";
          const correct = q.options[q.correct];
          const status  = latestAnswers[i] === q.correct ? "✓" : "✗";
          return `Q${i + 1}. ${q.question}\n   Selected: ${chosen}\n   Correct : ${correct} ${status}`;
        })
        .join("\n\n");

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          student_name:  studentName,
          student_email: studentEmail,
          submitted_at:  new Date().toLocaleString(),
          score:         `${score} / ${TOTAL_QUESTIONS}`,
          auto_submit:   auto ? "YES (time expired)" : "NO (manual submit)",
          answers:       answerDetails,
        }, EMAILJS_PUBLIC_KEY);
      } catch (err) {
        console.error("EmailJS error:", err);
      }

      navigate("/terminated");
    },
    [submitted, questions, studentName, studentEmail, navigate]
  );

  // Per-question countdown
  useEffect(() => {
    if (submitted) return;
    setTimeLeft(QUESTION_TIME);
    clearInterval(timerRef.current!);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (current < TOTAL_QUESTIONS - 1) setCurrent((c) => c + 1);
          else handleSubmit(true);
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

  const goNext = () => { if (current < TOTAL_QUESTIONS - 1) setCurrent((c) => c + 1); };
  const goPrev = () => { if (current > 0) setCurrent((c) => c - 1); };

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

  const pct      = (timeLeft / QUESTION_TIME) * 100;
  const secs     = String(timeLeft).padStart(2, "0");
  const answered = answers.filter((a) => a !== null).length;
  const q        = questions[current];
  const subColor = getSubjectColor(q);

  const timerBarClass =
    timeLeft <= 10 ? "timer-danger" :
    timeLeft <= 20 ? "timer-warning" : "";

  const timerTextColor =
    timeLeft <= 10 ? "hsl(var(--ece-red))" :
    timeLeft <= 20 ? "hsl(var(--ece-amber))" : "hsl(var(--primary))";

  return (
    <div className="min-h-screen bg-background scan-overlay flex flex-col">

      {/* ── Top timer bar ── */}
      <div
        className="fixed top-0 left-0 w-full z-50"
        onMouseEnter={() => setHoverTimer(true)}
        onMouseLeave={() => setHoverTimer(false)}
      >
        <div className="h-[4px] bg-muted w-full relative">
          <div
            className={`absolute left-0 top-0 h-full transition-none ${timerBarClass}`}
            style={{
              width: `${pct}%`,
              background: timerBarClass ? undefined : "linear-gradient(90deg, hsl(var(--ece-blue)), hsl(var(--ece-purple)))",
              boxShadow: timerBarClass ? undefined : "0 0 8px hsl(var(--primary) / 0.4)",
            }}
          />
        </div>
        {hoverTimer && (
          <div
            className="absolute top-3 right-4 bg-card border px-3 py-1 text-xs tracking-widest rounded shadow-lg"
            style={{ borderColor: `hsl(${subColor} / 0.4)`, color: timerTextColor }}
          >
            {secs}s REMAINING
          </div>
        )}
      </div>

      {/* ── Main layout ── */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 sm:px-6 pt-8 pb-8">

        {/* ── Top header ── */}
        <div className="flex items-center justify-between mb-5 pt-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="ece-badge">ECE DEPT</span>
            <span className="text-xs text-muted-foreground tracking-widest truncate max-w-[140px] sm:max-w-none">
              {studentName.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-muted-foreground tracking-widest">
              {answered}/{TOTAL_QUESTIONS} DONE
            </span>
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold tracking-widest tabular-nums border"
              style={{
                color: timerTextColor,
                borderColor: `${timerTextColor}44`,
                background: `${timerTextColor}10`,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              ⏱ {secs}s
            </div>
          </div>
        </div>

        {/* ── Question card ── */}
        <div className="ece-card p-5 sm:p-7 flex-1 flex flex-col">

          {/* Question header */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded tracking-widest"
                style={{
                  color: `hsl(${subColor})`,
                  background: `hsl(${subColor} / 0.1)`,
                  border: `1.5px solid hsl(${subColor} / 0.35)`,
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                Q{String(current + 1).padStart(2, "0")} / {TOTAL_QUESTIONS}
              </span>
              {q.subject && (
                <span className="text-xs text-muted-foreground tracking-wide hidden sm:inline">
                  {q.subject}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground tracking-widest hidden sm:inline">
              SYMPOSIUM TECHNICAL QUIZ
            </span>
          </div>

          {/* Colour divider */}
          <div
            className="h-[2px] w-full rounded-full mb-5"
            style={{ background: `linear-gradient(90deg, hsl(${subColor}), transparent)` }}
          />

          {/* Question text */}
          <div className="mb-6 min-h-[60px]">
            <p className="text-foreground text-sm sm:text-base leading-relaxed tracking-wide">
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((opt, i) => {
              const isSelected = answers[current] === i;
              return (
                <div
                  key={i}
                  onClick={() => selectAnswer(i)}
                  className={`quiz-option flex items-start gap-3${isSelected ? " selected" : ""}`}
                >
                  <span
                    className="text-xs tracking-widest shrink-0 pt-0.5 w-6 text-center font-bold rounded"
                    style={isSelected
                      ? { color: `hsl(${subColor})`, background: `hsl(${subColor} / 0.12)` }
                      : { color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed">{opt}</span>
                  {isSelected && (
                    <span className="ml-auto shrink-0 text-xs" style={{ color: `hsl(${subColor})` }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-auto gap-3">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="text-xs tracking-widest uppercase border px-4 py-2.5 sm:px-5 text-foreground hover:border-primary hover:text-primary transition-colors rounded disabled:opacity-25 disabled:cursor-not-allowed"
            >
              ← PREV
            </button>

            <span className="text-xs text-muted-foreground tracking-widest hidden sm:inline">
              ← → ARROW KEYS
            </span>

            {current < TOTAL_QUESTIONS - 1 ? (
              <button
                onClick={goNext}
                className="text-xs tracking-widest uppercase px-4 py-2.5 sm:px-5 text-primary-foreground rounded transition-all hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, hsl(var(--ece-blue)), hsl(var(--ece-purple)))` }}
              >
                NEXT →
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                className="text-xs tracking-widest uppercase px-4 py-2.5 sm:px-5 text-primary-foreground rounded transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--ece-teal)), hsl(var(--ece-blue)))",
                  boxShadow: "0 4px 16px hsl(var(--ece-teal) / 0.4)",
                }}
              >
                SUBMIT ✓
              </button>
            )}
          </div>
        </div>

        {/* ── Question dot-map ── */}
        <div className="mt-5 ece-card p-3 sm:p-4">
          <p className="text-[10px] tracking-widest text-muted-foreground mb-3 uppercase">Progress Map</p>
          <div className="flex flex-wrap gap-1.5 justify-start">
            {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-7 h-7 sm:w-8 sm:h-8 text-[10px] sm:text-xs flex items-center justify-center border-2 rounded font-bold transition-all duration-100 hover:scale-110 ${
                  i === current
                    ? "dot-current shadow-md"
                    : answers[i] !== null
                    ? "dot-answered"
                    : "dot-unanswered hover:border-primary/40"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {[
              { cls: "dot-current",   label: "Current" },
              { cls: "dot-answered",  label: "Answered" },
              { cls: "dot-unanswered",label: "Skipped" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-3.5 h-3.5 rounded border-2 ${l.cls}`} />
                <span className="text-[10px] text-muted-foreground tracking-wider">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuizPage;
