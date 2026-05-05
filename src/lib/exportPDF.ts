import jsPDF from "jspdf";

export function exportReport(data: any) {
  const doc = new jsPDF();

  doc.text("E-Commerce Report", 10, 10);

  data.forEach((item: any, i: number) => {
    doc.text(`${item.label}: ${item.value}`, 10, 20 + i * 10);
  });

  doc.save("report.pdf");
}