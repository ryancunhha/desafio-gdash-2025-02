import { useEffect, useState } from "react";
import { getClimaLogs } from "../../services/clima/climaService";
import type { Clima } from "../../type";

function Dashboard() {
    const [climaData, setClimaData] = useState<Clima[] | null>(null)

    useEffect(() => {
        const fetchClimaData = async () => {
            try {
                const data = await getClimaLogs()
                setClimaData(data);
            }
            catch (error) {
                console.log("Erro dos dados", error)
            }
        }

        fetchClimaData()
    }, [])

    if (!climaData) {
        return <div>Carregando</div>
    }

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Dashboard de Clima</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {climaData.map((clima) => (
                        <div key={clima._id} className="bg-white shadow-lg rounded-lg p-4">
                            <h2 className="text-xl font-medium">Data: {clima.data_hora}</h2>
                            <p>Temperatura: {clima.temperatura}°C</p>
                            <p>Velocidade do vento: {clima.velocidade_vento} km/h</p>
                            <p>Umidade: {clima.umidade}%</p>
                            <p>Probabilidade: {clima.probabilidade}%</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Dashboard
