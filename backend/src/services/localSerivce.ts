import axios from "axios";
import { LocalWeatherData } from "../interfaces/WeatherHourlyData";
import dotenv from "dotenv";

/**
 * Busca dados de previsão do tempo na API Local e os formata.
 * @param minHour Horário inicial
 * @param maxHour Horário final
 * @param data Data
 */
export async function fetchLocalApiData(
    minHour: string,
    maxHour: string,
    data: string,
): Promise<LocalWeatherData[]> {
    const url = process.env.GOOGLE || "";

    const response = await axios.get<LocalWeatherData[]>(url, {
        params: { minHour, maxHour, data }
    });

    return response.data;
}