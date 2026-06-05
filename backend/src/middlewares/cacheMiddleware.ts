import { Request, Response, NextFunction } from "express";

const cacheStore: Record<string, { body: any; time: number }> = {};
const TTL = 5 * 60 * 1000; // 5 minutos de cache

setInterval(() => {
  const agora = Date.now();
  for (const key in cacheStore) {
    if (agora - cacheStore[key].time > TTL) {
      console.log(`[Cache Middleware]: Limpando rota expirada do cache: ${key}`);
      delete cacheStore[key];
    }
  }
}, 60 * 1000);

export const routeCache = (req: Request, res: Response, next: NextFunction) => {
  const key = req.originalUrl || req.url;

  if (cacheStore[key]) {
    const tempoDecorrido = Date.now() - cacheStore[key].time;
    if (tempoDecorrido < TTL) {
      console.log(`[Cache Middleware]: Servindo rota do cache: ${key}`);
      return res.json(cacheStore[key].body);
    }
    console.log(`[Cache Middleware]: Rota no cache expirada para: ${key}`);
    delete cacheStore[key];
  }

  // Sobrescreve res.json para armazenar a resposta no cache antes de enviar
  const originalJson = res.json;
  res.json = function (body): Response {
    cacheStore[key] = { body, time: Date.now() };
    return originalJson.call(this, body);
  };

  next();
};
