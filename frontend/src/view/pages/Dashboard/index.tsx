import { useState, useEffect, useMemo } from "react";
import { MOCK_CITIES } from "@/app/constants/mockWeather";
import type { WeatherData } from "@/app/constants/mockWeather";
import Header from "@/view/components/header";
import CityAndDate from "@/view/components/cityAndDate";
import WeatherCard from "@/view/components/weatherCard";
import OtherInfoCard from "@/view/components/otherInfoCard";
import MagnusTetensCard from "@/view/components/magnusTetensCard";
import {
  getLocalWeatherData,
  getMateoWeatherData,
  getAvailableStations,
  getPwsWeatherData,
} from "@/app/services/weatherService";
import ImageAnalysisCard from "@/view/components/imageAnalysisCard";

function mapWeatherCodeToCondition(
  code: number,
  hum: number,
): "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy" {
  if ([95, 96, 99].includes(code)) return "Stormy";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "Rainy";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowy";
  if ([1, 2, 3, 45, 48].includes(code) || hum > 80) return "Cloudy";
  return "Sunny";
}

// Auxiliar: Monta o WeatherData a partir das medições do Google Sheets (Estação Caseira)
function buildWeatherDataFromReadings(
  readings: any[],
  cityKey: string,
  activeIndex: number,
): WeatherData {
  const baseCity = MOCK_CITIES[cityKey] || MOCK_CITIES.itajuba_caseira;

  if (!readings || readings.length === 0) {
    return {
      ...baseCity,
      temp: 0,
      humidity: 0,
      tempMax: 0,
      tempMin: 0,
      hourly: [],
    };
  }

  const temps = readings.map((r) => Number(r.temperatura));

  const tempMax = Math.max(...temps);
  const tempMin = Math.min(...temps);

  // Usar a leitura ativa baseada no índice do gráfico
  const activeReading =
    readings[activeIndex] || readings[readings.length - 1] || readings[0];

  const hourly = readings.map((r) => {
    let timeStr = "00:00";
    if (r.data && r.data.includes(" ")) {
      const parts = r.data.split(" ");
      timeStr = parts[1].substring(0, 5);
    } else {
      const date = new Date(r.data);
      timeStr =
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2);
    }

    return {
      time: timeStr,
      temp: Number(r.temperatura),
      humidity: Number(r.umidade),
      condition: mapWeatherCodeToCondition(
        r.codigoClimaMateo,
        Number(r.umidade),
      ),
    };
  });

  return {
    name: baseCity.name,
    station: baseCity.station,
    country: baseCity.country,
    temp: Number(activeReading.temperatura),
    humidity: Number(activeReading.umidade),
    feelsLike: Number(activeReading.temperatura),
    pressure: activeReading.pressaoAtmosfericaMateo || baseCity.pressure,
    condition: mapWeatherCodeToCondition(
      activeReading.codigoClimaMateo,
      Number(activeReading.umidade),
    ),
    description: `Alerta: ${activeReading.alertaChuva} | ${activeReading.statusCombustivel}`,
    tempMax: Math.round(tempMax),
    tempMin: Math.round(tempMin),
    windSpeed: activeReading.velocidadeVentoMateo_kmh || baseCity.windSpeed,
    uvIndex: baseCity.uvIndex,
    sunrise: baseCity.sunrise,
    sunset: baseCity.sunset,
    hourly: hourly,
    daily: baseCity.daily,
  };
}

// Auxiliar: Monta o WeatherData a partir da API Mateo (Open-Meteo)
function buildWeatherDataFromMateo(hourlyData: any[]): WeatherData | null {
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  const baseCity = MOCK_CITIES.itajuba_unifei;
  const currentHour = new Date().getHours();
  let currentMatch = hourlyData.find(
    (h) => new Date(h.time).getHours() === currentHour,
  );
  if (!currentMatch) currentMatch = hourlyData[0];

  const temps = hourlyData.map((h) => h.temperature);
  const tempMax = Math.max(...temps);
  const tempMin = Math.min(...temps);

  const hourly = hourlyData.map((h) => {
    const date = new Date(h.time);
    const timeStr =
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2);

    let condition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy" = "Sunny";
    const code = h.weatherCode;
    if ([95, 96, 99].includes(code)) condition = "Stormy";
    else if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)
    )
      condition = "Rainy";
    else if ([71, 73, 75, 77, 85, 86].includes(code)) condition = "Snowy";
    else if ([1, 2, 3, 45, 48].includes(code)) condition = "Cloudy";

    return {
      time: timeStr,
      temp: h.temperature,
      humidity: h.humidity,
      condition,
      precipitationProbability: h.precipitationProbability,
    };
  });

  let mainCondition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy" =
    "Sunny";
  const code = currentMatch.weatherCode;
  if ([95, 96, 99].includes(code)) mainCondition = "Stormy";
  else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    mainCondition = "Rainy";
  else if ([71, 73, 75, 77, 85, 86].includes(code)) mainCondition = "Snowy";
  else if ([1, 2, 3, 45, 48].includes(code)) mainCondition = "Cloudy";

  return {
    name: "Itajubá",
    station: "UNIFEI (Tempo Real)",
    country: "Brasil",
    temp: currentMatch.temperature,
    humidity: currentMatch.humidity,
    feelsLike: currentMatch.temperature,
    pressure: 1016,
    condition: mainCondition,
    description: `Previsão horária coletada em tempo real da Open-Meteo.`,
    tempMax: Math.round(tempMax),
    tempMin: Math.round(tempMin),
    windSpeed: currentMatch.windSpeed,
    uvIndex: 4,
    sunrise: baseCity.sunrise,
    sunset: baseCity.sunset,
    hourly: hourly,
    daily: baseCity.daily,
    precipitationProbability: currentMatch.precipitationProbability,
  };
}

// Auxiliar: Monta o WeatherData a partir da API PWS do Weather.com
function buildWeatherDataFromPws(
  hourlyData: any[],
  stationId: string,
): WeatherData | null {
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  const baseCity = MOCK_CITIES.itajuba_unifei;
  const currentMatch = hourlyData[hourlyData.length - 1] || hourlyData[0];

  const temps = hourlyData.map((h) => h.temperature);
  const tempMax = Math.max(...temps);
  const tempMin = Math.min(...temps);

  const hourly = hourlyData.map((h) => {
    const date = new Date(h.time);
    const timeStr =
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2);

    let condition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy" = "Sunny";
    const code = h.weatherCode;
    if ([95, 96, 99].includes(code)) condition = "Stormy";
    else if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)
    )
      condition = "Rainy";
    else if ([71, 73, 75, 77, 85, 86].includes(code)) condition = "Snowy";
    else if ([1, 2, 3, 45, 48].includes(code)) condition = "Cloudy";

    return {
      time: timeStr,
      temp: h.temperature,
      humidity: h.humidity,
      condition,
      precipitationProbability: h.precipitationProbability,
    };
  });

  let mainCondition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy" =
    "Sunny";
  const code = currentMatch.weatherCode;
  if ([95, 96, 99].includes(code)) mainCondition = "Stormy";
  else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    mainCondition = "Rainy";
  else if ([71, 73, 75, 77, 85, 86].includes(code)) mainCondition = "Snowy";
  else if ([1, 2, 3, 45, 48].includes(code)) mainCondition = "Cloudy";

  return {
    name: "Itajubá",
    station: `Estação PWS (${stationId})`,
    country: "Brasil",
    temp: currentMatch.temperature,
    humidity: currentMatch.humidity,
    feelsLike: currentMatch.temperature,
    pressure: currentMatch.pressure || 1016,
    condition: mainCondition,
    description: `Medições reais coletadas da estação pessoal ${stationId} do Weather.com.`,
    tempMax: Math.round(tempMax),
    tempMin: Math.round(tempMin),
    windSpeed: currentMatch.windSpeed,
    uvIndex: 1,
    sunrise: baseCity.sunrise,
    sunset: baseCity.sunset,
    hourly: hourly,
    daily: baseCity.daily,
    precipitationProbability: currentMatch.precipitationProbability,
  };
}

export default function Dashboard() {
  const [selectedCityKey, setSelectedCityKey] =
    useState<string>("itajuba_unifei");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [minHour, setMinHour] = useState<string>("00:00");
  const [maxHour, setMaxHour] = useState<string>("23:00");

  const [stations, setStations] = useState<any[]>([
    {
      key: "itajuba_unifei",
      name: "Itajubá",
      station: "UNIFEI (Tempo Real)",
      country: "Brasil",
    },
    {
      key: "itajuba_caseira",
      name: "Itajubá",
      station: "Estação Caseira (Planilha)",
      country: "Brasil",
    },
  ]);

  const [realWeatherData, setRealWeatherData] = useState<WeatherData | null>(
    null,
  );
  const [readings, setReadings] = useState<any[]>([]);
  const [activeReadingIndex, setActiveReadingIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const currentWeather = useMemo(() => {
    if (selectedCityKey === "itajuba_caseira" && readings.length > 0) {
      return buildWeatherDataFromReadings(
        readings,
        selectedCityKey,
        activeReadingIndex,
      );
    }
    return (
      realWeatherData ||
      MOCK_CITIES[selectedCityKey] ||
      MOCK_CITIES.itajuba_unifei
    );
  }, [selectedCityKey, readings, activeReadingIndex, realWeatherData]);

  useEffect(() => {
    async function fetchStations() {
      try {
        const data = await getAvailableStations();
        if (data && Array.isArray(data) && data.length > 0) {
          setStations(data);
          const keys = data.map((s) => s.key);
          if (!keys.includes(selectedCityKey)) {
            setSelectedCityKey(data[0].key);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar estações do backend:", err);
      }
    }
    fetchStations();
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setReadings([]);
      setRealWeatherData(null);
      try {
        if (selectedCityKey === "itajuba_caseira") {
          // Formata a data como AAAA-MM-DD
          const year = selectedDate.getFullYear();
          const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2);
          const day = ("0" + selectedDate.getDate()).slice(-2);
          const dateStr = `${year}-${month}-${day}`;

          const data = await getLocalWeatherData(dateStr, minHour, maxHour);
          setReadings(data);
          if (data && data.length > 0) {
            setRealWeatherData(
              buildWeatherDataFromReadings(data, selectedCityKey, 0),
            );
            setActiveReadingIndex(0);
          } else {
            setRealWeatherData(null);
          }
        } else if (selectedCityKey === "itajuba_unifei") {
          // Formata a data como AAAA-MM-DD
          const year = selectedDate.getFullYear();
          const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2);
          const day = ("0" + selectedDate.getDate()).slice(-2);
          const dateStr = `${year}-${month}-${day}`;

          const data = await getMateoWeatherData(dateStr);
          setRealWeatherData(buildWeatherDataFromMateo(data));
          setReadings([]);
        } else if (selectedCityKey.startsWith("itajuba_iitaju")) {
          // Estações PWS do Weather.com
          const year = selectedDate.getFullYear();
          const month = ("0" + (selectedDate.getMonth() + 1)).slice(-2);
          const day = ("0" + selectedDate.getDate()).slice(-2);
          const dateStr = `${year}-${month}-${day}`;

          const stationId = selectedCityKey
            .replace("itajuba_", "")
            .toUpperCase();
          const data = await getPwsWeatherData(stationId, dateStr);
          setRealWeatherData(buildWeatherDataFromPws(data, stationId));
          setReadings([]);
        } else {
          // Cidades de fallback
          setRealWeatherData(MOCK_CITIES[selectedCityKey] || null);
          setReadings([]);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do clima do backend:", err);
        setRealWeatherData(null);
        setReadings([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCityKey, selectedDate, minHour, maxHour]);

  useEffect(() => {
    setMinHour("08:00");
    setMaxHour("20:00");
  }, [selectedCityKey]);

  const getBackgroundGradient = (condition: WeatherData["condition"]) => {
    switch (condition) {
      case "Sunny":
        return "bg-gradient-to-br from-amber-400 via-orange-500 to-sky-500";
      case "Cloudy":
        return "bg-gradient-to-br from-slate-500 via-zinc-700 to-indigo-900";
      case "Rainy":
        return "bg-gradient-to-br from-slate-800 via-blue-950 to-zinc-950";
      case "Snowy":
        return "bg-gradient-to-br from-sky-300 via-indigo-600 to-slate-900";
      case "Stormy":
        return "bg-gradient-to-br from-purple-950 via-slate-900 to-black";
      default:
        return "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
    }
  };

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center justify-start gap-4 p-8 font-sans transition-colors duration-1000 sm:p-10 md:p-12 ${getBackgroundGradient(
        currentWeather.condition,
      )} overflow-y-auto text-white`}
    >
      <div className="mb-16 flex w-full max-w-6xl flex-col gap-6">
        <Header />

        <div className="relative">
          <CityAndDate
            selectedCityKey={selectedCityKey}
            onSelectCity={setSelectedCityKey}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            minHour={minHour}
            onSelectMinHour={setMinHour}
            maxHour={maxHour}
            onSelectMaxHour={setMaxHour}
            stations={stations}
          />
          {loading && (
            <div className="absolute top-2 right-4 flex items-center gap-1.5 rounded-full bg-slate-900/60 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-400" />
              <span>Carregando...</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-900/30 p-8 text-center shadow-lg backdrop-blur-md">
            <div className="flex flex-col items-center gap-3">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent" />
              <span className="text-sm font-semibold tracking-wide text-white/50">
                Carregando dados meteorológicos...
              </span>
            </div>
          </div>
        ) : (selectedCityKey === "itajuba_caseira" && readings.length === 0) ||
          (selectedCityKey === "itajuba_unifei" && realWeatherData === null) ? (
          <div className="flex h-80 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-900/30 p-8 text-center shadow-lg backdrop-blur-md">
            <span className="text-xl font-bold tracking-wide text-white/50">
              (informações não existentes)
            </span>
            <p className="mt-2 text-sm text-white/35">
              {selectedCityKey === "itajuba_caseira"
                ? "Não há dados de sensores disponíveis na planilha para o dia selecionado."
                : "Não há dados meteorológicos da Open-Meteo disponíveis para o dia selecionado."}
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-stretch gap-6 lg:flex-row">
            <div className="min-w-0 flex-1">
              <WeatherCard
                currentWeather={currentWeather}
                selectedDate={selectedDate}
                minHour={minHour}
                maxHour={maxHour}
                onActiveReadingIndexChange={setActiveReadingIndex}
              />
            </div>
            <div className="w-full shrink-0 lg:w-[420px]">
              <OtherInfoCard currentWeather={currentWeather} />
            </div>
          </div>
        )}

        {selectedCityKey === "itajuba_caseira" &&
          readings.length > 0 &&
          readings[activeReadingIndex] && (
            <div className="animate-fade-in w-full duration-300">
              <MagnusTetensCard reading={readings[activeReadingIndex]} />
            </div>
          )}

        <ImageAnalysisCard />
      </div>

      <footer className="fixed right-0 bottom-0 left-0 z-40 w-full border-t border-white/5 bg-slate-900/60 py-6 text-center text-xs text-white/40 backdrop-blur-md">
        Desenvolvido por Gabriel Alves e Juliana Azevedo
      </footer>
    </div>
  );
}
