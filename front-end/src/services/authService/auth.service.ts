
import axios from "axios";

const API = "http://localhost:3000/api"

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API}/users/login`, {
            email,
            password,
        })
        return response.data
    } catch (erro) {
        throw new Error("Erro na autheicação")
    }
}