import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export default function Calendar({
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push(new Date(year, month, i));
  }

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="w-[260px] p-2 text-white">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="cursor-pointer rounded-lg p-1 text-white/80 transition-all hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-amber-200">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={handleNextMonth}
          className="cursor-pointer rounded-lg p-1 text-white/80 transition-all hover:bg-white/10 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-white/40">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="w-8">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {daysArray.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="h-8 w-8" />;
          }

          const selected = isSelected(date);
          const today = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs transition-all ${
                selected
                  ? "bg-amber-300 font-bold text-slate-900 shadow-lg hover:bg-amber-400"
                  : today
                    ? "border border-amber-300/35 text-amber-100 hover:bg-white/10"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
