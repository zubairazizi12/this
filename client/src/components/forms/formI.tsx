import React, { useState, useMemo } from "react";
import { useTrainer } from "@/context/TrainerContext"; // 👈 اضافه کن

const RotationForm: React.FC = () => {
  const { trainerId } = useTrainer(); // trainerId مستقیم از context
  /*** 🔹 اطلاعات بالای فرم (General Info) ***/
  const [header, setHeader] = useState({
    studentName: "",
    department: "",
    rotationFrom: "",
    rotationTo: "",
    date: "",
  });
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  // این مقدار را می‌توانی از dropdown یا لیست ترینرها بگیری

  const handleHeaderChange = (field: string, value: string) => {
    setHeader({ ...header, [field]: value });
  };

  /*** 🔹 جدول فارسی ***/
  const persianTopics = [
    "اشتراک در کنفرانس",
    "اشتراک در تدریس/سمینار",
    "کارهای عملی و تیوری",
    "اخلاق طبی",
    "حفظ نظم/اشتراک",
  ];
  const [persianRows, setPersianRows] = useState(
    persianTopics.map(() => ({
      mark: "",
      teacherName: "",
      teacherSign: "",
      note: "",
    }))
  );
  const [persianNote, setPersianNote] = useState("");

  const handlePersianChange = (row: number, field: string, value: string) => {
    const updated = [...persianRows];
    (updated as any)[row][field] = value;
    setPersianRows(updated);
  };

  /*** 🔹 جدول انگلیسی پایین (Rotation Competencies) ***/
  const [rotationName, setRotationName] = useState("");

  const englishCompetencies = [
    "Describe basics of radiographic & MRI",
    "Demonstrate indications for MRI",
    "Describe anatomy of skull base",
    "Demonstrate interpretation of chest imaging",
    "Describe interpretation of brain & orbit CT",
    "Demonstrate interpretation of MRI brain",
    "Recognize common artifacts in MRI",
  ];

  // هر ردیف → 4 هفته، هر هفته شامل cases و level
  const [rows, setRows] = useState(
    englishCompetencies.map(() => ({
      weeks: [
        { cases: "", level: "" },
        { cases: "", level: "" },
        { cases: "", level: "" },
        { cases: "", level: "" },
      ],
      total: 0,
    }))
  );

  const handleEnglishChange = (
    rowIndex: number,
    weekIndex: number,
    field: "cases" | "level",
    value: string
  ) => {
    const updated = [...rows];
    updated[rowIndex].weeks[weekIndex][field] = value;

    // محاسبه مجموع هر ردیف
    const total = updated[rowIndex].weeks.reduce((sum, w) => {
      const c = parseInt(w.cases, 10);
      return sum + (isNaN(c) ? 0 : c);
    }, 0);
    updated[rowIndex].total = total;
    setRows(updated);
  };

  const grandTotal = useMemo(
    () => rows.reduce((s, r) => s + r.total, 0),
    [rows]
  );

  /*** 🔹 ذخیره فرم ***/
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trainerId) {
      alert("⚠️ لطفاً ابتدا یک ترینر ثبت کنید یا انتخاب کنید");
      return;
    }

    const payload = {
      trainerId, // 👈 trainerId از Context
      header,
      persianRows,
      persianNote,
      rotationName,
      rows,
    };

    console.log("📦 ارسال به سرور:", payload);

    try {
      await fetch(`http://localhost:5000/api/rotation-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("✅ فرم با موفقیت ذخیره شد");
    } catch (err) {
      console.error(err);
      alert("❌ خطا در ذخیره فرم");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-6 space-y-10 text-sm"
    >
      {/* ===================== 🔹 بخش اول: اطلاعات عمومی ===================== */}
      <div className="border p-4 rounded-lg shadow grid grid-cols-2 gap-4">
        <input
          className="border p-2"
          placeholder="نام محصل / Student Name"
          value={header.studentName}
          onChange={(e) => handleHeaderChange("studentName", e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="دیپارتمنت / Department"
          value={header.department}
          onChange={(e) => handleHeaderChange("department", e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Rotation From"
          value={header.rotationFrom}
          onChange={(e) => handleHeaderChange("rotationFrom", e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Rotation To"
          value={header.rotationTo}
          onChange={(e) => handleHeaderChange("rotationTo", e.target.value)}
        />
        <input
          className="border p-2 col-span-2"
          placeholder="Date / تاریخ"
          value={header.date}
          onChange={(e) => handleHeaderChange("date", e.target.value)}
        />
      </div>

      {/* ===================== 🔹 جدول فارسی ===================== */}
      <div className="border p-4 rounded-lg shadow">
        <h2 className="font-bold mb-4 text-right">فورم ارزیابی استیج</h2>
        <table className="w-full border text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">موضوع کنفرانس</th>
              <th className="border p-2">نمره</th>
              <th className="border p-2">نام استاد</th>
              <th className="border p-2">امضا</th>
              <th className="border p-2">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {persianRows.map((row, i) => (
              <tr key={i}>
                <td className="border p-2">{persianTopics[i]}</td>
                {["mark", "teacherName", "teacherSign", "note"].map((f) => (
                  <td key={f} className="border p-1">
                    <input
                      className="w-full border p-1"
                      value={(row as any)[f]}
                      onChange={(e) =>
                        handlePersianChange(i, f, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* یادداشت پایین جدول */}
        <div className="mt-4">
          <label className="block mb-2 text-right font-medium">
            یادداشت (مثلاً: از 5% نمره داده شده است)
          </label>
          <textarea
            className="w-full border p-2 rounded-lg text-right"
            rows={3}
            value={persianNote}
            onChange={(e) => setPersianNote(e.target.value)}
          />
        </div>
      </div>

      {/* ===================== 🔹 جدول انگلیسی ===================== */}
      <div className="border p-4 rounded-lg shadow">
        <label className="block mb-4 font-bold">Rotation Name</label>
        <input
          className="border p-2 w-full mb-6"
          placeholder="Enter rotation name..."
          value={rotationName}
          onChange={(e) => setRotationName(e.target.value)}
        />

        <h2 className="font-bold mb-4">Rotation Competencies</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-center">
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
                  Total of Cases
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
              {rows.map((row, ri) => (
                <tr key={ri}>
                  <td className="border p-2 text-left">
                    {englishCompetencies[ri]}
                  </td>
                  {row.weeks.map((w, wi) => (
                    <React.Fragment key={wi}>
                      <td className="border p-1">
                        <input
                          type="number"
                          min={0}
                          className="w-full border p-1 text-center"
                          value={w.cases}
                          onChange={(e) =>
                            handleEnglishChange(ri, wi, "cases", e.target.value)
                          }
                        />
                      </td>
                      <td className="border p-1">
                        <select
                          className="w-full border p-1 text-center"
                          value={w.level}
                          onChange={(e) =>
                            handleEnglishChange(ri, wi, "level", e.target.value)
                          }
                        >
                          <option value="">--</option>
                          <option value="Basic">Basic</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </td>
                    </React.Fragment>
                  ))}
                  <td className="border p-1 bg-gray-50 font-bold">
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-2 text-right" colSpan={9}>
                  Grand Total of Cases
                </td>
                <td className="border p-2">{grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* دکمه ذخیره */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        ذخیره فرم
      </button>
    </form>
  );
};

export default RotationForm;
