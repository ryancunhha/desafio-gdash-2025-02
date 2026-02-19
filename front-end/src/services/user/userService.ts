import axios from "axios";
import type { User } from "../../type"

const API = "http://localhost:3000/api/users"

export const getUsers = async (): Promise<User[]> => {
    const response = await axios.get(`${API}/user`)
    return response.data
}

export const deleteUser = async (id: string) => {
    await axios.delete(`${API}/user/${id}`)
}