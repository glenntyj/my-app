import axios from "../../api/axiosInstance";

export const loginUser = (data) => axios.post("/auth/login", data);
export const registerUser = (data) => axios.post("/auth/register", data);
