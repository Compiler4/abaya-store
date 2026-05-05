"use client";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ChartRevenue({ data }: any) {
  return (
    <Bar
      data={{
        labels: data.labels,
        datasets: [
          {
            label: "Revenue",
            data: data.values,
            backgroundColor: "#0d6efd"
          }
        ]
      }}
    />
  );
}