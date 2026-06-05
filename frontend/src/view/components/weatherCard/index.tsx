import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react";
import type { WeatherData } from "@/app/constants/mockWeather";

interface WeatherCardProps {
  currentWeather: WeatherData;
  selectedDate: Date;
  minHour: string;
  maxHour: string;
  onActiveReadingIndexChange?: (index: number) => void;
}

export default function WeatherCard({
  currentWeather,
  selectedDate,
  minHour,
  maxHour,
  onActiveReadingIndexChange,
}: WeatherCardProps) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(selectedDate);

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const translateCondition = (cond: WeatherData["condition"]) => {
    switch (cond) {
      case "Sunny":
        return "Ensolarado";
      case "Cloudy":
        return "Parcialmente nublado";
      case "Rainy":
        return "Chuvoso";
      case "Snowy":
        return "Neve";
      case "Stormy":
        return "Tempestade";
      default:
        return cond;
    }
  };

  const getWeatherIcon = (
    condition: WeatherData["condition"],
    className?: string,
  ) => {
    switch (condition) {
      case "Sunny":
        return <Sun className={className || "h-6 w-6 text-amber-300"} />;
      case "Cloudy":
        return <Cloud className={className || "h-6 w-6 text-slate-300"} />;
      case "Rainy":
        return <CloudRain className={className || "h-6 w-6 text-blue-300"} />;
      case "Snowy":
        return <CloudSnow className={className || "h-6 w-6 text-sky-200"} />;
      case "Stormy":
        return (
          <CloudLightning className={className || "h-6 w-6 text-purple-300"} />
        );
      default:
        return <Sun className={className || "h-6 w-6 text-amber-300"} />;
    }
  };

  const width = 800;
  const height = 220;
  const paddingLeft = 60;
  const paddingRight = 60;
  const paddingTop = 40;
  const paddingBottom = 40;
  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const [viewMode, setViewMode] = useState<"temp" | "humidity" | "both">(
    "temp",
  );

  const hourlyData = currentWeather.hourly || [];

  const defaultHourly: WeatherData["hourly"] = [
    {
      time: "00:00",
      temp: currentWeather.temp - 3,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity + 10)),
      condition: "Sunny",
    },
    {
      time: "03:00",
      temp: currentWeather.temp - 4,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity + 15)),
      condition: "Sunny",
    },
    {
      time: "06:00",
      temp: currentWeather.temp - 2,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity + 12)),
      condition: "Sunny",
    },
    {
      time: "09:00",
      temp: currentWeather.temp + 1,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity - 5)),
      condition: "Sunny",
    },
    {
      time: "12:00",
      temp: currentWeather.temp + 3,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity - 12)),
      condition: "Sunny",
    },
    {
      time: "15:00",
      temp: currentWeather.temp + 4,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity - 15)),
      condition: "Sunny",
    },
    {
      time: "18:00",
      temp: currentWeather.temp + 2,
      humidity: Math.min(100, Math.max(0, currentWeather.humidity - 2)),
      condition: "Sunny",
    },
    {
      time: "21:00",
      temp: currentWeather.temp,
      humidity: currentWeather.humidity,
      condition: "Sunny",
    },
  ];

  const activeHourly = hourlyData.length > 0 ? hourlyData : defaultHourly;

  // Filtrando por hora
  const filteredHourly = activeHourly.filter(
    (h) => h.time >= minHour && h.time <= maxHour,
  );

  // Usando hourly filtrado ou hourly original se o filtrado estiver vazio
  const displayedHourly =
    filteredHourly.length > 0 ? filteredHourly : activeHourly;

  // Temperatura
  const activeTemps = displayedHourly.map((h) =>
    typeof h.temp === "number" && !isNaN(h.temp)
      ? h.temp
      : (currentWeather.temp ?? 0),
  );
  const minTemp = activeTemps.length > 0 ? Math.min(...activeTemps) - 2 : 15;
  const maxTemp = activeTemps.length > 0 ? Math.max(...activeTemps) + 2 : 25;
  const tempRange = maxTemp - minTemp || 4;

  const points = displayedHourly.map((h, i) => {
    const divider = displayedHourly.length > 1 ? displayedHourly.length - 1 : 1;
    const x = paddingLeft + (i / divider) * plotWidth;
    const tempVal =
      typeof h.temp === "number" && !isNaN(h.temp)
        ? h.temp
        : (currentWeather.temp ?? 0);
    const y = paddingTop + (1 - (tempVal - minTemp) / tempRange) * plotHeight;
    return { x, y, temp: tempVal, time: h.time };
  });

  // Umidade
  const activeHumidities = displayedHourly.map((h) => {
    const hum = h.humidity ?? currentWeather.humidity ?? 50;
    return typeof hum === "number" && !isNaN(hum) ? hum : 50;
  });
  const minHum =
    activeHumidities.length > 0
      ? Math.max(0, Math.min(...activeHumidities) - 5)
      : 40;
  const maxHum =
    activeHumidities.length > 0
      ? Math.min(100, Math.max(...activeHumidities) + 5)
      : 80;
  const humRange = maxHum - minHum || 10;

  const humidityPoints = displayedHourly.map((h, i) => {
    const humidityVal = h.humidity ?? currentWeather.humidity ?? 50;
    const divider = displayedHourly.length > 1 ? displayedHourly.length - 1 : 1;
    const x = paddingLeft + (i / divider) * plotWidth;
    const y = paddingTop + (1 - (humidityVal - minHum) / humRange) * plotHeight;
    return { x, y, humidity: humidityVal, time: h.time };
  });

  // Pega o indice da hora mais próxima do horário atual
  const getClosestToCurrentTimeIndex = () => {
    if (displayedHourly.length === 0) return 0;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let closestIdx = 0;
    let minDiff = Infinity;

    displayedHourly.forEach((h, idx) => {
      const parts = h.time.split(":");
      const hHours = parseInt(parts[0], 10) || 0;
      const hMinutes = parseInt(parts[1], 10) || 0;
      const totalMinutes = hHours * 60 + hMinutes;

      const diff = Math.abs(totalMinutes - currentMinutes);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    return closestIdx;
  };

  const defaultActiveIndex = getClosestToCurrentTimeIndex();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const finalActiveIndex =
    hoveredIndex !== null ? hoveredIndex : defaultActiveIndex;

  useEffect(() => {
    if (onActiveReadingIndexChange) {
      onActiveReadingIndexChange(finalActiveIndex);
    }
  }, [finalActiveIndex, onActiveReadingIndexChange]);

  // Gerando curvas
  const getCurvePath = () => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) / 3;
      const cp2y = p1.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const curvePath = getCurvePath();
  const areaPath =
    points.length > 0
      ? `${curvePath} L ${points[points.length - 1].x} ${paddingTop + plotHeight} L ${points[0].x} ${paddingTop + plotHeight} Z`
      : "";

  const getHumidityCurvePath = () => {
    if (humidityPoints.length === 0) return "";
    let path = `M ${humidityPoints[0].x} ${humidityPoints[0].y}`;
    for (let i = 1; i < humidityPoints.length; i++) {
      const p0 = humidityPoints[i - 1];
      const p1 = humidityPoints[i];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) / 3;
      const cp2y = p1.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const humidityCurvePath = getHumidityCurvePath();
  const humidityAreaPath =
    humidityPoints.length > 0
      ? `${humidityCurvePath} L ${humidityPoints[humidityPoints.length - 1].x} ${paddingTop + plotHeight} L ${humidityPoints[0].x} ${paddingTop + plotHeight} Z`
      : "";

  // Cores baseadas na condição
  const getThemeColors = (cond: WeatherData["condition"]) => {
    switch (cond) {
      case "Sunny":
        return {
          lineColor: "#f59e0b",
          areaColor: "url(#sunnyAreaGradient)",
          glowColor: "rgba(245, 158, 11, 0.3)",
          dotColor: "#fbbf24",
        };
      case "Cloudy":
        return {
          lineColor: "#38bdf8",
          areaColor: "url(#cloudyAreaGradient)",
          glowColor: "rgba(56, 189, 248, 0.3)",
          dotColor: "#7dd3fc",
        };
      case "Rainy":
        return {
          lineColor: "#60a5fa",
          areaColor: "url(#rainyAreaGradient)",
          glowColor: "rgba(96, 165, 250, 0.3)",
          dotColor: "#93c5fd",
        };
      case "Snowy":
        return {
          lineColor: "#7dd3fc",
          areaColor: "url(#snowyAreaGradient)",
          glowColor: "rgba(125, 211, 252, 0.3)",
          dotColor: "#bae6fd",
        };
      case "Stormy":
        return {
          lineColor: "#c084fc",
          areaColor: "url(#stormyAreaGradient)",
          glowColor: "rgba(192, 132, 252, 0.3)",
          dotColor: "#d8b4fe",
        };
      default:
        return {
          lineColor: "#f59e0b",
          areaColor: "url(#sunnyAreaGradient)",
          glowColor: "rgba(245, 158, 11, 0.3)",
          dotColor: "#fbbf24",
        };
    }
  };

  const themeColors = getThemeColors(currentWeather.condition);

  const humidityColors = {
    lineColor: "#06b6d4",
    areaColor: "url(#humidityAreaGradient)",
    glowColor: "rgba(6, 182, 212, 0.3)",
    dotColor: "#22d3ee",
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    let closestIndex = 0;
    let minDiff = Infinity;

    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setHoveredIndex(closestIndex);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const gridLines = [
    { y: paddingTop, temp: maxTemp - 2, humidity: maxHum - 5 },
    {
      y: paddingTop + plotHeight / 2,
      temp: (minTemp + maxTemp) / 2,
      humidity: (minHum + maxHum) / 2,
    },
    { y: paddingTop + plotHeight, temp: minTemp + 2, humidity: minHum + 5 },
  ];

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur-md lg:col-span-2">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-sm font-semibold tracking-wide text-white/80">
          {capitalizedDate}
        </h3>
        <p className="mt-0.5 text-[10px] font-bold tracking-wider text-white/30 uppercase">
          {currentWeather.name} &bull; {currentWeather.station}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-2xl bg-white/5 p-3.5 backdrop-blur-xs">
            {getWeatherIcon(
              currentWeather.condition,
              "h-14 w-14 animate-pulse",
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-5xl font-black tracking-tighter">
                {typeof currentWeather.temp === "number" &&
                !isNaN(currentWeather.temp)
                  ? currentWeather.temp.toFixed(1).replace(".", ",")
                  : "N/A"}
              </span>
              <span className="ml-1 text-2xl font-bold text-white/60">°C</span>
            </div>
            <span className="mt-0.5 text-[11px] font-medium tracking-wider text-white/40 uppercase">
              Temperatura média
            </span>
            <span className="text-amber-350/70 mt-1 text-[9px] font-bold">
              Fonte:{" "}
              {currentWeather.station.toLowerCase().includes("caseira")
                ? "Sensor DHT11 (Local)"
                : currentWeather.station.toLowerCase().includes("pws")
                  ? "Weather.com PWS"
                  : "Open-Meteo"}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center border-t border-white/5 pt-4 pl-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase">
            Previsão para o dia
          </span>
          <div className="mt-2.5 flex items-center gap-4 text-sm font-medium">
            <div>
              <span className="text-white/60">Máx </span>
              <span className="font-bold text-red-400">
                {currentWeather.tempMax}°C
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div>
              <span className="text-white/60">Mín </span>
              <span className="font-bold text-blue-400">
                {currentWeather.tempMin}°C
              </span>
            </div>
          </div>
          <span className="mt-2 text-[9px] font-bold text-white/30">
            Fonte:{" "}
            {currentWeather.station.toLowerCase().includes("pws")
              ? "Weather.com PWS"
              : "Open-Meteo"}
          </span>
        </div>

        <div className="flex flex-col justify-center border-t border-white/5 pt-4 pl-0 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <span className="text-[10px] font-bold tracking-wider text-white/40 uppercase">
            Resumo do dia
          </span>
          <h4 className="mt-2 text-sm font-bold text-white/90">
            {translateCondition(currentWeather.condition)}
          </h4>
          <p className="mt-1 text-xs leading-relaxed font-medium text-white/50">
            {currentWeather.description}
          </p>
          <span className="mt-2 text-[9px] font-bold text-white/30">
            Fonte:{" "}
            {currentWeather.station.toLowerCase().includes("pws")
              ? "Weather.com PWS"
              : "Open-Meteo"}
          </span>
        </div>
      </div>

      <div className="mt-2 border-t border-white/5 pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-bold tracking-wider text-white/40 uppercase">
            {viewMode === "temp" && "Temperatura ao longo do dia"}
            {viewMode === "humidity" && "Umidade ao longo do dia"}
            {viewMode === "both" && "Temperatura e Umidade ao longo do dia"}
          </span>

          {/* Controle de Abas (Tabs) */}
          <div className="flex items-center gap-1 self-start rounded-xl bg-white/5 p-1 backdrop-blur-xs">
            <button
              onClick={() => setViewMode("temp")}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "temp"
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Temperatura
            </button>
            <button
              onClick={() => setViewMode("humidity")}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "humidity"
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Umidade
            </button>
            <button
              onClick={() => setViewMode("both")}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "both"
                  ? "bg-white/10 text-white shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Ambos
            </button>
          </div>
        </div>

        <div className="relative mt-4 w-full overflow-hidden rounded-xl bg-white/2">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full cursor-crosshair select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient
                id="sunnyAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="cloudyAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="rainyAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="snowyAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="stormyAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="humidityAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridLines.map((line, idx) => (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={line.y}
                  x2={width - paddingRight}
                  y2={line.y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />

                {(viewMode === "temp" || viewMode === "both") && (
                  <text
                    x={paddingLeft - 12}
                    y={line.y + 4}
                    textAnchor="end"
                    className="fill-white/30 text-[10px] font-semibold"
                  >
                    {Math.round(line.temp)}°C
                  </text>
                )}

                {viewMode === "humidity" && (
                  <text
                    x={paddingLeft - 12}
                    y={line.y + 4}
                    textAnchor="end"
                    className="fill-white/30 text-[10px] font-semibold"
                  >
                    {Math.round(line.humidity)}%
                  </text>
                )}

                {viewMode === "both" && (
                  <text
                    x={width - paddingRight + 12}
                    y={line.y + 4}
                    textAnchor="start"
                    className="fill-white/30 text-[10px] font-semibold"
                  >
                    {Math.round(line.humidity)}%
                  </text>
                )}
              </g>
            ))}

            {(viewMode === "temp" || viewMode === "both") && areaPath && (
              <path d={areaPath} fill={themeColors.areaColor} />
            )}

            {(viewMode === "humidity" || viewMode === "both") &&
              humidityAreaPath && (
                <path
                  d={humidityAreaPath}
                  fill={humidityColors.areaColor}
                  opacity={viewMode === "both" ? 0.15 : 1}
                />
              )}

            {(viewMode === "temp" || viewMode === "both") && curvePath && (
              <path
                d={curvePath}
                fill="none"
                stroke={themeColors.lineColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )}

            {(viewMode === "humidity" || viewMode === "both") &&
              humidityCurvePath && (
                <path
                  d={humidityCurvePath}
                  fill="none"
                  stroke={humidityColors.lineColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              )}

            {finalActiveIndex !== null && points[finalActiveIndex] && (
              <line
                x1={points[finalActiveIndex].x}
                y1={paddingTop}
                x2={points[finalActiveIndex].x}
                y2={paddingTop + plotHeight}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
            )}

            {(viewMode === "temp" || viewMode === "both") &&
              points.map((p, idx) => {
                const isActive = idx === finalActiveIndex;
                return (
                  <g key={`temp-${idx}`}>
                    {isActive && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="rgba(255, 255, 255, 0.15)"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? "4" : "3"}
                      fill={isActive ? "white" : themeColors.dotColor}
                      stroke={
                        isActive
                          ? themeColors.lineColor
                          : "rgba(15, 23, 42, 0.6)"
                      }
                      strokeWidth={isActive ? "1.5" : "1"}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

            {(viewMode === "humidity" || viewMode === "both") &&
              humidityPoints.map((p, idx) => {
                const isActive = idx === finalActiveIndex;
                return (
                  <g key={`hum-${idx}`}>
                    {isActive && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="rgba(255, 255, 255, 0.15)"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? "4" : "3"}
                      fill={isActive ? "white" : humidityColors.dotColor}
                      stroke={
                        isActive
                          ? humidityColors.lineColor
                          : "rgba(15, 23, 42, 0.6)"
                      }
                      strokeWidth={isActive ? "1.5" : "1"}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

            {points.map((p, idx) => (
              <text
                key={`hour-${idx}`}
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                className="fill-white/40 text-[10px] font-semibold tracking-wider"
              >
                {p.time}
              </text>
            ))}

            {finalActiveIndex !== null &&
              (() => {
                const activeTempPoint = points[finalActiveIndex];
                const activeHumPoint = humidityPoints[finalActiveIndex];
                if (!activeTempPoint || !activeHumPoint) return null;

                const activeHourlyItem = displayedHourly[finalActiveIndex];
                const precProb = activeHourlyItem?.precipitationProbability;
                const hasPrecProb = typeof precProb === "number";

                const isBoth = viewMode === "both";
                const isTemp = viewMode === "temp";
                const isHum = viewMode === "humidity";

                const rows: Array<{
                  text: string;
                  fill: string;
                  isBold: boolean;
                }> = [];
                if (isTemp || isBoth) {
                  rows.push({
                    text: `${activeTempPoint.temp.toFixed(1).replace(".", ",")}°C`,
                    fill: isBoth ? "#d97706" : "#1e293b",
                    isBold: true,
                  });
                }
                if (isHum || isBoth) {
                  rows.push({
                    text: `${activeHumPoint.humidity}% Umi.`,
                    fill: "#0891b2",
                    isBold: true,
                  });
                }
                if (hasPrecProb) {
                  rows.push({
                    text: `🌧️ ${precProb}% Chuva`,
                    fill: "#2563eb",
                    isBold: true,
                  });
                }

                const tooltipWidth = isBoth || hasPrecProb ? 100 : 84;
                const tooltipHeight = 22 + rows.length * 15;

                const tooltipX = Math.max(
                  paddingLeft - 10,
                  Math.min(
                    width - paddingRight + 10 - tooltipWidth,
                    activeTempPoint.x - tooltipWidth / 2,
                  ),
                );

                const targetY = isTemp
                  ? activeTempPoint.y
                  : isHum
                    ? activeHumPoint.y
                    : Math.min(activeTempPoint.y, activeHumPoint.y);

                const tooltipY = Math.max(10, targetY - tooltipHeight - 12);

                return (
                  <g>
                    <rect
                      x={tooltipX}
                      y={tooltipY}
                      width={tooltipWidth}
                      height={tooltipHeight}
                      rx="8"
                      fill="white"
                      className="shadow-md"
                    />
                    <text
                      x={tooltipX + tooltipWidth / 2}
                      y={tooltipY + 16}
                      textAnchor="middle"
                      fill="#64748b"
                      className="text-[10px] font-bold tracking-wider"
                    >
                      {activeTempPoint.time}
                    </text>

                    {rows.map((row, index) => (
                      <text
                        key={index}
                        x={tooltipX + tooltipWidth / 2}
                        y={tooltipY + 32 + index * 15}
                        textAnchor="middle"
                        fill={row.fill}
                        className={
                          row.isBold
                            ? "text-[11px] font-black"
                            : "text-[10px] font-medium"
                        }
                      >
                        {row.text}
                      </text>
                    ))}
                  </g>
                );
              })()}
          </svg>
        </div>
      </div>
    </div>
  );
}
