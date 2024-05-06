import axios from "axios";

const apiURL = "http://127.0.0.1:8000/v1/";
const api = axios.create({
  baseURL: apiURL,
});

const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const getCarsList = async (page, params) =>
  api.get(`cars/list?page=${page}`, { params });

export const getFilteredList = async (page, params) =>
  api.get(`cars/filter?page=${page}`, { params });

export const getCar = async (id) => api.get(`cars/${id}`);

export const getUser = async (id) => api.get(`users/${id}`);

export const createCar = async (data) => {
  const cfg = { headers: { "Content-Type": "multipart/form-data" } };
  return api.post("cars/create", data, cfg);
};

export const authUser = async (username, email, password) =>
  api.post("users/register", { username, email, password });

export const loginUser = async (username, password) =>
  api.post("token/", { username, password });

export const verifyToken = async (token) =>
  await axios.post(apiURL + "token/verify", { token });

export const getRefreshToken = async (refresh) =>
  api.post("token/refresh", refresh);

export const updateUserData = async (id, data, config) => {
  const cfg = { ...config, headers: { ...config?.headers, "Content-Type": "multipart/form-data" } };
  return api.patch(`users/update/${id}`, data, cfg);
};

export const getBrandList = async () => api.get("brands");

export const getModelList = async (brand) => api.get(`cars/models/${brand}`);

export const getFavorites = async (id) => api.get(`users/favorites/${id}`);

export const getAnnouncements = async (id) =>
  api.get(`cars/announcements/${id}`);

export const getParams = async () => await api.get(`cars/params`);