import axios from "axios";
import type { Clima } from "../../type"

export const getClimaLogs = async (): Promise<Clima[]> => {
    const response = await axios.get("http://localhost:3000/api/clima/logs")
    return response.data
}