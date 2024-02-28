const BASE_URL = "http://localhost:3000";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export function createUser(data: CreateUserData) {
  return fetch(`${BASE_URL}/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
}

export function login(email: string, password: string) {
  return fetch(`${BASE_URL}/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export function getCurrentUser() {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });
}

export function getUserByID(id: string) {
  return fetch(`${BASE_URL}/users/${id}`, {
    method: "GET",
    credentials: "include",
  });
}
