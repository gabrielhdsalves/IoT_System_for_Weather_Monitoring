import { app } from "../../..";
import { fetchMateoApiData } from "../../../services/mateoService";

import { routeCache } from "../../../middlewares/cacheMiddleware";

app.get("/api/mateoapi", routeCache, async (req, res) => {
  try {
    const latitude = req.query.latitude ? Number(req.query.latitude) : -22.4256;
    const longitude = req.query.longitude ? Number(req.query.longitude) : -45.4528;
    const date = req.query.date ? String(req.query.date) : undefined;

    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ error: 'Parâmetros "latitude" e "longitude" devem ser números válidos.' });
      return;
    }

    const mateoapiData = await fetchMateoApiData(latitude, longitude, date);

    res.json(mateoapiData);
  } catch (error) {
    console.error("Erro ao buscar dados do clima (Open-Meteo):", error);
    res.status(500).json({ error: "Erro interno ao processar a requisição de clima da Open-Meteo." });
  }
});
