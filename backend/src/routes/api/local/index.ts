import { app } from "../../..";
import { fetchLocalApiData } from "../../../services/localSerivce";
import { fetchMateoApiData } from "../../../services/mateoService";
import { analyzesPotentialRain } from "../../../services/magnusTetens";

// Função auxiliar para analisar datas em formato BR ("DD/MM/YYYY HH:mm:ss") ou ISO
function parseSpreadsheetDate(dateStr: string): Date {
    if (dateStr.includes("/")) {
        const [datePart, timePart] = dateStr.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes, seconds] = (timePart || "00:00:00").split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds || 0);
    }
    return new Date(dateStr);
}

import { routeCache } from "../../../middlewares/cacheMiddleware";

app.get('/api/local', routeCache, async (req, res) => {
    try {
        const minHour = req.query.minHour ? String(req.query.minHour) : "00:00";
        const maxHour = req.query.maxHour ? String(req.query.maxHour) : "23:59";
        const data = req.query.data ? String(req.query.data) : "";

        if (!data) {
            res.status(400).json({
                error: 'O parâmetro "data" é obrigatório no formato YYYY-MM-DD.'
            });
            return;
        }

        const localWeatherData = await fetchLocalApiData(minHour, maxHour, data);

        let mateoForecast: any[] = [];
        try {
            mateoForecast = await fetchMateoApiData(-22.4256, -45.4528, data);
        } catch (mateoErr) {
            console.error("Aviso: Falha ao carregar dados do MateoService, continuando sem cruzamento de chuva:", mateoErr);
        }

        // Agrupa os dados por hora e calcular a média de temperatura e umidade
        const hourlyGroups: Record<number, {
            temps: number[], hums: number[], originalDates: string[]
        }> = {};


        localWeatherData.forEach((reading) => {
            const dateObj = parseSpreadsheetDate(reading.data);
            if (isNaN(dateObj.getTime())) return;
            const hour = dateObj.getHours();

            const tempVal = Number(reading.temperatura);
            const humVal = Number(reading.umidade);
            if (isNaN(tempVal) || isNaN(humVal) || (reading.temperatura as any) === "" || (reading.umidade as any) === "" || (reading.temperatura as any) === null || (reading.umidade as any) === null) {
                return;
            }

            if (!hourlyGroups[hour]) {
                hourlyGroups[hour] = {
                    temps: [],
                    hums: [],
                    originalDates: []
                };
            }
            hourlyGroups[hour].temps.push(tempVal);
            hourlyGroups[hour].hums.push(humVal);
            hourlyGroups[hour].originalDates.push(reading.data);
        });

        const sortedHours = Object.keys(hourlyGroups).map(Number).sort((a, b) => a - b);

        const processedResults = sortedHours.map((hour, idx) => {
            const group = hourlyGroups[hour];
            const avgTemp = group.temps.reduce((a, b) => a + b, 0) / group.temps.length;
            const avgHum = group.hums.reduce((a, b) => a + b, 0) / group.hums.length;

            const isLastHour = idx === sortedHours.length - 1;
            let displayDateStr = "";

            if (isLastHour) {
                displayDateStr = group.originalDates[group.originalDates.length - 1];
            } else {
                const representativeDateStr = group.originalDates[0];
                if (representativeDateStr.includes(" ")) {
                    const datePart = representativeDateStr.split(" ")[0];
                    displayDateStr = `${datePart} ${("0" + hour).slice(-2)}:00:00`;
                } else {
                    const dateObj = parseSpreadsheetDate(representativeDateStr);
                    dateObj.setMinutes(0);
                    dateObj.setSeconds(0);
                    displayDateStr = dateObj.toISOString();
                }
            }

            // Aplicar fórmula de Magnus-Tetens
            const analysis = analyzesPotentialRain(avgTemp, avgHum);

            // Correlacionar com a chuva, vento e código do MateoService para a respectiva hora
            let chovendoMateo = false;
            let probabilidadeChuvaMateo = 0;
            let chuvaMateo_mm = 0;
            let velocidadeVentoMateo_kmh = 0;
            let codigoClimaMateo = 0;
            let pressaoAtmosfericaMateo = 1014;

            if (mateoForecast.length > 0) {
                const match = mateoForecast.find((f) => {
                    const fDate = new Date(f.time);
                    return fDate.getHours() === hour;
                });

                if (match) {
                    chovendoMateo = match.rain > 0;
                    probabilidadeChuvaMateo = match.precipitationProbability;
                    chuvaMateo_mm = match.rain;
                    velocidadeVentoMateo_kmh = match.windSpeed;
                    codigoClimaMateo = match.weatherCode;
                    pressaoAtmosfericaMateo = match.pressure;
                }
            }

            return {
                data: displayDateStr,
                temperatura: Number(avgTemp.toFixed(1)),
                umidade: Number(avgHum.toFixed(1)),
                ...analysis,
                chovendoMateo,
                probabilidadeChuvaMateo,
                chuvaMateo_mm: Number(chuvaMateo_mm.toFixed(1)),
                velocidadeVentoMateo_kmh: Number(velocidadeVentoMateo_kmh.toFixed(1)),
                codigoClimaMateo,
                pressaoAtmosfericaMateo: Math.round(pressaoAtmosfericaMateo)
            };
        });

        res.json(processedResults);
    } catch (error) {
        console.error("Erro ao buscar e processar dados do clima local:", error);
        res.status(500).json({ error: "Erro interno ao processar a requisição de clima local." });
    }
});
