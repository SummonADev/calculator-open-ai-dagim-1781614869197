import clsx from 'clsx';
import { ReactNode } from 'react';

type ButtonProps = {
  label: ReactNode;
  variant: 'number' | 'operator' | 'equal' | 'function' | 'memory';
  onClick: () => void;
  span?: number;
};

const variantStyles: Record<string, string> = {
  number:
    'bg-white/10 hover:bg-white/20 text-white border border-white/5 hover:border-white/20',
  operator:
    'bg-[#533483]/80 hover:bg-[#533483] text-white border border-[#533483]/50 hover:border-[#533483]',
  equal:
    'bg-[#e94560] hover:bg-[#ff6b81] text-white border border-[#e94560]/50 shadow-lg shadow-[#e94560]/30',
  function:
    'bg-[#0f3460]/80 hover:bg-[#0f3460] text-[#eaeaea] border border-white/10 hover:border-white/20',
  memory:
    'bg-transparent hover:bg-white/5 text-[#a0a0b0] hover:text-white border border-white/10 hover:border-white/20 text-xs',
};

export default function Button({ label, variant, onClick, span }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center rounded-2xl h-14 text-lg font-semibold',
        'transition-all duration-150 active:scale-95 select-none cursor-pointer',
        span === 2 ? 'col-span-2' : 'col-span-1',
        variantStyles[variant]
      )}
    >
      {label}
    </button>
  );
}
