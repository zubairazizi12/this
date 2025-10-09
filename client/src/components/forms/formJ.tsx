import React, { useState } from "react";
import { useTrainer } from "@/context/TrainerContext"; // ✅ اضافه شد

const teacherActivities: Record<string, string[]> = {
  "آغاز فعالیت": ["Uniform", "Salam", "Introduction", "Patient add"],
  "شیوه اخذ مشاهده (History Taking)": [
    "CC",
    "PI",
    "Post History",
    "Pers History",
    "S.E State",
    "Drug History",
  ],
  "Review of System": ["Head & Neck", "RS", "CVS", "GIS", "UGS", "CNS", "ENT"],
  "Physical Examination": [
    "Head & Neck",
    "RS",
    "CVS",
    "GIS",
    "UGS",
    "Local Status",
    "Extremities",
  ],
  "Impression / Action Plan": ["Impression", "Action Plan", "Drug Order"],
  Procedure: [
    "IP",
    "Mask, Hat, Gloves",
    "Surgical Instrument Handling",
    "Kind of Procedure",
  ],
};

const TeacherActivityForm: React.FC = () => {
  const [teachers, setTeachers] = useState<string[]>(Array(5).fill(""));
  const [data, setData] = useState(() =>
    Object.entries(teacherActivities).flatMap(([section, items]) =>
      items.map((item) => ({
        section,
        activity: item,
        evaluators: Array(5).fill(false),
      }))
    )
  );
  // ✅ گرفتن trainerId از Context
  const { trainerId } = useTrainer();
  const handleTeacherName = (index: number, value: string) => {
    setTeachers((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  const toggle = (rowIdx: number, teacherIdx: number) => {
    setData((prev) =>
      prev.map((row, i) =>
        i === rowIdx
          ? {
              ...row,
              evaluators: row.evaluators.map((v, j) =>
                j === teacherIdx ? !v : v
              ),
            }
          : row
      )
    );
  };

  // تابع جدید برای تیک / حذف همه برای هر استاد
  const toggleAllForTeacher = (teacherIdx: number) => {
    const allChecked = data.every((row) => row.evaluators[teacherIdx]);
    setData((prev) =>
      prev.map((row) => ({
        ...row,
        evaluators: row.evaluators.map((v, j) =>
          j === teacherIdx ? !allChecked : v
        ),
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trainerId) {
      alert("ابتدا باید یک ترینر ثبت شود!");
      return;
    }

    const payload = { trainerId, teachers, activities: data };

    try {
      const res = await fetch("http://localhost:5000/api/teacher-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      const result = await res.json();
      console.log("Saved:", result);
      alert("فرم با موفقیت ذخیره شد ✅");

      // ریست فرم
      setTeachers(Array(5).fill(""));
      setData(
        Object.entries(teacherActivities).flatMap(([section, items]) =>
          items.map((item) => ({
            section,
            activity: item,
            evaluators: Array(5).fill(false),
          }))
        )
      );
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره داده ❌");
    }
  };

  const grouped = Object.entries(teacherActivities);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-4 bg-gray-100 rounded-xl shadow-md max-h-[85vh] overflow-auto"
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        چک لیست امتحان عملی و نظری ترینی‌های شفاخانه نور
      </h1>

      {/* نام استادها و دکمه تیک همه */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-6 items-center">
        {teachers.map((t, i) => (
          <div key={i} className="flex flex-col items-center">
            <input
              type="text"
              placeholder={`نام استاد ${i + 1}`}
              value={t}
              onChange={(e) => handleTeacherName(i, e.target.value)}
              className="border rounded px-2 py-1 text-center mb-1"
            />
            <button
              type="button"
              onClick={() => toggleAllForTeacher(i)}
              className="text-sm bg-gray-300 hover:bg-gray-400 px-2 py-1 rounded"
            >
              تیک همه / حذف همه
            </button>
          </div>
        ))}
      </div>

      {/* جدول اصلی */}
      <table className="table-auto border-collapse border border-gray-300 w-full text-center text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">بخش</th>
            <th className="border px-2 py-1">فعالیت</th>
            {teachers.map((t, idx) => (
              <th key={idx} className="border px-2 py-1">
                {t || `استاد ${idx + 1}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grouped.map(([section, items]) =>
            items.map((item, rowIndex) => {
              const dataIdx = data.findIndex(
                (d) => d.section === section && d.activity === item
              );
              return (
                <tr key={section + item} className="even:bg-gray-50">
                  {rowIndex === 0 && (
                    <td
                      rowSpan={items.length}
                      className="border px-2 py-1 font-medium whitespace-nowrap"
                    >
                      {section}
                    </td>
                  )}
                  <td className="border px-2 py-1">{item}</td>
                  {teachers.map((_, tIdx) => (
                    <td key={tIdx} className="border px-2 py-1">
                      <input
                        type="checkbox"
                        checked={data[dataIdx].evaluators[tIdx]}
                        onChange={() => toggle(dataIdx, tIdx)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ذخیره
      </button>
    </form>
  );
};

export default TeacherActivityForm;
