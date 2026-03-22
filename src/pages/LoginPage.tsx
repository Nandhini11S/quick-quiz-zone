import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

/* ── Signal wave + circuit pulse background ── */
const AnimatedBg = () => (
  
  <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    
    {/* gradient base */}
    <div className="absolute inset-0" style={{
      background: "linear-gradient(135deg, hsl(220 40% 96%) 0%, hsl(270 35% 94%) 45%, hsl(175 40% 93%) 100%)"
    }} />

    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* glow filters */}
        <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* clip for pulse travelling along path */}
        <clipPath id="clip-sin1"><rect x="0" y="0" width="1000" height="600"/></clipPath>
      </defs>

      {/* ── SINE WAVE 1 (blue) ── */}
      <path d="M-200,120 C-150,80 -100,160 -50,120 C0,80 50,160 100,120 C150,80 200,160 250,120 C300,80 350,160 400,120 C450,80 500,160 550,120 C600,80 650,160 700,120 C750,80 800,160 850,120 C900,80 950,160 1000,120 C1050,80 1100,160 1150,120 C1200,80 1250,160 1300,120"
        fill="none" stroke="hsl(220 90% 52%)" strokeWidth="2" strokeOpacity="0.25" filter="url(#glow-blue)">
        <animateTransform attributeName="transform" type="translate" from="-300,0" to="300,0"
          dur="12s" repeatCount="indefinite"/>
      </path>
      {/* bright pulse dot on sine wave 1 */}
      <circle r="5" fill="hsl(220 90% 52%)" opacity="0.9" filter="url(#glow-blue)">
        <animateMotion dur="5s" repeatCount="indefinite"
          path="M-200,120 C-150,80 -100,160 -50,120 C0,80 50,160 100,120 C150,80 200,160 250,120 C300,80 350,160 400,120 C450,80 500,160 550,120 C600,80 650,160 700,120 C750,80 800,160 850,120 C900,80 950,160 1000,120"/>
      </circle>

      {/* ── SINE WAVE 2 (purple, offset) ── */}
      <path d="M-300,220 C-240,175 -180,265 -120,220 C-60,175 0,265 60,220 C120,175 180,265 240,220 C300,175 360,265 420,220 C480,175 540,265 600,220 C660,175 720,265 780,220 C840,175 900,265 960,220 C1020,175 1080,265 1140,220 C1200,175 1260,265 1320,220"
        fill="none" stroke="hsl(270 70% 55%)" strokeWidth="2" strokeOpacity="0.2" filter="url(#glow-purple)">
        <animateTransform attributeName="transform" type="translate" from="300,0" to="-300,0"
          dur="7s" repeatCount="indefinite"/>
      </path>
      <circle r="4.5" fill="hsl(270 70% 55%)" opacity="0.85" filter="url(#glow-purple)">
        <animateMotion dur="7s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear"
          path="M-300,220 C-240,175 -180,265 -120,220 C-60,175 0,265 60,220 C120,175 180,265 240,220 C300,175 360,265 420,220 C480,175 540,265 600,220 C660,175 720,265 780,220 C840,175 900,265 960,220 C1020,175 1080,265 1140,220"/>
      </circle>

      {/* ── SINE WAVE 3 (teal) ── */}
      <path d="M-100,360 C-40,310 20,410 80,360 C140,310 200,410 260,360 C320,310 380,410 440,360 C500,310 560,410 620,360 C680,310 740,410 800,360 C860,310 920,410 980,360 C1040,310 1100,410 1160,360"
        fill="none" stroke="hsl(175 80% 40%)" strokeWidth="1.8" strokeOpacity="0.22" filter="url(#glow-teal)">
        <animateTransform attributeName="transform" type="translate" from="-200,0" to="200,0"
          dur="4s" repeatCount="indefinite"/>
      </path>
      <circle r="4" fill="hsl(175 80% 40%)" opacity="0.85" filter="url(#glow-teal)">
        <animateMotion dur="4s" repeatCount="indefinite"
          path="M-100,360 C-40,310 20,410 80,360 C140,310 200,410 260,360 C320,310 380,410 440,360 C500,310 560,410 620,360 C680,310 740,410 800,360 C860,310 920,410 980,360 C1040,310 1100,410 1160,360"/>
      </circle>

      {/* ── SQUARE WAVE (pink, bottom) ── */}
      <path d="M0,490 L0,490 L0,450 L80,450 L80,490 L160,490 L160,450 L240,450 L240,490 L320,490 L320,450 L400,450 L400,490 L480,490 L480,450 L560,450 L560,490 L640,490 L640,450 L720,450 L720,490 L800,490 L800,450 L880,450 L880,490 L960,490 L960,450 L1040,450 L1040,490"
        fill="none" stroke="hsl(320 80% 55%)" strokeWidth="1.8" strokeOpacity="0.18" filter="url(#glow-purple)">
        <animateTransform attributeName="transform" type="translate" from="-160,0" to="160,0"
          dur="3.5s" repeatCount="indefinite"/>
      </path>
      <circle r="4" fill="hsl(320 80% 55%)" opacity="0.8" filter="url(#glow-purple)">
        <animateMotion dur="3.5s" repeatCount="indefinite"
          path="M0,490 L0,490 L0,450 L80,450 L80,490 L160,490 L160,450 L240,450 L240,490 L320,490 L320,450 L400,450 L400,490 L480,490 L480,450 L560,450 L560,490 L640,490 L640,450 L720,450 L720,490 L800,490 L800,450 L880,450 L880,490 L960,490"/>
      </circle>

      {/* ── SAWTOOTH WAVE (amber, top) ── */}
      <path d="M0,60 L80,30 L80,60 L160,30 L160,60 L240,30 L240,60 L320,30 L320,60 L400,30 L400,60 L480,30 L480,60 L560,30 L560,60 L640,30 L640,60 L720,30 L720,60 L800,30 L800,60 L880,30 L880,60 L960,30 L960,60 L1040,30 L1040,60"
        fill="none" stroke="hsl(38 100% 50%)" strokeWidth="1.5" strokeOpacity="0.2">
        <animateTransform attributeName="transform" type="translate" from="0,0" to="160,0"
          dur="2.8s" repeatCount="indefinite"/>
      </path>
      <circle r="3.5" fill="hsl(38 100% 50%)" opacity="0.75">
        <animateMotion dur="2.8s" repeatCount="indefinite"
          path="M0,60 L80,30 L80,60 L160,30 L160,60 L240,30 L240,60 L320,30 L320,60 L400,30 L400,60 L480,30 L480,60 L560,30 L560,60 L640,30 L640,60 L720,30 L720,60 L800,30 L800,60 L880,30 L880,60 L960,30 L960,60"/>
      </circle>

      {/* ── HORIZONTAL circuit traces ── */}
      {[160, 310, 440, 530].map((y, i) => (
        <g key={y}>
          <line x1="0" y1={y} x2="1000" y2={y}
            stroke={["hsl(220 90% 52%)","hsl(270 70% 55%)","hsl(175 80% 40%)","hsl(220 90% 52%)"][i]}
            strokeWidth="0.5" strokeOpacity="0.12" strokeDasharray="8 16"/>
          {/* travelling pulse along trace */}
          <circle r="3" fill={["hsl(220 90% 52%)","hsl(270 70% 55%)","hsl(175 80% 40%)","hsl(320 80% 55%)"][i]} opacity="0.7"
            filter={["url(#glow-blue)","url(#glow-purple)","url(#glow-teal)","url(#glow-purple)"][i]}>
            <animateMotion dur={`${3 + i * 1.2}s`} begin={`${i * 0.8}s`} repeatCount="indefinite"
              path={`M0,${y} L1000,${y}`}/>
            <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${3 + i * 1.2}s`} begin={`${i * 0.8}s`} repeatCount="indefinite"/>
          </circle>
        </g>
      ))}

      {/* ── vertical circuit traces ── */}
      {[80, 260, 500, 740, 920].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="0" x2={x} y2="600"
            stroke="hsl(220 90% 52%)" strokeWidth="0.4" strokeOpacity="0.1" strokeDasharray="6 20"/>
          <circle r="2.5" fill={["hsl(175 80% 40%)","hsl(270 70% 55%)","hsl(220 90% 52%)","hsl(320 80% 55%)","hsl(38 100% 50%)"][i]}
            opacity="0.65">
            <animateMotion dur={`${4 + i}s`} begin={`${i * 0.5}s`} repeatCount="indefinite"
              path={`M${x},0 L${x},600`}/>
            <animate attributeName="opacity" values="0;0.7;0.7;0" dur={`${4 + i}s`} begin={`${i * 0.5}s`} repeatCount="indefinite"/>
          </circle>
        </g>
      ))}

      {/* ── circuit junction nodes ── */}
      {[[80,160],[260,310],[500,440],[740,310],[920,160],[500,530],[80,530],[920,530]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="6"
            fill={["hsl(220 90% 52%)","hsl(270 70% 55%)","hsl(175 80% 40%)","hsl(320 80% 55%)","hsl(38 100% 50%)","hsl(270 70% 55%)","hsl(175 80% 40%)","hsl(220 90% 52%)"][i]}
            opacity="0" filter="url(#glow-blue)">
            <animate attributeName="opacity" values="0;0.5;0.1;0.6;0" dur={`${4+i*0.9}s`} begin={`${i*0.7}s`} repeatCount="indefinite"/>
            <animate attributeName="r" values="4;10;4" dur={`${4+i*0.9}s`} begin={`${i*0.7}s`} repeatCount="indefinite"/>
          </circle>
          <circle cx={x} cy={y} r="3"
            fill={["hsl(220 90% 52%)","hsl(270 70% 55%)","hsl(175 80% 40%)","hsl(320 80% 55%)","hsl(38 100% 50%)","hsl(270 70% 55%)","hsl(175 80% 40%)","hsl(220 90% 52%)"][i]}
            opacity="0">
            <animate attributeName="opacity" values="0;0.9;0.4;0.9;0" dur={`${4+i*0.9}s`} begin={`${i*0.7}s`} repeatCount="indefinite"/>
          </circle>
        </g>
      ))}
    </svg>

    {/* subtle vignette overlay */}
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse at center, transparent 50%, hsl(220 30% 90% / 0.4) 100%)"
    }}/>
    {/* <div className="absolute inset-0 backdrop-blur-[2px]" /> */}
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
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10 relative">
      <AnimatedBg />

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto float-in relative" style={{ zIndex: 1 }}>
        {/* Header card */}
        <div className="ece-card p-4 sm:p-6 md:p-8 mb-4 sm:mb-6"
          style={{ backdropFilter: "blur(16px)", background: "hsl(0 0% 100% / 0.88)" }}>
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
            <h1 className="ece-gradient-text text-xl sm:text-2xl font-bold tracking-wider  md:text-3xl mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif" }}>
              Mind Blitz
            </h1>
            <p className="text-muted-foreground text-xs tracking-widest">
              ELECTRONICS & COMMUNICATION ENGINEERING
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
            {[
              { label: "QUESTIONS", value: "20", color: "var(--ece-blue)" },
              { label: "MINUTES",   value: "20", color: "var(--ece-purple)" },
              { label: "FORMAT",    value: "MCQ", color: "var(--ece-teal)" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded border"
                style={{ borderColor: `hsl(${s.color} / 0.3)`, background: `hsl(${s.color} / 0.06)` }}>
                <p className="text-lg font-bold"
                  style={{ color: `hsl(${s.color})`, fontFamily: "'Orbitron', sans-serif" }}>{s.value}</p>
                <p className="text-[10px] tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Name field */}
          <div className="space-y-2 mb-5">
            <label className="text-xs text-muted-foreground tracking-widest uppercase block font-semibold">FULL NAME</label>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg select-none">›</span>
              <input ref={nameRef} type="text" value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleNameKey}
                placeholder="Enter your full name"
                className="terminal-input"
                autoComplete="off" spellCheck={false}
                disabled={step === "email"}/>
            </div>
            {step === "name" && name.length > 0 && (
              <p className="text-xs text-muted-foreground ml-5 tracking-wider">↵ press ENTER to continue</p>
            )}
          </div>

          {/* Email field */}
          {step === "email" && (
            <div className="space-y-2 mb-5 float-in">
              <label className="text-xs text-muted-foreground tracking-widest uppercase block font-semibold">EMAIL ADDRESS</label>
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-lg select-none">›</span>
                <input ref={emailRef} type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={handleEmailKey}
                  placeholder="student@university.edu"
                  className="terminal-input"
                  autoComplete="off" spellCheck={false}/>
              </div>
              {email.length === 0 && (
                <p className="text-xs text-muted-foreground ml-5 tracking-wider">↵ press ENTER to begin</p>
              )}
            </div>
          )}

          {error && (
            <p className="text-destructive text-xs tracking-widest mb-4 ml-1">⚠ {error}</p>
          )}

          {step === "email" && email.length > 0 && (
            <button onClick={submit}
              className="w-full py-3 text-sm tracking-widest uppercase font-bold text-primary-foreground rounded transition-all duration-200 active:scale-95 float-in"
              style={{
                background: "linear-gradient(135deg, hsl(var(--ece-blue)), hsl(var(--ece-purple)))",
                boxShadow: "0 4px 16px hsl(var(--ece-blue) / 0.35)",
              }}>
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
