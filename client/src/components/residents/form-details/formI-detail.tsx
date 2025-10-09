import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";

const persianTopics = [
  "اشتراک در کنفرانس",
  "اشتراک در تدریس/سمینار",
  "کارهای عملی و تیوری",
  "اخلاق طبی",
  "حفظ نظم/اشتراک",
];

const englishCompetencies = [
  "Describe basics of radiographic & MRI",
  "Demonstrate indications for MRI",
  "Describe anatomy of skull base",
  "Demonstrate interpretation of chest imaging",
  "Describe interpretation of brain & orbit CT",
  "Demonstrate interpretation of MRI brain",
  "Recognize common artifacts in MRI",
];

interface RotationFormViewProps {
  trainerId: string;
}

const RotationFormView: React.FC<RotationFormViewProps> = ({ trainerId }) => {
  const [forms, setForms] = useState<any[]>([]);
  const printRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!trainerId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/rotation-form/${trainerId}`
        );
        if (!res.ok) throw new Error("خطا در دریافت داده");
        const data = await res.json();
        setForms(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [trainerId]);

  const handlePrint = (formId: string) => {
    const ref = printRefs.current[formId];
    if (ref) {
      const printContent = useReactToPrint({
        content: () => ref,
        documentTitle: `RotationForm_${formId}`,
      });
      printContent();
    }
  };

  const handleExportExcel = (form: any) => {
    const wsData: any[] = [
      ["Student", "Department", "Rotation From", "Rotation To", "Date"],
      [
        form.header.studentName,
        form.header.department,
        form.header.rotationFrom,
        form.header.rotationTo,
        form.header.date,
      ],
      [],
      ["Persian Table"],
      ["Topic", "Mark", "Teacher Name", "Teacher Sign", "Note"],
      ...form.persianRows.map((r: any, i: number) => [
        persianTopics[i] || "",
        r.mark,
        r.teacherName,
        r.teacherSign,
        r.note,
      ]),
      [],
      ["English Table"],
      [
        "Competence",
        "Week1 Cases",
        "Week1 Level",
        "Week2 Cases",
        "Week2 Level",
        "Week3 Cases",
        "Week3 Level",
        "Week4 Cases",
        "Week4 Level",
        "Total",
      ],
      ...form.rows.map((r: any, i: number) => [
        englishCompetencies[i] || "",
        r.weeks[0]?.cases,
        r.weeks[0]?.level,
        r.weeks[1]?.cases,
        r.weeks[1]?.level,
        r.weeks[2]?.cases,
        r.weeks[2]?.level,
        r.weeks[3]?.cases,
        r.weeks[3]?.level,
        r.total,
      ]),
      [
        "Grand Total",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        form.rows.reduce((s: number, r: any) => s + r.total, 0),
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RotationForm");
    XLSX.writeFile(wb, `RotationForm_${form.header.studentName}.xlsx`);
  };

  return (
    <div className="p-6 max-w-full bg-gray-50 min-h-screen flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-gray-800">
        Rotation Forms of Trainer
      </h2>
      {forms.length === 0 && (
        <p className="text-gray-600">فرمی برای این ترینر موجود نیست.</p>
      )}

      {forms.map((form) => {
        const grandTotal = form.rows.reduce(
          (s: number, r: any) => s + r.total,
          0
        );

        return (
          <div
            key={form._id}
            className="border rounded-xl bg-white p-6 shadow-md space-y-6"
          >
            {/* دکمه‌ها */}
            <div className="flex gap-2">
              <button
                onClick={() => handlePrint(form._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                🖨️ PDF
              </button>
              <button
                onClick={() => handleExportExcel(form)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                📊 Excel
              </button>
            </div>

            {/* محتوای فرم */}
            <div
              ref={(el) => (printRefs.current[form._id] = el)}
              className="space-y-4"
            >
              {/* Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {Object.entries(form.header).map(([key, value]) => (
                  <input
                    key={key}
                    value={value}
                    readOnly
                    className="border border-gray-300 rounded-lg p-2 bg-gray-50"
                  />
                ))}
              </div>

              {/* Persian Table */}
              <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-2">
                  فورم ارزیابی استیج
                </h3>
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full border-collapse border border-gray-300 text-right text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        {[
                          "موضوع کنفرانس",
                          "نمره",
                          "نام استاد",
                          "امضا",
                          "ملاحظات",
                        ].map((t) => (
                          <th key={t} className="border p-2 text-gray-700">
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.persianRows.map((row: any, i: number) => (
                        <tr key={row._id} className="hover:bg-gray-50">
                          <td className="border p-2">
                            {persianTopics[i] || ""}
                          </td>
                          <td className="border p-2">{row.mark}</td>
                          <td className="border p-2">{row.teacherName}</td>
                          <td className="border p-2">{row.teacherSign}</td>
                          <td className="border p-2">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {form.persianNote && (
                  <p className="mt-2 text-gray-600 text-right">
                    {form.persianNote}
                  </p>
                )}
              </div>

              {/* English Table */}
              <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-2">
                  Rotation Competencies
                </h3>
                <p className="mb-4 text-gray-600">
                  Rotation: {form.rotationName}
                </p>
                <div className="overflow-x-auto rounded-lg">
                  <table className="w-full border-collapse border border-gray-300 text-center text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th rowSpan={2} className="border p-2 text-left">
                          Competence
                        </th>
                        {["1st", "2nd", "3rd", "4th"].map((w) => (
                          <th key={w} colSpan={2} className="border p-2">
                            {w} Week
                          </th>
                        ))}
                        <th rowSpan={2} className="border p-2">
                          Total
                        </th>
                      </tr>
                      <tr className="bg-gray-100">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <React.Fragment key={i}>
                            <th className="border p-1">Cases</th>
                            <th className="border p-1">Level</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {form.rows.map((row: any, ri: number) => (
                        <tr key={row._id} className="hover:bg-gray-50">
                          <td className="border p-2 text-left font-medium">
                            {englishCompetencies[ri] || ""}
                          </td>
                          {row.weeks.map((w: any) => (
                            <React.Fragment key={w._id}>
                              <td className="border p-2">{w.cases}</td>
                              <td className="border p-2">{w.level}</td>
                            </React.Fragment>
                          ))}
                          <td className="border p-2 bg-gray-100 font-bold">
                            {row.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100 font-bold">
                        <td className="border p-2 text-right" colSpan={9}>
                          Grand Total
                        </td>
                        <td className="border p-2">{grandTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RotationFormView;
