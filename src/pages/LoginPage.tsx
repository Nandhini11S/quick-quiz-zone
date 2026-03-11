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

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (step === "email") {
      emailRef.current?.focus();
    }
  }, [step]);

  const handleNameKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!name.trim()) {
        setError("IDENTIFIER REQUIRED.");
        return;
      }
      setError("");
      setStep("email");
    }
  };

  const handleEmailKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  const submit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError("VALID EMAIL REQUIRED.");
      return;
    }
    setError("");
    sessionStorage.setItem("quiz_name", name.trim());
    sessionStorage.setItem("quiz_email", email.trim());
    navigate("/quiz");
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      <div className="w-full max-w-[480px] px-6 space-y-10">
        {/* Prompt line */}
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs tracking-widest uppercase">
            SYMPOSIUM // TECHNICAL ASSESSMENT
          </p>
          <div className="h-px bg-border w-full" />
        </div>

        {/* Name field */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground tracking-widest uppercase block">
            IDENTIFIER
          </label>
          <div className="relative">
            <span className="text-primary mr-2 select-none">›</span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleNameKey}
              placeholder="full name"
              className="terminal-input inline-block w-[calc(100%-1.5rem)]"
              autoComplete="off"
              spellCheck={false}
              disabled={step === "email"}
            />
          </div>
          {step === "name" && name.length > 0 && (
            <p className="text-xs text-muted-foreground ml-4">
              press ENTER to continue
            </p>
          )}
        </div>

        {/* Email field — only appears after name */}
        {step === "email" && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground tracking-widest uppercase block">
              EMAIL
            </label>
            <div className="relative">
              <span className="text-primary mr-2 select-none">›</span>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onKeyDown={handleEmailKey}
                placeholder="student@university.edu"
                className="terminal-input inline-block w-[calc(100%-1.5rem)]"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            {email.length === 0 && (
              <p className="text-xs text-muted-foreground ml-4">
                press ENTER to begin assessment
              </p>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-destructive text-xs tracking-widest">{error}</p>
        )}

        {/* Initiate button */}
        {step === "email" && email.length > 0 && (
          <button
            onClick={submit}
            className="text-xs tracking-widest uppercase border border-border px-6 py-3 text-foreground hover:border-primary hover:text-primary transition-colors duration-100"
          >
            INITIATE ASSESSMENT →
          </button>
        )}

        <div className="h-px bg-border w-full" />
        <p className="text-xs text-muted-foreground tracking-widest">
          20 QUESTIONS · 20 MINUTES · MCQ
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
