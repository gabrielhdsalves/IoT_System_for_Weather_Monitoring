import axios from "axios";
import { WeatherHourlyData } from "../interfaces/WeatherHourlyData";

/**
 * Busca observações na API do Weather.com (PWS) e formata para WeatherHourlyData[].
 * Se fornecida uma data (YYYY-MM-DD), busca o histórico horário daquele dia.
 * Caso contrário, busca as observações das últimas 24 horas.
 * @param stationId ID da estação meteorológica (ex: IITAJUB5)
 * @param date Data opcional no formato YYYY-MM-DD
 */
export async function fetchWeatherComData(
  stationId: string,
  date?: string,
): Promise<WeatherHourlyData[]> {
  const apiKey = process.env.WEATHER_API_KEY;
  let url = "";

  if (date) {
    // Formata YYYY-MM-DD para YYYYMMDD
    const formattedDate = date.replace(/-/g, "");
    url = `https://api.weather.com/v2/pws/history/hourly?apiKey=${apiKey}&stationId=${stationId}&numericPrecision=decimal&format=json&units=m&date=${formattedDate}`;
  } else {
    url = `https://api.weather.com/v2/pws/observations/all/1day?apiKey=${apiKey}&stationId=${stationId}&numericPrecision=decimal&format=json&units=m`;
  }

  const response = await axios.get(url);
  const observations = response.data.observations;

  if (!observations || !Array.isArray(observations)) {
    throw new Error("Formato de resposta inesperado da API Weather.com PWS");
  }

  return observations.map((obs: any) => {
    const metric = obs.metric || {};

    const tempVal = metric.tempAvg ?? metric.temp ?? obs.temp;
    const humVal = obs.humidityAvg ?? obs.humidity;
    const precipVal = metric.precipTotal ?? obs.precipTotal;
    const precipRateVal = metric.precipRate ?? obs.precipRate ?? 0;

    const codeVal =
      precipRateVal > 0 || (precipVal || 0) > 0
        ? 61
        : (humVal || 0) > 80
          ? 3
          : 0;

    const windSpeedVal =
      metric.windspeedAvg ?? metric.windSpeed ?? obs.windSpeed;
    const windDirVal = obs.winddirAvg ?? obs.winddir;
    const pressVal = metric.pressureMax ?? metric.pressure ?? obs.pressure;

    return {
      time: obs.obsTimeUtc, // formato: 2026-06-01T01:10:18Z
      temperature: typeof tempVal === "number" && !isNaN(tempVal) ? tempVal : 0,
      humidity: typeof humVal === "number" && !isNaN(humVal) ? humVal : 0,
      rain: typeof precipVal === "number" && !isNaN(precipVal) ? precipVal : 0,
      precipitationProbability: 0,
      precipitation:
        typeof precipVal === "number" && !isNaN(precipVal) ? precipVal : 0,
      weatherCode: codeVal,
      windSpeed:
        typeof windSpeedVal === "number" && !isNaN(windSpeedVal)
          ? windSpeedVal
          : 0,
      windDirection:
        typeof windDirVal === "number" && !isNaN(windDirVal) ? windDirVal : 0,
      pressure:
        typeof pressVal === "number" && !isNaN(pressVal) ? pressVal : 1013,
    };
  });
}
