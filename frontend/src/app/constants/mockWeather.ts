export interface WeatherData {
  name: string;
  station: string;
  country: string;
  temp: number;
  condition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy";
  description: string;
  tempMax: number;
  tempMin: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  precipitationProbability?: number;
  hourly: Array<{
    time: string;
    temp: number;
    humidity: number;
    condition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy";
    precipitationProbability?: number;
  }>;
  daily: Array<{
    day: string;
    tempMax: number;
    tempMin: number;
    condition: "Sunny" | "Cloudy" | "Rainy" | "Snowy" | "Stormy";
    pop: number;
  }>;
}

export const MOCK_CITIES: Record<string, WeatherData> = {
  itajuba_unifei: {
    name: "Itajubá",
    station: "UNIFEI",
    country: "Brasil",
    temp: 21,
    condition: "Cloudy",
    description: "Nublado - Dados de Campus UNIFEI",
    tempMax: 25,
    tempMin: 14,
    feelsLike: 21,
    humidity: 75,
    windSpeed: 10,
    uvIndex: 4,
    pressure: 1016,
    sunrise: "06:21",
    sunset: "17:42",
    hourly: [
      { time: "08:00", temp: 16, humidity: 85, condition: "Cloudy" },
      { time: "10:00", temp: 19, humidity: 78, condition: "Cloudy" },
      { time: "12:00", temp: 23, humidity: 65, condition: "Sunny" },
      { time: "14:00", temp: 25, humidity: 62, condition: "Sunny" },
      { time: "16:00", temp: 24, humidity: 68, condition: "Cloudy" },
      { time: "18:00", temp: 20, humidity: 75, condition: "Cloudy" },
      { time: "20:00", temp: 18, humidity: 80, condition: "Cloudy" },
      { time: "22:00", temp: 16, humidity: 82, condition: "Cloudy" },
    ],
    daily: [
      { day: "Hoje", tempMax: 25, tempMin: 14, condition: "Cloudy", pop: 10 },
      { day: "Sáb", tempMax: 26, tempMin: 13, condition: "Sunny", pop: 0 },
      { day: "Dom", tempMax: 27, tempMin: 15, condition: "Sunny", pop: 0 },
      { day: "Seg", tempMax: 25, tempMin: 16, condition: "Cloudy", pop: 30 },
      { day: "Ter", tempMax: 22, tempMin: 15, condition: "Rainy", pop: 70 },
      { day: "Qua", tempMax: 20, tempMin: 13, condition: "Stormy", pop: 90 },
      { day: "Qui", tempMax: 22, tempMin: 12, condition: "Cloudy", pop: 20 },
    ],
  },
  itajuba_caseira: {
    name: "Itajubá",
    station: "Estação Caseira",
    country: "Brasil",
    temp: 23,
    condition: "Sunny",
    description: "Ensolarado - Sensor Localizado no Centro",
    tempMax: 27,
    tempMin: 16,
    feelsLike: 24,
    humidity: 60,
    windSpeed: 8,
    uvIndex: 6,
    pressure: 1014,
    sunrise: "06:21",
    sunset: "17:42",
    hourly: [
      { time: "08:00", temp: 18, humidity: 70, condition: "Sunny" },
      { time: "10:00", temp: 21, humidity: 65, condition: "Sunny" },
      { time: "12:00", temp: 25, humidity: 55, condition: "Sunny" },
      { time: "14:00", temp: 27, humidity: 50, condition: "Sunny" },
      { time: "16:00", temp: 26, humidity: 54, condition: "Sunny" },
      { time: "18:00", temp: 22, humidity: 62, condition: "Sunny" },
      { time: "20:00", temp: 19, humidity: 68, condition: "Sunny" },
      { time: "22:00", temp: 17, humidity: 72, condition: "Sunny" },
    ],
    daily: [
      { day: "Hoje", tempMax: 27, tempMin: 16, condition: "Sunny", pop: 0 },
      { day: "Sáb", tempMax: 28, tempMin: 15, condition: "Sunny", pop: 0 },
      { day: "Dom", tempMax: 29, tempMin: 16, condition: "Sunny", pop: 0 },
      { day: "Seg", tempMax: 26, tempMin: 17, condition: "Cloudy", pop: 20 },
      { day: "Ter", tempMax: 23, tempMin: 14, condition: "Rainy", pop: 60 },
      { day: "Qua", tempMax: 21, tempMin: 13, condition: "Rainy", pop: 80 },
      { day: "Qui", tempMax: 24, tempMin: 14, condition: "Sunny", pop: 10 },
    ],
  },
  itajuba_clima_tempo: {
    name: "Itajubá",
    station: "Clima Tempo",
    country: "Brasil",
    temp: 22,
    condition: "Rainy",
    description: "Chuva Fraca - Previsão Climatempo",
    tempMax: 24,
    tempMin: 15,
    feelsLike: 22,
    humidity: 82,
    windSpeed: 14,
    uvIndex: 3,
    pressure: 1018,
    sunrise: "06:21",
    sunset: "17:42",
    hourly: [
      { time: "08:00", temp: 16, humidity: 90, condition: "Rainy" },
      { time: "10:00", temp: 18, humidity: 88, condition: "Rainy" },
      { time: "12:00", temp: 21, humidity: 82, condition: "Rainy" },
      { time: "14:00", temp: 24, humidity: 78, condition: "Cloudy" },
      { time: "16:00", temp: 23, humidity: 80, condition: "Rainy" },
      { time: "18:00", temp: 20, humidity: 85, condition: "Rainy" },
      { time: "20:00", temp: 18, humidity: 89, condition: "Rainy" },
      { time: "22:00", temp: 17, humidity: 91, condition: "Rainy" },
    ],
    daily: [
      { day: "Hoje", tempMax: 24, tempMin: 15, condition: "Rainy", pop: 80 },
      { day: "Sáb", tempMax: 25, tempMin: 14, condition: "Cloudy", pop: 40 },
      { day: "Dom", tempMax: 26, tempMin: 14, condition: "Sunny", pop: 10 },
      { day: "Seg", tempMax: 24, tempMin: 15, condition: "Rainy", pop: 60 },
      { day: "Ter", tempMax: 21, tempMin: 13, condition: "Rainy", pop: 90 },
      { day: "Qua", tempMax: 19, tempMin: 12, condition: "Stormy", pop: 95 },
      { day: "Qui", tempMax: 22, tempMin: 13, condition: "Cloudy", pop: 30 },
    ],
  },
  sao_paulo: {
    name: "São Paulo",
    station: "Aeroporto Congonhas",
    country: "Brasil",
    temp: 19,
    condition: "Rainy",
    description: "Chuva Fina",
    tempMax: 21,
    tempMin: 14,
    feelsLike: 18,
    humidity: 85,
    windSpeed: 18,
    uvIndex: 2,
    pressure: 1018,
    sunrise: "06:32",
    sunset: "17:48",
    hourly: [
      { time: "12:00", temp: 20, humidity: 82, condition: "Rainy" },
      { time: "14:00", temp: 21, humidity: 80, condition: "Rainy" },
      { time: "16:00", temp: 19, humidity: 85, condition: "Rainy" },
      { time: "18:00", temp: 18, humidity: 88, condition: "Rainy" },
      { time: "20:00", temp: 17, humidity: 90, condition: "Cloudy" },
      { time: "22:00", temp: 16, humidity: 92, condition: "Cloudy" },
    ],
    daily: [
      { day: "Hoje", tempMax: 21, tempMin: 14, condition: "Rainy", pop: 80 },
      { day: "Sáb", tempMax: 23, tempMin: 15, condition: "Cloudy", pop: 40 },
      { day: "Dom", tempMax: 25, tempMin: 16, condition: "Sunny", pop: 10 },
      { day: "Seg", tempMax: 26, tempMin: 17, condition: "Sunny", pop: 0 },
      { day: "Ter", tempMax: 22, tempMin: 15, condition: "Rainy", pop: 70 },
      { day: "Qua", tempMax: 20, tempMin: 13, condition: "Rainy", pop: 90 },
      { day: "Qui", tempMax: 21, tempMin: 14, condition: "Cloudy", pop: 30 },
    ],
  },
  rio_de_janeiro: {
    name: "Rio de Janeiro",
    station: "Aeroporto Santos Dumont",
    country: "Brasil",
    temp: 29,
    condition: "Sunny",
    description: "Céu Limpo e Ensolarado",
    tempMax: 33,
    tempMin: 22,
    feelsLike: 32,
    humidity: 55,
    windSpeed: 10,
    uvIndex: 8,
    pressure: 1012,
    sunrise: "06:18",
    sunset: "17:36",
    hourly: [
      { time: "12:00", temp: 31, humidity: 50, condition: "Sunny" },
      { time: "14:00", temp: 33, humidity: 48, condition: "Sunny" },
      { time: "16:00", temp: 32, humidity: 52, condition: "Sunny" },
      { time: "18:00", temp: 29, humidity: 58, condition: "Sunny" },
      { time: "20:00", temp: 26, humidity: 62, condition: "Sunny" },
      { time: "22:00", temp: 25, humidity: 65, condition: "Sunny" },
    ],
    daily: [
      { day: "Hoje", tempMax: 33, tempMin: 22, condition: "Sunny", pop: 0 },
      { day: "Sáb", tempMax: 34, tempMin: 23, condition: "Sunny", pop: 0 },
      { day: "Dom", tempMax: 32, tempMin: 22, condition: "Cloudy", pop: 20 },
      { day: "Seg", tempMax: 28, tempMin: 20, condition: "Rainy", pop: 70 },
      { day: "Ter", tempMax: 27, tempMin: 19, condition: "Cloudy", pop: 30 },
      { day: "Qua", tempMax: 29, tempMin: 21, condition: "Sunny", pop: 10 },
      { day: "Qui", tempMax: 31, tempMin: 22, condition: "Sunny", pop: 0 },
    ],
  },
};
