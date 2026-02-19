import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/user/userService";
import type { User } from "../../type";

function Login() {
    const [users, setUsers] = useState<User[] | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers()
                setUsers(data)
            } catch (erro) {
                console.log("Erro usuarios", erro)
            }
        }

        fetchUsers()
    }, [])

    const Delete = async (id: string) => {
        try {
            await deleteUser(id)
            setUsers(users?.filter(user => user._id !== id) || [])
        } catch (erro) {
            console.log("erro delete usuario", erro)
        }
    }

    if (!users) {
        return <div>carreganddo</div>
    }

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Usuários</h1>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button
                                        className="text-red-500"
                                        onClick={() => Delete(user._id)}
                                    >
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Login