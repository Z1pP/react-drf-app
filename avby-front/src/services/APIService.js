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

export const getUser = async () => api.get(`user/me`);

export const deleteCar = async (id) => api.delete(`cars/delete/${id}`);

export const createCar = async (data) => {
  const cfg = { headers: { "Content-Type": "multipart/form-data" } };
  return api.post("cars/create", data, cfg);
};

export const authUser = async (username, email, password) =>
  api.post("users/register", { username, email, password });

export const loginUser = async (username, password) =>
  api.post("auth/token/", { username, password });

export const verifyToken = async (token) =>
  await axios.post(apiURL + "token/verify", { token });

export const getRefreshToken = async (refresh) =>
  api.post("token/refresh", refresh);

export const updateUserPersonalData = async (data, config) => {
  const cfg = {
    ...config,
    headers: { ...config?.headers, "Content-Type": "application/json" },
  };
  return api.patch(`user/update`, data, cfg);
};

export const updateUserAvatar = async (data, config) => {
  const cfg = {
    ...config,
    headers: { ...config?.headers, "Content-Type": "multipart/form-data" },
  };
  return api.patch(`user/update/avatar`, data, cfg);
};

export const updateUserPassword = async (data, config) => {
  const cfg = {
    ...config,
    headers: { ...config?.headers, "Content-Type": "application/json" },
  };
  return api.patch(`user/update/password`, data, cfg);
};

export const getBrandList = async () => api.get("brands");

export const getModelList = async (brand) => api.get(`cars/models/${brand}`);

export const getFavorites = async (id) => api.get(`users/favorites/${id}`);

export const getAnnouncements = async (id) =>
  api.get(`cars/announcements/${id}`);

export const getParams = async () => await api.get(`cars/params`);

export const getRoomsByUserId = async (id) =>
  api.get(`rooms/${id}`);

export const createRoom = async (data) =>{
  return await api.post(`rooms`, {
    name: data.name,
    current_users: data.current_users
  });
}

export const removeRoom = async (id) =>{
  return await api.delete(`room/delete/${id}`);
}

export const sendMessageForBot = async (message) =>{
  return await axios.post(`http://127.0.0.1:8090/send_message`,
    { message: message }
  );
}
