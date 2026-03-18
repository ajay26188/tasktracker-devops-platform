
import axios from 'axios';
import { apiBaseUrl } from "../../constants";
import type { LoginData } from '../../types/login';

const login = async(credentials: LoginData) => {
    const response = await axios.post(`${apiBaseUrl}/login`,credentials)
    return response.data //it returns user info such as email, name, role, organizationId and token 
}

export default {login}