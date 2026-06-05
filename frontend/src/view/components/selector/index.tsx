import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface SelectorProps {
  icon?: React.ReactNode;
  text: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}

export default function Selector({ icon, text, children }: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeDropdown = () => setIsOpen(false);

  return (
    <div className={`relative ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 focus:ring-2 focus:ring-amber-300/50 focus:outline-none active:scale-95"
      >
        {icon}
        <span>{text}</span>
        <ChevronDown
          className={`h-4 w-4 text-white/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 z-90 mt-2 min-w-56 origin-top-left rounded-xl border border-white/10 bg-slate-900/90 p-1.5 shadow-2xl backdrop-blur-xl duration-150">
          {typeof children === "function"
            ? (children as (close: () => void) => React.ReactNode)(
                closeDropdown,
              )
            : children}
        </div>
      )}
    </div>
  );
}
