import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

// Função que gera um valor aleatório simulando a leitura da temperatura
function generateTemperatureReading() {
  const now = new Date();
  return {
    timestamp: now.toLocaleTimeString(),
    temperature: +(22 + Math.random() * 4).toFixed(2), // Temperatura simulada entre 22°C e 26°C
  };
}

export default function GraficoTemperatura() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData, generateTemperatureReading()];

        // Limita o número de pontos no gráfico para os últimos 10
        if (newData.length > 10) newData.shift();

        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
 
      <ResponsiveContainer width="80%" height={400}>
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={[20, 30]} />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>

  );
}
