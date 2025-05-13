import { jsPDF } from "jspdf";

const PdfGenerator = (row) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Ad Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Ad Name: ${row.name}`, 20, 40);
  doc.text(`Ad Type: ${row.email}`, 20, 50); // assuming "email" is ad type
  doc.text(`Total Reach: ${row.phone}`, 20, 60);
  doc.text(`Total Views: ${row.address}`, 20, 70);

  doc.save(`${row.name}_report.pdf`);
};

export default  PdfGenerator