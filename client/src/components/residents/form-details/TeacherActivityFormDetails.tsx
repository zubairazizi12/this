import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface Activity {
  _id: string | null;
  section: string;
  activity: string;
  evaluators: boolean[];
}

const TeacherActivityViewer: React.FC<{ residentId: string }> = ({
  residentId,
}) => {
  const [data, setData] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/teacher-activities?residentId=${residentId}`)
      .then((res) => res.json())
      .then((savedData) => {
        if (savedData?.activities) {
          setData(savedData.activities);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [residentId]);

  const exportExcel = () => {
    const worksheetData = [
      ["بخش", "فعالیت"],
      ...data.map((d) => [d.section, d.activity]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activities");
    XLSX.writeFile(wb, "Activities.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["بخش", "فعالیت"];
    const tableRows = data.map((d) => [d.section, d.activity]);
    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { halign: "center" },
      headStyles: { fillColor: [200, 200, 200] },
    });
    doc.save("Activities.pdf");
  };

  if (isLoading) return <div>در حال بارگذاری داده‌ها...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 rounded-xl shadow-md overflow-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        نمایش چک لیست امتحان عملی و نظری ترینی‌ها
      </h1>

      <div className="flex gap-2 mb-4 justify-center">
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          خروجی Excel
        </button>
        <button
          onClick={exportPDF}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          خروجی PDF
        </button>
      </div>

      <table className="table-auto border-collapse border border-gray-300 w-full text-center text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">بخش</th>
            <th className="border px-2 py-1">فعالیت</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="border px-2 py-1">{row.section}</td>
              <td className="border px-2 py-1">{row.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherActivityViewer;
