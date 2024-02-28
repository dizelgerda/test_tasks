const BASE_URL = "http://localhost:3000";

interface CreateNewsData {
  text: string;
  publishedAt?: Date;
}

export function createNews(data: CreateNewsData) {
  return fetch(`${BASE_URL}/news`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export function getAllNews() {
  return fetch(`${BASE_URL}/news`, {
    method: "GET",
    credentials: "include",
  });
}

export function getNewsByOwner(ownerID: string) {
  return fetch(`${BASE_URL}/news/owner/${ownerID}`, {
    method: "GET",
    credentials: "include",
  });
}

export function getNewsByID(id: string) {
  return fetch(`${BASE_URL}/news/${id}`, {
    method: "GET",
    credentials: "include",
  });
}

export function deleteNews(id: string) {
  return fetch(`${BASE_URL}/news/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export function updateNews(id: string, data: CreateNewsData) {
  return fetch(`${BASE_URL}/news/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
}
