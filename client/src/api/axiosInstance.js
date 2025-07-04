import axios from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL:"http://localhost:5000/api",
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    successMessage(response);
    return response;
  },
  (error) => errorFunction(error)
);

const successMessage = function (response) {
  const data = response?.data;
  const msg = data?.message;
  if (msg && data?.success) {
    console.log(msg);
  }
};

const errorFunction = function (error) {
  const message = error?.response?.data?.message;
  if (message) {
    toast.error(message);
    console.log(message)
  }
  throw error;
};

export default axiosInstance;