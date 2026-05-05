import styles from "./statcard.module.css";

export default function StatCard({
  title,
  value,
  color = "blue",
}: {
  title: string;
  value: string;
  color?: "blue" | "green" | "orange" | "red";
}) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.value}>{value}</p>
    </div>
  );
}