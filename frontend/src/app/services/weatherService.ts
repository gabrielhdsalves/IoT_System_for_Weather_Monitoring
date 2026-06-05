import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export async function getLocalWeatherData(
  data: string,
  minHour: string,
  maxHour: string,
) {
  const response = await api.get("/local", {
    params: {
      data,
      minHour,
      maxHour,
    },
  });
  return response.data;
}

export async function getMateoWeatherData(
  date?: string,
  latitude = -22.4256,
  longitude = -45.4528,
) {
  const response = await api.get("/mateoapi", {
    params: {
      latitude,
      longitude,
      date,
    },
  });
  return response.data;
}

export async function getAvailableStations() {
  const response = await api.get("/stations");
  return response.data;
}

export async function getPwsWeatherData(stationId: string, date?: string) {
  const response = await api.get("/pws", {
    params: {
      stationId,
      date,
    },
  });
  return response.data;
}

export async function evaluateImage(base64Image: string) {
  const response = await api.post("/evaluate-image", {
    image: base64Image,
  });
  return response.data;
}
