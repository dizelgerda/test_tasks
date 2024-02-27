import { API_KEY, CACHE_LIFETIME } from "../../config";
import axios from "axios";
import cacheClient from "./cacheClient";

const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

export function searchMany(text: string, page: number = 1) {
  return axios.get(`${BASE_URL}&s=${text.trim()}&page=${page}`);
}

export async function findById(id: string) {
  const data = cacheClient.get(id);

  if (data) {
    return data;
  } else {
    const { data } = await axios.get(`${BASE_URL}&i=${id}`);
    cacheClient.set(id, data, CACHE_LIFETIME);

    return data;
  }
}
