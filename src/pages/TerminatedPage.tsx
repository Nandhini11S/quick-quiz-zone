const TerminatedPage = () => {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      style={{ fontFamily: "'Roboto Mono', monospace" }}
    >
      <p className="text-foreground text-sm tracking-widest text-center px-4">
        [RESPONSE LOGGED. CONNECTION TERMINATED.]
      </p>
    </div>
  );
};

export default TerminatedPage;
