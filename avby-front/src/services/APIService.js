import axios from "axios";

const apiURL = "http://127.0.0.1:8000/v1/";

// get запрос для получения списка машин
export const getCarsList = async (page, filters = null) => {
  let requesteURL = apiURL + `cars/list?page=${page}`;
  if (filters) {
    if (filters.brand) {
      requesteURL = apiURL + `cars/${filters.brand}?page=${page}`;
    }
    if (filters.model) {
      requesteURL =
      apiURL + `cars/${filters.brand}/${filters.model}?page=${page}`;
    }
  }
  const response = await axios.get(requesteURL);
  console.log(response.data);
  return response;
};

// get запрос для получения машины по id
export const getCar = async (id) => {
  try {
    const responce = await axios.get(apiURL + `cars/${id}`);
    return responce;
  } catch (error) {
    console.log(`Ошибка при получении машины: ${error}`);
    throw error;
  }
};

// get запрос для получени пользователя по id
export const getUser = async (id, token) => {
  try {
    const responce = await axios.get(apiURL + `users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return responce;
  } catch (error) {
    console.log(`Ошибка при получении пользователя: ${error}`);
    throw error;
  }
};

// post запрос для регистрации пользователя по имени и паролю
export const authUser = async (username, email, password) => {
  try {
    const responce = await axios.post(apiURL + "users/register", {
      username: username,
      email: email,
      password: password,
    });
    return responce;
  } catch (error) {
    console.log(`Ошибка при регистрации пользователя: ${error}`);
    throw error;
  }
};

// post запрос для авторизации пользователя по имени и паролю
export const loginUser = async (username, password) => {
  try {
    const responce = await axios.post(apiURL + "users/login", {
      username: username,
      password: password,
    });
    return responce;
  } catch (error) {
    console.log(`Ошибка при авторизации пользователя: ${error}`);
    throw error;
  }
};

// post запрос для обновления токена
export const getRefreshToken = async (refresh) => {
  try {
    const responce = await axios.post(apiURL + "token/refresh", {
      refresh: refresh,
    });
    return responce;
  } catch (error) {
    console.log(`Ошибка при обновлении токена: ${error}`);
    throw error;
  }
};
