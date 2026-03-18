import axios from 'axios';
import { apiBaseUrl } from "../constants";


const add = async(orgName: { name: string}) => {
    const response = await axios.post(`${apiBaseUrl}/organization`, orgName)
    return response.data //it returns organization name
    
}

export default {add}