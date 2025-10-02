import React, { useState } from "react";

const RotationForm: React.FC = () => {
  // اطلاعات کلی فرم (بالای صفحه)
  const [header, setHeader] = useState({
    studentName: "",
    department: "",
    rotationFrom: "",
    rotationTo: "",
    date: "",
  });

  // جدول فارسی
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

  // جدول انگلیسی
  const englishCompetencies = [
    "Describe basics of radiographic & MRI",
    "Demonstrate indications for MRI",
    "Describe anatomy of skull base",
    "Demonstrate interpretation of chest imaging",
    "Describe interpretation of brain & orbit CT",
    "Demonstrate interpretation of MRI brain",
    "Recognize common artifacts in MRI",
  ];
  const [englishRows, setEnglishRows] = useState(
    englishCompetencies.map(() => ({
      week1: "",
      week2: "",
      week3: "",
      week4: "",
    }))
  );

  const handleHeaderChange = (field: string, value: string) => {
    setHeader({ ...header, [field]: value });
  };

  const handlePersianChange = (row: number, field: string, value: string) => {
    const updated = [...persianRows];
    (updated as any)[row][field] = value;
    setPersianRows(updated);
  };

  const handleEnglishChange = (row: number, field: string, value: string) => {
    const updated = [...englishRows];
    (updated as any)[row][field] = value;
    setEnglishRows(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { header, persianRows, englishRows };
    try {
      await fetch("/api/rotation-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      alert("✅ داده‌ها با موفقیت ذخیره شد");
    } catch (err) {
      console.error(err);
      alert("❌ خطا در ذخیره فرم");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto p-6 space-y-8 text-sm"
    >
      {/* اطلاعات کلی */}
      <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg shadow">
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

      {/* جدول فارسی */}
      <div className="border p-4 rounded-lg shadow">
        <h2 className="font-bold mb-4 text-right">فورم ارزیابی استیج</h2>
        <table className="w-full border text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">موضوع کنفرانس</th>
              <th className="border p-2">نمره داده شده</th>
              <th className="border p-2">نام استاد</th>
              <th className="border p-2">امضای استاد</th>
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
                      className="w-full p-1 border"
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
      </div>

      {/* جدول انگلیسی */}
      <div className="border p-4 rounded-lg shadow">
        <h2 className="font-bold mb-4">Rotation Competencies</h2>
        <table className="w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Competence</th>
              <th className="border p-2">1st Week</th>
              <th className="border p-2">2nd Week</th>
              <th className="border p-2">3rd Week</th>
              <th className="border p-2">4th Week</th>
            </tr>
          </thead>
          <tbody>
            {englishRows.map((row, i) => (
              <tr key={i}>
                <td className="border p-2 text-left">
                  {englishCompetencies[i]}
                </td>
                {["week1", "week2", "week3", "week4"].map((f) => (
                  <td key={f} className="border p-1">
                    <input
                      className="w-full p-1 border text-center"
                      value={(row as any)[f]}
                      onChange={(e) =>
                        handleEnglishChange(i, f, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
