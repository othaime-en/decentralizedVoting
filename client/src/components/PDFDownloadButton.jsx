// PDFDownloadButton.js
import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PDFDownloadButton = ({ data, columns, title }) => {
  const downloadPdfDocument = () => {
    const doc = new jsPDF();

    //Logo
    const logoBase64 =
      "PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyOCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMuMTg1OTUgOS4yMzQ3OEMxLjg0ODcgNi44OTEzNiAyLjU4NzQxIDMuOTI2ODkgNC44MzU5MSAyLjYxMzQ1QzcuMDg0NCAxLjMwMDAyIDkuOTkxMjIgMi4xMzQ5OSAxMS4zMjg1IDQuNDc4NDFMMTcuMTk4NSAxNC43NjUyQzE4LjUzNTggMTcuMTA4NiAxNy43OTcgMjAuMDczMSAxNS41NDg1IDIxLjM4NjVDMTMuMzAwMSAyMi42OTk5IDEwLjM5MzIgMjEuODY1IDkuMDU1OTggMTkuNTIxNUwzLjE4NTk1IDkuMjM0NzhaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMjI5MF8yMTcyKSIvPgo8cGF0aCBkPSJNMjcuMjM0OSA2LjY5MTdDMjcuMjM0OSA5LjMyMzQ3IDI1LjEzNDUgMTEuNDU2OSAyMi41NDM1IDExLjQ1NjlDMTkuOTUyNSAxMS40NTY5IDE3Ljg1MjEgOS4zMjM0NyAxNy44NTIxIDYuNjkxN0MxNy44NTIxIDQuMDU5OTIgMTkuOTUyNSAxLjkyNjQ1IDIyLjU0MzUgMS45MjY0NUMyNS4xMzQ1IDEuOTI2NDUgMjcuMjM0OSA0LjA1OTkyIDI3LjIzNDkgNi42OTE3WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzIyOTBfMjE3MikiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yMjkwXzIxNzIiIHgxPSI0LjgzNTkxIiB5MT0iMi42MTM0NSIgeDI9IjE1LjQ0MSIgeTI9IjIxLjAwMTkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzFEQzA3MSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3N0Q5QUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDFfbGluZWFyXzIyOTBfMjE3MiIgeDE9IjIyLjU0MzUiIHkxPSIxLjkyNjQ1IiB4Mj0iMjIuNTIwNSIgeTI9IjExLjI4NjMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzFEQzA3MSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM3N0Q5QUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K"; // This should be the base64 string of your logo
    if (logoBase64) {
      doc.addImage(logoBase64, "JPEG", 14, 10, 50, 25);
    }

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text(title, 14, 22);

    // Date
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 32);

    // Address - can be customized or removed as needed
    doc.setFontSize(11);
    doc.text("123 Riverside Dr", 14, 42);
    doc.text("Nairobi, Kenya", 14, 52);

    // Skip line
    doc.text(`Invoice Number: ${Math.ceil(Math.random() * 100000)}`, 14, 72);

    // Table
    doc.autoTable({
      startY: 82,
      head: [columns.map((column) => column.Header)], // Assumes columns have a 'Header' property
      body: data.map((row) => columns.map((column) => row[column.accessor])),
      theme: "grid",
      headStyles: { fillColor: [22, 22, 22], textColor: [255, 255, 255] },
      bodyStyles: { fillColor: [36, 36, 36], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [30, 30, 30] },
      styles: { cellPadding: { top: 2, right: 4, bottom: 2, left: 4 } }, // Adjust padding
    });

    // Footer
    doc.setFontSize(11);
    doc.text(
      "Thank you for using our services.",
      14,
      doc.lastAutoTable.finalY + 10
    );

    // Save the PDF
    doc.save(`${title}.pdf`);
  };

  return (
    <button
      onClick={downloadPdfDocument}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      style={{ margin: "10px 0", alignSelf: "start" }}
    >
      Download PDF
    </button>
  );
};

export default PDFDownloadButton;
