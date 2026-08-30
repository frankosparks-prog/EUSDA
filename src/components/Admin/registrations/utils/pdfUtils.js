import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { EUSDA_LOGO_PATH } from "../constants";

async function getImageDataUrl(url) {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error("Logo not found");
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn("Could not load logo:", e);
    return null;
  }
}

export async function exportRegistrationsPdf({
  title,
  meta,
  columns,
  rows,
  columnStyles,
  filename,
  logoPath = EUSDA_LOGO_PATH,
}) {
  const logoData = await getImageDataUrl(logoPath);
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const headerTop = 30;

  if (logoData) {
    doc.addImage(logoData, "PNG", margin, headerTop - 10, 60, 60);
  }

  doc.setFontSize(18);
  doc.setTextColor(22, 66, 37);
  doc.text(title, pageWidth / 2, headerTop + 10, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(meta, pageWidth / 2, headerTop + 30, { align: "center" });

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 110,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: {
      fillColor: [22, 101, 52],
      textColor: 255,
      halign: "center",
    },
    columnStyles,
    margin: { left: margin, right: margin },
    didDrawPage: () => {
      const str = `Page ${doc.internal.getNumberOfPages()}`;
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        str,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 20,
        { align: "right" },
      );
    },
  });

  doc.save(filename);
}
