import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService/auth.service";

function Users() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const juntarLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login(email, password);
            if (response?.access_token) {
                localStorage.setItem("token", response.access_token);
                navigate("/dashboard");
            }
        } catch (error) {
            console.log("Erro no login", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            <form onSubmit={juntarLogin}> 
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border p-2"
                    />
                </div>
                <div className="mt-2">
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border p-2"
                    />
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white p-2">Login</button>
            </form>
        </div>
    );
}

export default Users;
