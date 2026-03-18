import axios from 'axios';
import { apiBaseUrl } from "../../constants";
import type { SignupData } from '../../types/signup';

const signup = async(credentials: SignupData) => {
    const response = await axios.post(`${apiBaseUrl}/users`, credentials)
    return response.data // returns user info such as name, email, role & organizationId
    
}

export default {signup}