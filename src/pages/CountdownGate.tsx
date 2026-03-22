import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TARGET_DATE = new Date("2026-03-24T12:05:00");

const CountdownGate = () => {
  const [timeLeft, setTimeLeft] = useState<number>(
    TARGET_DATE.getTime() - new Date().getTime()
  );

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = TARGET_DATE.getTime() - new Date().getTime();

      if (diff <= 0) {
        clearInterval(timer);
        navigate("/quiz");
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const format = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);

    return `${h}h ${m % 60}m ${s % 60}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div className="ece-card p-8">
        <h2 className="text-xl font-bold mb-4">QUIZ STARTS IN</h2>
        <p className="text-2xl">{format(timeLeft)}</p>
      </div>
    </div>
  );
};

export default CountdownGate;