import axios from "axios";

const API = "http://localhost:3000/api/clima/logs"

export const getInsight = async () => {
    const response = await axios.get(API)
    return response.data
}