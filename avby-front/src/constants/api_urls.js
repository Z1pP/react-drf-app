import axios from "axios";

const localhost = "http://127.0.0.1:8000/";
const apiUrl = localhost + "v1/";

export const apiCarUrl = apiUrl + "cars/list";

export const apiCarSearch = apiUrl + "cars/search/";
export const apiCarDetailUrl = apiUrl + "cars/detail/";
export const LOGIN_URL = apiUrl + "token/verify";
export const OBSTAIN_TOKEN = apiUrl + "token/";

export const regUser = async (username, email, password) => {
  await axios
  .post(apiUrl + "users/register", {
    username: username,
    email: email,
    password: password,
  })
  .then((response) => {
    return response
  })
  .catch((error) => {
    throw error
  })
};

export const verityUser = async (username, password) => {
  try {
    const response = await axios.post(OBSTAIN_TOKEN, {
      username: username,
      password: password,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (token) => {
  const response = await axios.post(apiUrl + "token/refresh/", {
    refresh: token,
  });
  return response.data.access;
};

export const getUser = async (userId, token) => {
  try{
    const response = await axios.get(`${apiUrl}users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response
  }
  catch(error){
    throw error
  }
};

export const getCar = async (id, brand, model) => {
  const url = `${apiUrl}cars/${id}`;

  return await axios.get(url);
};

export const getCars = async (page, filters=null) => {
  let requesteURL = apiCarUrl + `?page=${page}`
  if (filters) {
    if (filters.brand) {
      requesteURL = apiUrl + `cars/${filters.brand}?page=${page}`
    }
    if (filters.model) {
      requesteURL = apiUrl + `cars/${filters.brand}/${filters.model}?page=${page}`
    }
  }
  const response = await axios.get(requesteURL);
  console.log(response.data);
  return response;
};
