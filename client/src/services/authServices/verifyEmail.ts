import axios from "axios";
import { apiBaseUrl } from "../../constants";

const verifyEmail = async (token: string) => {
  const response = await axios.get(`${apiBaseUrl}/users/verify/${token}`);
  return response.data;
};

export default { verifyEmail };
