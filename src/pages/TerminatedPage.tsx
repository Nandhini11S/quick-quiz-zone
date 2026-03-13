import { useNavigate } from "react-router-dom";

const TerminatedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center float-in">
        <div className="ece-card p-8 sm:p-12">
          {/* Gradient bar */}
          <div className="h-1 w-full rounded-full mb-8"
            style={{ background: "linear-gradient(90deg, hsl(var(--ece-blue)), hsl(var(--ece-purple)), hsl(var(--ece-teal)))" }}
          />

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
            style={{ background: "linear-gradient(135deg, hsl(var(--ece-teal) / 0.15), hsl(var(--ece-blue) / 0.15))", border: "2px solid hsl(var(--ece-teal) / 0.4)" }}
          >
            ✓
          </div>

          <h2
            className="ece-gradient-text text-xl sm:text-2xl font-bold tracking-widest mb-3"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            SUBMITTED
          </h2>
          <p className="text-muted-foreground text-xs tracking-widest mb-2">
            RESPONSE LOGGED SUCCESSFULLY
          </p>
          <p className="text-muted-foreground text-xs tracking-widest mb-8">
            YOUR RESULTS HAVE BEEN RECORDED
          </p>

          <div className="h-px bg-border mb-8" />

          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <span className="ece-badge">ECE DEPT</span>
            <span className="text-xs text-muted-foreground tracking-widest">SYMPOSIUM TECHNICAL QUIZ</span>
          </div>

          <button
            onClick={() => navigate("/")}
            className="text-xs tracking-widest uppercase px-8 py-3 text-primary-foreground rounded transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, hsl(var(--ece-blue)), hsl(var(--ece-purple)))" }}
          >
            BACK TO HOME
          </button>

          <div className="h-1 w-full rounded-full mt-8"
            style={{ background: "linear-gradient(90deg, hsl(var(--ece-teal)), hsl(var(--ece-blue)), hsl(var(--ece-purple)))" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TerminatedPage;
