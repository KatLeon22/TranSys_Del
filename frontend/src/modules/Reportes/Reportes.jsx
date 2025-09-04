import React from "react";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import api from "../../services/api";

export default function Reportes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/reportes").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Reporte de Viajes por Chofer</h2>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="viajes" fill="#8884d8" name="Viajes" />
      </BarChart>
    </div>
  );
}
