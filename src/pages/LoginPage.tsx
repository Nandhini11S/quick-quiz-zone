import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md float-in">

        {/* Header card */}
        <div className="ece-card p-6 sm:p-8 mb-6">
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
