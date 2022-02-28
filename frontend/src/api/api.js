import axios from "axios";

axios.defaults.baseURL = "/api";

export function apiLogin(username, password) {
  return axios.post("/auth/login", {
    username,
    password,
  });
}

export function apiRegister(username, password) {
  return axios.post("/users", {
    username,
    password,
  });
}

export function apiGetCharacters(page) {
  return axios.get("/ram/characters", {
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
}

export function apiToggleFavorite(characterId, page) {
  return axios.put(
    "/ram/characters",
    {
      characterId,
      page,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
}
