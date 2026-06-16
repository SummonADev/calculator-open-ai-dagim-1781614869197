type DisplayProps = {
  display: string;
  expression: string;
  memory: number;
};

export default function Display({ display, expression, memory }: DisplayProps) {
  const fontSize =
    display.length > 12 ? 'text-2xl' :
    display.length > 9  ? 'text-3xl' :
    display.length > 6  ? 'text-4xl' : 'text-5xl';

  return (
    <div className="px-6 py-4">
      {/* Memory indicator */}
      <div className="flex justify-end mb-1">
        {memory !== 0 && (
          <span className="text-xs text-[#e94560] font-semibold tracking-widest">M = {memory}</span>
        )}
      </div>

      {/* Expression */}
      <div className="min-h-6 text-right">
        <span className="text-[#a0a0b0] text-sm font-mono truncate block">
          {expression || '\u00A0'}
        </span>
      </div>

      {/* Main display */}
      <div className="mt-1 text-right">
        <span
          className={`${fontSize} font-bold text-white font-mono tracking-tight break-all`}
        >
          {display}
        </span>
      </div>

      {/* Divider */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-[#533483] to-transparent" />
    </div>
  );
}
