export function CurrencyPill() {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold shadow-lg">
      <span aria-hidden className="text-base leading-none">
        🇧🇷
      </span>
      <span>BRL</span>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor">
        <path d="m6 9 6 6 6-6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
