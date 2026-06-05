import { app } from "../../..";
import { fetchWeatherComData } from "../../../services/weatherComService";

import { routeCache } from "../../../middlewares/cacheMiddleware";

app.get("/api/pws", routeCache, async (req, res) => {
  try {
    const stationId = req.query.stationId ? String(req.query.stationId) : "IITAJUB5";
    const date = req.query.date ? String(req.query.date) : undefined;

    const pwsData = await fetchWeatherComData(stationId, date);
    res.json(pwsData);
  } catch (error: any) {
    console.error(`Erro ao buscar dados da estação PWS (${req.query.stationId}):`, error);
    res.status(500).json({ error: "Erro interno ao processar a requisição de clima da estação PWS." });
  }
});
