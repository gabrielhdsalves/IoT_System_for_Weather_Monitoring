export interface WeatherHourlyData {
  time: string;
  temperature: number;
  humidity: number;
  rain: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
}

export interface LocalWeatherData {
  data: string;
  temperatura: number;
  umidade: number;
}

export interface ResultadoPrevisao {
  pressaoSaturacao_hPa: number;
  pressaoAtual_hPa: number;
  pontoOrvalho_C: number;
  depressao_C: number;
  alertaChuva: 'Vermelho' | 'Amarelo' | 'Verde';
  aguaPrecipitavel_mm: number;
  statusCombustivel: string;
}