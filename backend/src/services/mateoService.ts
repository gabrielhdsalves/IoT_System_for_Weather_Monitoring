import axios from "axios";
import { WeatherHourlyData } from "../interfaces/WeatherHourlyData";

/**
 * Busca dados de previsão do tempo na API Open-Meteo e os formata.
 * @param latitude Latitude da localização
 * @param longitude Longitude da localização
 */
export async function fetchMateoApiData(
  latitude: number,
  longitude: number,
  date?: string,
): Promise<WeatherHourlyData[]> {
  let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl&models=gfs_seamless&timezone=America%2FSao_Paulo`;

  if (date) {
    url += `&start_date=${date}&end_date=${date}`;
  } else {
    url += `&forecast_days=1`;
  }

  const response = await axios.get(url);
  const hourly = response.data.hourly;

  if (!hourly || !hourly.time) {
    throw new Error("Formato de resposta inesperado da API Open-Meteo");
  }

  const length = hourly.time.length;
  const formattedData: WeatherHourlyData[] = [];

  for (let i = 0; i < length; i++) {
    const tempVal = hourly.temperature_2m?.[i];
    const humVal = hourly.relative_humidity_2m?.[i];
    const rainVal = hourly.rain?.[i];
    const precipProbVal = hourly.precipitation_probability?.[i];
    const precipVal = hourly.precipitation?.[i];
    const codeVal = hourly.weather_code?.[i];
    const windSpeedVal = hourly.wind_speed_10m?.[i];
    const windDirVal = hourly.wind_direction_10m?.[i];
    const pressVal = hourly.pressure_msl?.[i];

    formattedData.push({
      time: hourly.time[i],
      temperature: typeof tempVal === "number" && !isNaN(tempVal) ? tempVal : 0,
      humidity: typeof humVal === "number" && !isNaN(humVal) ? humVal : 0,
      rain: typeof rainVal === "number" && !isNaN(rainVal) ? rainVal : 0,
      precipitationProbability: typeof precipProbVal === "number" && !isNaN(precipProbVal) ? precipProbVal : 0,
      precipitation: typeof precipVal === "number" && !isNaN(precipVal) ? precipVal : 0,
      weatherCode: typeof codeVal === "number" && !isNaN(codeVal) ? codeVal : 0,
      windSpeed: typeof windSpeedVal === "number" && !isNaN(windSpeedVal) ? windSpeedVal : 0,
      windDirection: typeof windDirVal === "number" && !isNaN(windDirVal) ? windDirVal : 0,
      pressure: typeof pressVal === "number" && !isNaN(pressVal) ? pressVal : 1013,
    });
  }

  return formattedData;
}
