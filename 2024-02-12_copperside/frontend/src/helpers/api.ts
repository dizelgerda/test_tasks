import axios from "axios";

const BASE_URL = "http://localhost:3000";

export function search(text: string, page: number = 1) {
  return axios.get(`${BASE_URL}/movies?search=${text}&page=${page}`);
}

export function getAll() {
  return axios.get(`${BASE_URL}/movies`);
}

export function getById(mdbID: string) {
  return axios.get(`${BASE_URL}/movies/${mdbID}`);
}

export function remove(mdbID: string) {
  return axios.delete(`${BASE_URL}/movies/${mdbID}`);
}

export function add(mdbID: string, rating?: number) {
  return axios.post(`${BASE_URL}/movies`, {
    mdbID,
    rating,
  });
}

export function update(mdbID: string, newRating?: number) {
  return axios.patch(`${BASE_URL}/movies/${mdbID}`, {
    rating: newRating,
  });
}
