import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// Função para gerar uma leitura aleatória simulada
function generateSensorReading() {
  const now = new Date();
  return {
    timestamp: now.toLocaleTimeString(),
    value: +(22 + Math.random() * 4).toFixed(2), // Gera valores entre 22 e 26
  };
}

export default function GraficoTimestamp() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Adiciona um novo valor a cada 5 segundos
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData, generateSensorReading()];

        // Mantém no máximo 10 pontos no gráfico
        if (newData.length > 10) {
          newData.shift();
        }

        return newData;
      });
    }, 5000);

    return () => clearInterval(interval); // Limpa o interval quando o componente desmonta
  }, []);

  return (
    <ResponsiveContainer width="80%" height={400}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="timestamp" />
        <YAxis domain={[20, 30]} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
