import { useEffect, useState } from "react";
import { getInsight } from "../../services/insight/insightService";

function Insight() {
    const [insight, setInsight] = useState<any>(null)

    useEffect(() => {
        const fetchInsight = async () => {
            try {
                const data = await getInsight()
                setInsight(data)
            } catch (error) {
                console.log("Erro no insight", error)
            }
        }

        fetchInsight()
    }, [])

    if (!insight) {
        return <div>carregando</div>
    }

    return (
        <>
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Insights de IA</h1>
                <div>
                    <p><strong>Temperatura média:</strong> {insight.Temperatura}°C</p>
                    <p><strong>Umidade média:</strong> {insight.Umidade}%</p>
                </div>
            </div>
        </>
    )
}

export default Insight