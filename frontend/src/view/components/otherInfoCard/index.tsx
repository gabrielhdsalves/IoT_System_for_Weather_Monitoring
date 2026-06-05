import {
  Droplets,
  Thermometer,
  Gauge,
  Wind,
  CloudRain,
  Cloud,
  Triangle,
} from "lucide-react";
import type { WeatherData } from "@/app/constants/mockWeather";

interface OtherInfoCardProps {
  currentWeather: WeatherData;
}

export default function OtherInfoCard({ currentWeather }: OtherInfoCardProps) {
  // 1. Umidade Relativa
  const humidityValue = `${currentWeather.humidity}%`;
  let humidityStatus: "dot" | "up" | "down" = "dot";
  let humidityText = "Dentro do previsto";
  if (currentWeather.humidity > 75) {
    humidityStatus = "up";
    humidityText = "Acima do previsto";
  } else if (currentWeather.humidity < 50) {
    humidityStatus = "down";
    humidityText = "Abaixo do previsto";
  }

  // 2. Sensação Térmica
  const feelsLike =
    typeof currentWeather.feelsLike === "number" &&
    !isNaN(currentWeather.feelsLike)
      ? currentWeather.feelsLike
      : (currentWeather.temp ?? 0);
  const tempVal =
    typeof currentWeather.temp === "number" && !isNaN(currentWeather.temp)
      ? currentWeather.temp
      : 0;
  const feelsLikeValue = `${feelsLike.toFixed(1).replace(".", ",")}°C`;
  const diffTemp = feelsLike - tempVal;
  let feelsLikeStatus: "dot" | "up" | "down" = "dot";
  let feelsLikeText = "Dentro do previsto";
  if (diffTemp > 0.1) {
    feelsLikeStatus = "up";
    feelsLikeText = `+${diffTemp.toFixed(1).replace(".", ",")}°C acima`;
  } else if (diffTemp < -0.1) {
    feelsLikeStatus = "down";
    feelsLikeText = `${diffTemp.toFixed(1).replace(".", ",")}°C abaixo`;
  }

  // 3. Pressão Atmosférica
  const pressureValue = `${currentWeather.pressure} hPa`;
  let pressureStatus: "dot" | "up" | "down" = "dot";
  let pressureText = "Dentro do previsto";
  if (currentWeather.pressure > 1015) {
    pressureStatus = "up";
    pressureText = "Acima do previsto";
  } else if (currentWeather.pressure < 1011) {
    pressureStatus = "down";
    pressureText = "Abaixo do previsto";
  }

  // 4. Vento (Simulando a direção com base na localização/velocidade)
  const getWindDirection = (name: string) => {
    switch (name) {
      case "São Paulo":
        return "SE";
      case "Rio de Janeiro":
        return "S";
      case "Itajubá":
        return "E";
      default:
        return "NE";
    }
  };
  const windDir = getWindDirection(currentWeather.name);
  const windValue = `${currentWeather.windSpeed} km/h (${windDir})`;
  let windStatus: "dot" | "up" | "down" = "dot";
  let windText = "Dentro do previsto";
  if (currentWeather.windSpeed > 15) {
    windStatus = "up";
    windText = "Acima do previsto";
  } else if (currentWeather.windSpeed < 8) {
    windStatus = "down";
    windText = "Abaixo do previsto";
  }

  // 5. Chuva Acumulada
  const getRainAccumulation = (cond: WeatherData["condition"]) => {
    switch (cond) {
      case "Sunny":
        return {
          val: "0,0 mm",
          status: "down" as const,
        };
      case "Cloudy":
        return {
          val: "0,2 mm",
          status: "down" as const,
        };
      case "Rainy":
        return {
          val: "2,8 mm",
          status: "down" as const,
        };
      case "Stormy":
        return {
          val: "12,4 mm",
          status: "up" as const,
        };
      case "Snowy":
        return {
          val: "1,5 mm",
          status: "dot" as const,
        };
      default:
        return {
          val: "0,0 mm",
          status: "dot" as const,
        };
    }
  };
  const rainInfo = getRainAccumulation(currentWeather.condition);

  // 6. Nebulosidade
  const getCloudiness = (cond: WeatherData["condition"]) => {
    switch (cond) {
      case "Sunny":
        return {
          val: "10%",
          status: "down" as const,
        };
      case "Cloudy":
        return {
          val: "48%",
          status: "dot" as const,
        };
      case "Rainy":
        return {
          val: "85%",
          status: "up" as const,
        };
      case "Stormy":
        return { val: "95%", status: "up" as const };
      case "Snowy":
        return {
          val: "75%",
          status: "dot" as const,
        };
      default:
        return {
          val: "30%",
          status: "dot" as const,
        };
    }
  };
  const cloudInfo = getCloudiness(currentWeather.condition);

  const isCaseira = currentWeather.station.toLowerCase().includes("caseira");
  const isPws = currentWeather.station.toLowerCase().includes("pws");

  const getSource = (label: string) => {
    if (isCaseira) {
      if (label === "Umidade relativa") return "Sensor DHT11 (Local)";
      if (label === "Sensação térmica") return "Cálculo Local";
      return "Open-Meteo API";
    }
    if (isPws) return "Weather.com PWS";
    return "Open-Meteo API";
  };

  const items = [
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      label: "Umidade relativa",
      value: humidityValue,
      statusType: humidityStatus,
      source: getSource("Umidade relativa"),
    },
    {
      icon: <Thermometer className="h-5 w-5 text-blue-500" />,
      label: "Sensação térmica",
      value: feelsLikeValue,
      statusType: feelsLikeStatus,
      source: getSource("Sensação térmica"),
    },
    {
      icon: <Gauge className="h-5 w-5 text-blue-500" />,
      label: "Pressão atmosférica",
      value: pressureValue,
      statusType: pressureStatus,
      source: getSource("Pressão atmosférica"),
    },
    {
      icon: <Wind className="h-5 w-5 text-blue-500" />,
      label: "Vento",
      value: windValue,
      statusType: windStatus,
      source: getSource("Vento"),
    },
    {
      icon: <CloudRain className="h-5 w-5 text-blue-500" />,
      label: "Chuva acumulada",
      value: rainInfo.val,
      statusType: rainInfo.status,
      source: getSource("Chuva acumulada"),
    },
    {
      icon: <Cloud className="h-5 w-5 text-blue-500" />,
      label: "Nebulosidade",
      value: cloudInfo.val,
      statusType:
        cloudInfo.status === "up" && cloudInfo.val === "85%"
          ? "dot"
          : cloudInfo.status,
      source: getSource("Nebulosidade"),
    },
  ];

  if (currentWeather.precipitationProbability !== undefined) {
    items.push({
      icon: <CloudRain className="h-5 w-5 text-blue-500" />,
      label: "Probabilidade de chuva",
      value: `${currentWeather.precipitationProbability}%`,
      statusType: currentWeather.precipitationProbability > 50 ? "up" : "dot",
      source: getSource("Probabilidade de chuva"),
    });
  }

  return (
    <div className="flex h-full w-full flex-col gap-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-lg backdrop-blur-md">
      <div className="border-b border-white/5 pb-4">
        <h3 className="text-base font-bold tracking-wide text-white">
          Outras informações
        </h3>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 items-center border-b border-white/5 py-3.5 first:pt-0 last:border-0 last:pb-0"
          >
            <div className="col-span-8 flex items-center gap-3 text-sm font-medium text-white/80">
              {item.icon}
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span className="mt-0.5 text-[9px] font-bold text-white/30 uppercase">
                  {item.source}
                </span>
              </div>
            </div>
            <div className="col-span-4 text-right text-sm font-bold text-white sm:text-base">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
