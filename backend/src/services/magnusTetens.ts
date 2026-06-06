import { ResultadoPrevisao } from "../interfaces/WeatherHourlyData";

/**
 * Calcula os indicadores de precipitação baseados em Temperatura e Umidade Relativa.
 * @param temperatura Temperatura ambiente em Graus Celsius (°C)
 * @param umidade Umidade Relativa em porcentagem (%)
 * @param alfa Coeficiente local para Água Precipitável (padrão teórico: -0.981)
 * @param beta Coeficiente local para Água Precipitável (padrão teórico: 0.0341)
 * @returns Objeto contendo os alertas e valores termodinâmicos
 */
export function analyzesPotentialRain(
  temperatura: number,
  umidade: number,
  alfa: number = -0.981,
  beta: number = 0.0341,
): ResultadoPrevisao {
  // 1. Pressão de vapor de saturação (es) em hPa
  const es = 6.11 * Math.pow(10, (7.5 * temperatura) / (237.3 + temperatura));

  // 2. Pressão de vapor real (ea) em hPa
  const ea = es * (umidade / 100);

  // 3. Ponto de Orvalho (Td)
  const td = (237.3 * Math.log(ea) - 429.41) / (19.078955 - Math.log(ea));

  // 4. Depressão do Ponto de Orvalho (T - Td)
  const depressao = temperatura - td;

  // 5. Definição do Alerta de Chuva
  let alerta: "Vermelho" | "Amarelo" | "Verde";
  if (depressao <= 2) {
    alerta = "Vermelho"; // Alta probabilidade / Quase saturado
  } else if (depressao > 2 && depressao <= 5) {
    alerta = "Amarelo"; // Média probabilidade / Estado de observação
  } else {
    alerta = "Verde"; // Baixa probabilidade / Ar estável e seco
  }

  // 6. Cálculo de Água Precipitável (W) conforme Equação 4
  const pw = 475 * (ea / (temperatura + 273.15));

  // 7. Classificação do Combustível Atmosférico (PW)
  let statusCombustivel = "";
  if (pw < 20) {
    statusCombustivel = "Ar Seco. Céu limpo ou poucas nuvens.";
  } else if (pw >= 20 && pw < 30) {
    statusCombustivel =
      "Umidade Moderada. Possibilidade de chuvas isoladas se houver forçante.";
  } else if (pw >= 30 && pw <= 50) {
    statusCombustivel =
      "Ambiente Úmido. Potencial para pancadas de chuva de verão.";
  } else {
    statusCombustivel =
      "Extrema umidade. Cenário típico de tempestades severas.";
  }

  // Retorno dos dados formatados e arredondados
  return {
    pressaoSaturacao_hPa: Number(es.toFixed(3)),
    pressaoAtual_hPa: Number(ea.toFixed(3)),
    pontoOrvalho_C: Number(td.toFixed(2)),
    depressao_C: Number(depressao.toFixed(2)),
    alertaChuva: alerta,
    aguaPrecipitavel_mm: Number(pw.toFixed(2)),
    statusCombustivel: statusCombustivel,
  };
}
