"use client";

import {
  Activity,
  BarChart3,
  CircleDollarSign,
  Donut,
  Eye,
  Percent,
  TrendingUp,
  Waves,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import styles from "../sharedAdmin.module.css";

type AnalyticsData = {
  sales: number[];
  visits: number;
  conversion: number;
  revenue: number;
  orders?: number;
  completed?: number;
  pending?: number;
  delivered?: number;
};

const barHeightClasses = [
  "barH40",
  "barH70",
  "barH55",
  "barH90",
  "barH60",
  "barH75",
  "barH50",
];

function getBarHeightClass(height: number, index: number) {
  if (height >= 90) return "barH90";
  if (height >= 75) return "barH75";
  if (height >= 70) return "barH70";
  if (height >= 60) return "barH60";
  if (height >= 55) return "barH55";
  if (height >= 50) return "barH50";
  if (height >= 40) return "barH40";

  return barHeightClasses[index % barHeightClasses.length];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    sales: [40, 70, 55, 90, 60],
    visits: 0,
    conversion: 0,
    revenue: 0,
    orders: 0,
    completed: 0,
    pending: 0,
    delivered: 0,
  });

  useEffect(() => {
    fetch("/api/analytics", { cache: "no-store" })
      .then((res) => res.json())
      .then((result) => setData(result.data || result))
      .catch(() => {});
  }, []);

  const donutTone = useMemo(() => {
    if (data.conversion >= 75) return "donutHigh";
    if (data.conversion >= 45) return "donutMid";
    return "donutLow";
  }, [data.conversion]);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Reports</p>
          <h1>
            <Activity size={30} /> Analytics
          </h1>
        </div>

        <span className={styles.status}>
          <TrendingUp size={14} /> Live Metrics
        </span>
      </div>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>
            <Eye size={22} /> {data.visits}
          </h2>
          <p>Visits</p>
        </div>

        <div className={styles.card}>
          <h2>
            <Percent size={22} /> {data.conversion}%
          </h2>
          <p>Conversion</p>
        </div>

        <div className={styles.card}>
          <h2>
            <CircleDollarSign size={22} /> {data.revenue.toLocaleString()} TZS
          </h2>
          <p>Revenue</p>
        </div>

        <div className={styles.card}>
          <h2>
            <BarChart3 size={22} /> {data.orders || 0}
          </h2>
          <p>Total Orders</p>
        </div>
      </section>

      <section className={styles.analyticsGrid}>
        <div className={styles.card}>
          <h2>
            <BarChart3 size={22} /> Sales Bar Chart
          </h2>

          <div className={styles.chart}>
            {data.sales.map((height, index) => {
              const heightClass = getBarHeightClass(height, index);

              return (
                <div
                  key={`${height}-${index}`}
                  className={`${styles.bar} ${styles[heightClass]}`}
                  title={`Sales level ${height}%`}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.card}>
          <h2>
            <Waves size={22} /> Sales Wave Chart
          </h2>

          <div className={styles.waveChart}>
            <div className={styles.waveLine} />
            <div className={styles.waveFill} />
          </div>

          <div className={styles.chartLegend}>
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>

        <div className={styles.card}>
          <h2>
            <Donut size={22} /> Conversion Donut
          </h2>

          <div className={`${styles.donutChart} ${styles[donutTone]}`}>
            <div>
              <strong>{data.conversion}%</strong>
              <span>Conversion</span>
            </div>
          </div>

          <div className={styles.chartLegend}>
            <span>Pending: {data.pending || 0}</span>
            <span>Delivered: {data.delivered || 0}</span>
            <span>Completed: {data.completed || 0}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
