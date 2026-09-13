import axios from "axios";
import { SERVER_URL } from "../constants";

export async function fetchRegistrationPage(endpoint, params) {
  const res = await axios.get(`${SERVER_URL}${endpoint}`, { params });
  return {
    data: res.data.data,
    total: res.data.total,
    totalAll: res.data.totalAll,
  };
}

export async function deleteRegistration(endpoint, id) {
  await axios.delete(`${SERVER_URL}${endpoint}/${id}`);
}
