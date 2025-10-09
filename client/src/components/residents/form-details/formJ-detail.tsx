import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { useTrainer } from "@/context/TrainerContext";

type Activity = {
  _id: string;
  section: string;
  activity: string;
  evaluators: boolean[];
};

type FormData = {
  _id: string;
  trainerId: string;
  teachers: string[];
  activities: Activity[];
};

export default function TeacherActivityFormView() {
  const { trainerId } = useTrainer();
  const [formData, setFormData] = useState<FormData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // دریافت داده از سرور
  useEffect(() => {
    if (!trainerId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/teacher-activities/${trainerId}`
        );
        if (!res.ok) throw new Error("خطا در دریافت داده");

        const data: FormData = await res.json();
        setFormData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [trainerId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: formData
      ? `TeacherActivityForm_${formData._id}`
      : "TeacherActivityForm",
  });

  const handleExportExcel = () => {
    if (!formData) return;

    const wsData = [
      ["#", "Section", "Activity", ...formData.teachers],
      ...formData.activities.map((act, idx) => [
        idx + 1,
        act.section,
        act.activity,
        ...act.evaluators.map((v) => (v ? "✓" : "")),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TeacherActivityForm");
    XLSX.writeFile(wb, `TeacherActivityForm_${formData._id}.xlsx`);
  };

  if (!formData) return <p className="p-6">در حال بارگذاری داده‌ها...</p>;

  return (
    <div className="p-6 max-w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">چک لیست امتحان عملی و نظری</h2>
        <div className="space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            🖨️ PDF
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          >
            📊 Excel
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        className="overflow-auto border rounded-lg max-h-[70vh]"
      >
        <div className="p-4">
          <p>
            <strong>Form ID:</strong> {formData._id}
          </p>
          <p>
            <strong>Trainer ID:</strong> {formData.trainerId}
          </p>
          <p>
            <strong>Teachers:</strong> {formData.teachers.join(", ")}
          </p>
        </div>

        <table className="min-w-full text-right table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="p-2 border">بخش</th>
              <th className="p-2 border">فعالیت</th>
              {formData.teachers.map((t, i) => (
                <th key={i} className="p-2 border">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              formData.activities.reduce(
                (acc: Record<string, Activity[]>, act) => {
                  if (!acc[act.section]) acc[act.section] = [];
                  acc[act.section].push(act);
                  return acc;
                },
                {}
              )
            ).map(([section, acts]) =>
              acts.map((act, idx) => (
                <tr
                  key={act._id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {idx === 0 && (
                    <td
                      className="p-2 border font-medium"
                      rowSpan={acts.length}
                    >
                      {section}
                    </td>
                  )}
                  <td className="p-2 border">{act.activity}</td>
                  {act.evaluators.map((v, tIdx) => (
                    <td key={tIdx} className="p-2 border text-center">
                      {v ? "✓" : ""}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
