import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

/* ── animated circuit-board particles ── */
const NODES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: 3 + Math.random() * 4,
  dur: 6 + Math.random() * 10,
  delay: Math.random() * 8,
  color: ["var(--ece-blue)", "var(--ece-purple)", "var(--ece-teal)", "var(--ece-pink)"][i % 4],
}));

const LINES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x1: Math.random() * 100,
  y1: Math.random() * 100,
  x2: Math.random() * 100,
  y2: Math.random() * 100,
  dur: 4 + Math.random() * 8,
  delay: Math.random() * 6,
  color: ["var(--ece-blue)", "var(--ece-purple)", "var(--ece-teal)"][i % 3],
}));

const PULSES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  cx: 10 + i * 15,
  cy: 20 + (i % 3) * 25,
  dur: 3 + i * 0.7,
  delay: i * 0.9,
  color: ["var(--ece-blue)", "var(--ece-purple)", "var(--ece-teal)"][i % 3],
}));

const AnimatedBg = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    {/* gradient base */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, hsl(220 30% 97%) 0%, hsl(270 40% 95%) 40%, hsl(175 40% 94%) 100%)",
      }}
    />

    {/* SVG canvas */}
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {NODES.map((n) => (
          <radialGradient key={`rg-${n.id}`} id={`rg-${n.id}`}>
            <stop offset="0%" stopColor={`hsl(${n.color})`} stopOpacity="0.8" />
            <stop offset="100%" stopColor={`hsl(${n.color})`} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* drifting trace lines */}
      {LINES.map((l) => (
        <line
          key={l.id}
          x1={`${l.x1}%`} y1={`${l.y1}%`}
          x2={`${l.x2}%`} y2={`${l.y2}%`}
          stroke={`hsl(${l.color})`}
          strokeWidth="0.15"
          strokeOpacity="0"
          strokeLinecap="round"
        >
          <animate
            attributeName="stroke-opacity"
            values="0;0.35;0.1;0.45;0"
            dur={`${l.dur}s`}
            begin={`${l.delay}s`}
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 1.5,-1; -1,1.5; 0,0"
            dur={`${l.dur * 1.5}s`}
            begin={`${l.delay}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}

      {/* circuit nodes */}
      {NODES.map((n) => (
        <g key={n.id}>
          {/* glow halo */}
          <circle
            cx={`${n.x}%`} cy={`${n.y}%`}
            r={n.r * 1.8}
            fill={`url(#rg-${n.id})`}
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              dur={`${n.dur}s`}
              begin={`${n.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${n.r};${n.r * 2.5};${n.r}`}
              dur={`${n.dur}s`}
              begin={`${n.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
          {/* solid dot */}
          <circle
            cx={`${n.x}%`} cy={`${n.y}%`}
            r={n.r * 0.35}
            fill={`hsl(${n.color})`}
            opacity="0"
          >
            <animate
              attributeName="opacity"
              values="0;0.9;0.3;0.9;0"
              dur={`${n.dur}s`}
              begin={`${n.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* electric pulse rings */}
      {PULSES.map((p) => (
        <circle
          key={p.id}
          cx={`${p.cx}%`} cy={`${p.cy}%`}
          r="1"
          fill="none"
          stroke={`hsl(${p.color})`}
          strokeWidth="0.2"
          opacity="0"
        >
          <animate
            attributeName="r"
            values="1;8;14"
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;0.2;0"
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>

    {/* floating geometric chips */}
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute border rounded-sm opacity-0"
        style={{
          width: 12 + i * 8,
          height: 8 + i * 5,
          left: `${8 + i * 11}%`,
          top: `${10 + (i % 4) * 22}%`,
          borderColor: `hsl(var(--${["ece-blue","ece-purple","ece-teal","ece-pink"][i%4]}) / 0.25)`,
          background: `hsl(var(--${["ece-blue","ece-purple","ece-teal","ece-pink"][i%4]}) / 0.04)`,
          animation: `chipFloat ${5 + i}s ease-in-out ${i * 0.7}s infinite`,
        }}
      />
    ))}

    {/* diagonal scan sweep */}
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, transparent 40%, hsl(var(--ece-blue) / 0.03) 50%, transparent 60%)",
        backgroundSize: "200% 200%",
        animation: "diagonalSweep 6s ease-in-out infinite",
      }}
    />
  </div>
);

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"name" | "email">("name");
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => { nameRef.current?.focus(); }, []);
  useEffect(() => { if (step === "email") emailRef.current?.focus(); }, [step]);

  const handleNameKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!name.trim()) { setError("IDENTIFIER REQUIRED."); return; }
      setError(""); setStep("email");
    }
  };

  const handleEmailKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submit();
  };

  const submit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) { setError("VALID EMAIL REQUIRED."); return; }
    setError("");
    sessionStorage.setItem("quiz_name", name.trim());
    sessionStorage.setItem("quiz_email", email.trim());
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      <AnimatedBg />

      <style>{`
        @keyframes chipFloat {
          0%, 100% { opacity: 0.4; transform: translateY(0px) rotate(0deg); }
          50%       { opacity: 0.7; transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes diagonalSweep {
          0%, 100% { background-position: 0% 0%; }
          50%       { background-position: 100% 100%; }
        }
      `}</style>

      <div className="w-full max-w-md float-in relative" style={{ zIndex: 1 }}>

        {/* Header card */}
        <div className="ece-card p-6 sm:p-8 mb-6" style={{ backdropFilter: "blur(12px)", background: "hsl(0 0% 100% / 0.88)" }}>
          {/* Top accent bar */}
          <div className="h-1 w-full rounded-full mb-6"
            style={{ background: "linear-gradient(90deg, hsl(var(--ece-blue)), hsl(var(--ece-purple)), hsl(var(--ece-teal)))" }}
          />

          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="ece-badge">ECE DEPT</span>
              <span className="ece-badge" style={{ background: "hsl(var(--ece-purple) / 0.1)", borderColor: "hsl(var(--ece-purple) / 0.5)", color: "hsl(var(--ece-purple))" }}>
                SYMPOSIUM
              </span>
            </div>
            <h1
              className="ece-gradient-text text-2xl sm:text-3xl font-bold tracking-wider mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              TECHNICAL QUIZ
            </h1>
            <p className="text-muted-foreground text-xs tracking-widest">
              ELECTRONICS & COMMUNICATION ENGINEERING
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "QUESTIONS", value: "20", color: "var(--ece-blue)" },
              { label: "MINUTES",   value: "20", color: "var(--ece-purple)" },
              { label: "FORMAT",    value: "MCQ", color: "var(--ece-teal)" },
            ].map((s) => (
              <div key={s.label}
                className="text-center p-3 rounded border"
                style={{ borderColor: `hsl(${s.color} / 0.3)`, background: `hsl(${s.color} / 0.06)` }}
              >
                <p className="text-lg font-bold" style={{ color: `hsl(${s.color})`, fontFamily: "'Orbitron', sans-serif" }}>{s.value}</p>
                <p className="text-[10px] tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Name field */}
          <div className="space-y-2 mb-5">
            <label className="text-xs text-muted-foreground tracking-widest uppercase block font-semibold">
              FULL NAME
            </label>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg select-none">›</span>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNameKey}
                placeholder="Enter your full name"
                className="terminal-input"
                autoComplete="off"
                spellCheck={false}
                disabled={step === "email"}
              />
            </div>
            {step === "name" && name.length > 0 && (
              <p className="text-xs text-muted-foreground ml-5 tracking-wider">
                ↵ press ENTER to continue
              </p>
            )}
          </div>

          {/* Email field */}
          {step === "email" && (
            <div className="space-y-2 mb-5 float-in">
              <label className="text-xs text-muted-foreground tracking-widest uppercase block font-semibold">
                EMAIL ADDRESS
              </label>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-lg select-none">›</span>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={handleEmailKey}
                  placeholder="student@university.edu"
                  className="terminal-input"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              {email.length === 0 && (
                <p className="text-xs text-muted-foreground ml-5 tracking-wider">
                  ↵ press ENTER to begin
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-destructive text-xs tracking-widest mb-4 ml-1">⚠ {error}</p>
          )}

          {/* Submit button */}
          {step === "email" && email.length > 0 && (
            <button
              onClick={submit}
              className="w-full py-3 text-sm tracking-widest uppercase font-bold text-primary-foreground rounded transition-all duration-200 active:scale-95 float-in"
              style={{
                background: "linear-gradient(135deg, hsl(var(--ece-blue)), hsl(var(--ece-purple)))",
                boxShadow: "0 4px 16px hsl(var(--ece-blue) / 0.35)",
              }}
            >
              BEGIN ASSESSMENT →
            </button>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground tracking-widest">
          1 MINUTE PER QUESTION · AUTO-SUBMIT ON TIMEOUT
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
