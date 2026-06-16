import { useState, useCallback } from 'react';
import { Delete } from 'lucide-react';
import clsx from 'clsx';
import Display from '@/components/Display';
import Button from '@/components/Button';

type ButtonConfig = {
  label: string | React.ReactNode;
  value: string;
  variant: 'number' | 'operator' | 'equal' | 'function' | 'memory';
  span?: number;
};

export default function Calculator() {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForOperand]);

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const percentage = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  const handleOperator = useCallback((nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue !== null && operator && !waitingForOperand) {
      const prev = parseFloat(prevValue);
      let result: number;
      switch (operator) {
        case '+': result = prev + inputValue; break;
        case '-': result = prev - inputValue; break;
        case '×': result = prev * inputValue; break;
        case '÷': result = inputValue !== 0 ? prev / inputValue : 0; break;
        default: result = inputValue;
      }
      const resultStr = String(parseFloat(result.toFixed(10)));
      setDisplay(resultStr);
      setPrevValue(resultStr);
      setExpression(`${resultStr} ${nextOperator}`);
    } else {
      setPrevValue(display);
      setExpression(`${display} ${nextOperator}`);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  }, [display, operator, prevValue, waitingForOperand]);

  const handleEqual = useCallback(() => {
    if (!operator || prevValue === null) return;

    const inputValue = parseFloat(display);
    const prev = parseFloat(prevValue);
    let result: number;

    switch (operator) {
      case '+': result = prev + inputValue; break;
      case '-': result = prev - inputValue; break;
      case '×': result = prev * inputValue; break;
      case '÷': result = inputValue !== 0 ? prev / inputValue : 0; break;
      default: result = inputValue;
    }

    const resultStr = String(parseFloat(result.toFixed(10)));
    const historyEntry = `${prevValue} ${operator} ${display} = ${resultStr}`;

    setHistory(prev => [historyEntry, ...prev.slice(0, 19)]);
    setDisplay(resultStr);
    setExpression(historyEntry);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }, [display, operator, prevValue]);

  const handleSqrt = useCallback(() => {
    const value = parseFloat(display);
    const result = Math.sqrt(value);
    setDisplay(String(parseFloat(result.toFixed(10))));
    setExpression(`√(${display})`);
    setWaitingForOperand(true);
  }, [display]);

  const handleSquare = useCallback(() => {
    const value = parseFloat(display);
    const result = value * value;
    setDisplay(String(parseFloat(result.toFixed(10))));
    setExpression(`(${display})²`);
    setWaitingForOperand(true);
  }, [display]);

  const handleInverse = useCallback(() => {
    const value = parseFloat(display);
    if (value !== 0) {
      const result = 1 / value;
      setDisplay(String(parseFloat(result.toFixed(10))));
      setExpression(`1/(${display})`);
      setWaitingForOperand(true);
    }
  }, [display]);

  const memoryStore = useCallback(() => {
    setMemory(parseFloat(display));
  }, [display]);

  const memoryRecall = useCallback(() => {
    setDisplay(String(memory));
    setWaitingForOperand(false);
  }, [memory]);

  const memoryClear = useCallback(() => {
    setMemory(0);
  }, []);

  const memoryAdd = useCallback(() => {
    setMemory(prev => prev + parseFloat(display));
  }, [display]);

  const handleButton = useCallback((value: string) => {
    switch (value) {
      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        inputDigit(value);
        break;
      case '.':
        inputDecimal();
        break;
      case 'AC':
        clear();
        break;
      case 'CE':
        clearEntry();
        break;
      case '+/-':
        toggleSign();
        break;
      case '%':
        percentage();
        break;
      case 'DEL':
        backspace();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        handleOperator(value);
        break;
      case '=':
        handleEqual();
        break;
      case '√':
        handleSqrt();
        break;
      case 'x²':
        handleSquare();
        break;
      case '1/x':
        handleInverse();
        break;
      case 'MS':
        memoryStore();
        break;
      case 'MR':
        memoryRecall();
        break;
      case 'MC':
        memoryClear();
        break;
      case 'M+':
        memoryAdd();
        break;
    }
  }, [inputDigit, inputDecimal, clear, clearEntry, toggleSign, percentage, backspace,
      handleOperator, handleEqual, handleSqrt, handleSquare, handleInverse,
      memoryStore, memoryRecall, memoryClear, memoryAdd]);

  const buttons: ButtonConfig[][] = [
    [
      { label: 'MC', value: 'MC', variant: 'memory' },
      { label: 'MR', value: 'MR', variant: 'memory' },
      { label: 'MS', value: 'MS', variant: 'memory' },
      { label: 'M+', value: 'M+', variant: 'memory' },
    ],
    [
      { label: '√', value: '√', variant: 'function' },
      { label: 'x²', value: 'x²', variant: 'function' },
      { label: '1/x', value: '1/x', variant: 'function' },
      { label: '%', value: '%', variant: 'function' },
    ],
    [
      { label: 'AC', value: 'AC', variant: 'function' },
      { label: 'CE', value: 'CE', variant: 'function' },
      { label: <Delete size={18} />, value: 'DEL', variant: 'function' },
      { label: '÷', value: '÷', variant: 'operator' },
    ],
    [
      { label: '7', value: '7', variant: 'number' },
      { label: '8', value: '8', variant: 'number' },
      { label: '9', value: '9', variant: 'number' },
      { label: '×', value: '×', variant: 'operator' },
    ],
    [
      { label: '4', value: '4', variant: 'number' },
      { label: '5', value: '5', variant: 'number' },
      { label: '6', value: '6', variant: 'number' },
      { label: '-', value: '-', variant: 'operator' },
    ],
    [
      { label: '1', value: '1', variant: 'number' },
      { label: '2', value: '2', variant: 'number' },
      { label: '3', value: '3', variant: 'number' },
      { label: '+', value: '+', variant: 'operator' },
    ],
    [
      { label: '+/-', value: '+/-', variant: 'function' },
      { label: '0', value: '0', variant: 'number' },
      { label: '.', value: '.', variant: 'number' },
      { label: '=', value: '=', variant: 'equal' },
    ],
  ];

  return (
    <div className="w-full max-w-sm">
      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <span className="text-white font-bold text-lg tracking-widest uppercase opacity-80">Calc</span>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={clsx(
              'text-xs px-3 py-1 rounded-full border transition-all',
              showHistory
                ? 'bg-[#e94560] border-[#e94560] text-white'
                : 'border-[#533483] text-[#a0a0b0] hover:border-[#e94560] hover:text-white'
            )}
          >
            History
          </button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mx-4 mb-2 rounded-xl bg-black/30 border border-white/10 p-3 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-[#a0a0b0] text-xs text-center py-2">No history yet</p>
            ) : (
              <ul className="space-y-1">
                {history.map((entry, i) => (
                  <li key={i} className="text-[#a0a0b0] text-xs font-mono">{entry}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Display */}
        <Display
          display={display}
          expression={expression}
          memory={memory}
        />

        {/* Buttons */}
        <div className="p-4 grid grid-cols-4 gap-3">
          {buttons.flat().map((btn, idx) => (
            <Button
              key={idx}
              label={btn.label}
              variant={btn.variant}
              onClick={() => handleButton(btn.value)}
              span={btn.span}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
