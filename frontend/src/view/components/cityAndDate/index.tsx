import Selector from "@/view/components/selector";
import Calendar from "@/view/components/calendar";
import { MapPin, Calendar as CalendarIcon, Check, Clock } from "lucide-react";
import { MOCK_CITIES } from "@/app/constants/mockWeather";

interface Station {
  key: string;
  name: string;
  station: string;
  country: string;
}

interface CityAndDateProps {
  selectedCityKey: string;
  onSelectCity: (cityKey: string) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  minHour: string;
  onSelectMinHour: (hour: string) => void;
  maxHour: string;
  onSelectMaxHour: (hour: string) => void;
  stations: Station[];
}

export default function CityAndDate({
  selectedCityKey,
  onSelectCity,
  selectedDate,
  onSelectDate,
  minHour,
  onSelectMinHour,
  maxHour,
  onSelectMaxHour,
  stations,
}: CityAndDateProps) {
  const selectedCity =
    MOCK_CITIES[selectedCityKey] || MOCK_CITIES.itajuba_unifei;

  const activeStation = stations.find((s) => s.key === selectedCityKey) || {
    name: selectedCity.name,
    station: selectedCity.station,
    country: selectedCity.country,
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const hourlyData = selectedCity.hourly || [];
  const defaultHourly = [
    { time: "00:00" },
    { time: "03:00" },
    { time: "06:00" },
    { time: "09:00" },
    { time: "12:00" },
    { time: "15:00" },
    { time: "18:00" },
    { time: "21:00" },
  ];
  const activeHourly = hourlyData.length > 0 ? hourlyData : defaultHourly;

  const rawHours = activeHourly.map((h) => h.time);
  if (!rawHours.includes("00:00")) rawHours.push("00:00");
  if (!rawHours.includes("23:00")) rawHours.push("23:00");
  const availableHours = Array.from(new Set(rawHours)).sort();

  // Filtra as horas iniciai
  const minHourOptions = availableHours.filter((h) => h < maxHour);
  // Filtra as horas finais
  const maxHourOptions = availableHours.filter((h) => h > minHour);

  return (
    <div className="relative z-20 flex w-full flex-col items-center justify-center gap-6 rounded-2xl border border-white/10 bg-slate-900/40 p-4 shadow-lg backdrop-blur-md md:flex-row md:items-center md:justify-evenly">
      <div className="flex flex-col items-start gap-2.5">
        <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
          Cidade
        </span>
        <Selector
          icon={<MapPin className="h-4 w-4 animate-pulse text-amber-300" />}
          text={`${activeStation.name} - ${activeStation.station}`}
        >
          {(close) => (
            <div>
              <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-white/40 uppercase">
                Selecione uma cidade
              </div>
              <div className="my-1 h-px bg-white/5" />
              <div className="max-h-60 overflow-y-auto">
                {stations.map((city) => (
                  <button
                    key={city.key}
                    onClick={() => {
                      onSelectCity(city.key);
                      close();
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-white/10 ${
                      selectedCityKey === city.key
                        ? "bg-amber-300/10 font-medium text-amber-200"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>
                        {city.name} - {city.station}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {city.country}
                      </span>
                    </div>
                    {selectedCityKey === city.key && (
                      <Check className="h-4 w-4 text-amber-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Selector>
      </div>

      <div className="hidden h-12 w-px bg-white/10 md:block" />
      <div className="block h-px w-full bg-white/10 md:hidden" />

      <div className="flex flex-col items-start gap-2.5">
        <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
          Data
        </span>
        <Selector
          icon={<CalendarIcon className="h-4 w-4 text-amber-300" />}
          text={formatDate(selectedDate)}
        >
          {(close) => (
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                onSelectDate(date);
                close();
              }}
            />
          )}
        </Selector>
      </div>

      <div className="hidden h-12 w-px bg-white/10 md:block" />
      <div className="block h-px w-full bg-white/10 md:hidden" />

      <div className="flex flex-col items-start gap-2.5">
        <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
          Horário Mínimo
        </span>
        <Selector
          icon={<Clock className="h-4 w-4 text-amber-300" />}
          text={minHour}
        >
          {(close) => (
            <div>
              <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-white/40 uppercase">
                Hora Inicial
              </div>
              <div className="my-1 h-px bg-white/5" />
              <div className="max-h-60 overflow-y-auto">
                {minHourOptions.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => {
                      onSelectMinHour(hour);
                      close();
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-white/10 ${
                      minHour === hour
                        ? "bg-amber-300/10 font-medium text-amber-200"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <span>{hour}</span>
                    {minHour === hour && (
                      <Check className="h-4 w-4 text-amber-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Selector>
      </div>

      <div className="hidden h-12 w-px bg-white/10 md:block" />
      <div className="block h-px w-full bg-white/10 md:hidden" />

      <div className="flex flex-col items-start gap-2.5">
        <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
          Horário Máximo
        </span>
        <Selector
          icon={<Clock className="h-4 w-4 text-amber-300" />}
          text={maxHour}
        >
          {(close) => (
            <div>
              <div className="px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-white/40 uppercase">
                Hora Final
              </div>
              <div className="my-1 h-px bg-white/5" />
              <div className="max-h-60 overflow-y-auto">
                {maxHourOptions.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => {
                      onSelectMaxHour(hour);
                      close();
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all hover:bg-white/10 ${
                      maxHour === hour
                        ? "bg-amber-300/10 font-medium text-amber-200"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <span>{hour}</span>
                    {maxHour === hour && (
                      <Check className="h-4 w-4 text-amber-200" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Selector>
      </div>
    </div>
  );
}
