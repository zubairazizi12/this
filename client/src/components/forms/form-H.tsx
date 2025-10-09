import React, { useState } from "react";
import { useTrainer } from "@/context/TrainerContext"; // ✅ اضافه شد
export default function EvaluationFormHStyled() {
  // مشخصات فردی
  const [residentName, setResidentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [department, setDepartment] = useState("");

  // آرایه سال‌ها
  const [years, setYears] = useState([
    { year: "سال اول", totalScore: "", instructor: "" },
    { year: "سال دوم", totalScore: "", instructor: "" },
    { year: "سال سوم", totalScore: "", instructor: "" },
    { year: "سال چهارم", totalScore: "", instructor: "" },
  ]);

  const [averageScore, setAverageScore] = useState("");
  const [shiftDepartment, setShiftDepartment] = useState("");
  const [programDirector, setProgramDirector] = useState("");
  // ✅ گرفتن trainerId از Context
  const { trainerId } = useTrainer();

  const handleYearChange = (index: number, field: string, value: string) => {
    const updated = [...years];
    (updated as any)[index][field] = value;
    setYears(updated);
  };

  const handleSubmit = async () => {
    if (!trainerId) {
      alert("ابتدا باید یک ترینر ثبت شود!");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/evaluationFormH", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainer: trainerId, // ✅ از context گرفته شد
          residentName,
          fatherName,
          department,
          trainingYears: years,
          averageScore,
          shiftDepartment,
          programDirector,
        }),
      });
      if (!res.ok) throw new Error("خطا در ذخیره فرم");
      alert("فرم با موفقیت ذخیره شد!");

      // ریست کردن تمام فیلدها بعد از ذخیره
      setResidentName("");
      setFatherName("");
      setDepartment("");
      setYears([
        { year: "سال اول", totalScore: "", instructor: "" },
        { year: "سال دوم", totalScore: "", instructor: "" },
        { year: "سال سوم", totalScore: "", instructor: "" },
        { year: "سال چهارم", totalScore: "", instructor: "" },
      ]);
      setAverageScore("");
      setShiftDepartment("");
      setProgramDirector("");
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره فرم");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      {/* عنوان و هدر */}
      <div className="text-center mb-2">
        <div className="mt-1 font-semibold">وزارت صحت عامه</div>
        <div className="font-semibold">معینیت اداری</div>
        <div className="font-semibold">ریاست اکمال تخصص</div>
      </div>
      <hr className="border-t-2 border-gray-300 my-3" />
      <div className="text-center font-semibold mb-4">
        فرم مخصوص درج نمرات سال‌های دوران ترینینگ - شفاخانه ملی و تخصص چشم نور
      </div>

      {/* بخش مشخصات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">نام دستیار</label>
          <input
            type="text"
            placeholder="نام دستیار"
            value={residentName}
            onChange={(e) => setResidentName(e.target.value)}
            className="border rounded px-2 py-2 text-center w-full h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">نام پدر</label>
          <input
            type="text"
            placeholder="نام پدر"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            className="border rounded px-2 py-2 text-center w-full h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">دپارتمان</label>
          <input
            type="text"
            placeholder="دپارتمان"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border rounded px-2 py-2 text-center w-full h-10"
          />
        </div>
      </div>

      {/* جدول سال‌های ترینینگ */}
      <table className="table-auto border-collapse border border-slate-300 text-sm w-full mb-4">
        <thead className="bg-slate-100">
          <tr>
            <th className="border px-2 py-2">سال</th>
            <th className="border px-2 py-2">مجموع نمرات</th>
            <th className="border px-2 py-2">نام استاد</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-2 text-center">{y.year}</td>
              <td className="border px-2 py-2">
                <input
                  type="number"
                  value={y.totalScore}
                  onChange={(e) =>
                    handleYearChange(idx, "totalScore", e.target.value)
                  }
                  className="border rounded px-1 w-full text-center h-9"
                />
              </td>
              <td className="border px-2 py-2">
                <input
                  type="text"
                  value={y.instructor}
                  onChange={(e) =>
                    handleYearChange(idx, "instructor", e.target.value)
                  }
                  className="border rounded px-1 w-full text-center h-9"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* اوسط */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">اوسط نمرات</label>
          <input
            type="number"
            placeholder="اوسط نمرات"
            value={averageScore}
            onChange={(e) => setAverageScore(e.target.value)}
            className="border rounded px-2 py-2 text-center w-full h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">شف دپارتمان</label>
          <input
            type="text"
            placeholder="شف دپارتمان"
            value={shiftDepartment}
            onChange={(e) => setShiftDepartment(e.target.value)}
            className="border rounded px-2 py-2 text-center w-full h-10"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium">آمر برنامه آموزشی</label>
          <input
            type="text"
            placeholder="آمر برنامه آموزشی"
            value={programDirector}
            onChange={(e) => setProgramDirector(e.target.value)}
            className="border rounded px-2 py-2 text-center w-full h-10"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          ذخیره فرم
        </button>
      </div>
    </div>
  );
}
