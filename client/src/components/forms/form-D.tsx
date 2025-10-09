import React, { useState } from "react";
import { useTrainer } from "@/context/TrainerContext";

interface ConferenceRow {
  id: number;
  conferenceTitle: string;
  score: string;
  date: string;
  teacherName: string;
}

export default function EvaluationFormD() {
  const { trainerId } = useTrainer();
  const [year, setYear] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [fatherName, setFatherName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [trainingYear, setTrainingYear] = useState<string>("");

  const [rows, setRows] = useState<ConferenceRow[]>([
    { id: 1, conferenceTitle: "", score: "", date: "", teacherName: "" },
    { id: 2, conferenceTitle: "", score: "", date: "", teacherName: "" },
    { id: 3, conferenceTitle: "", score: "", date: "", teacherName: "" },
    { id: 4, conferenceTitle: "", score: "", date: "", teacherName: "" },
  ]);

  const inputClass = "border px-2 py-1 w-full text-center";

  const handleChangeRow = <K extends keyof ConferenceRow>(
    index: number,
    field: K,
    value: ConferenceRow[K]
  ) => {
    setRows(prev =>
      prev.map((row, i) =>
        i === index ? ({ ...row, [field]: value } as ConferenceRow) : row
      )
    );
  };

  const handleSubmit = async () => {
    if (!trainerId) {
      alert("❌ Trainer ID خالی است و نمی‌توان فرم را ذخیره کرد.");
      return;
    }

    const conferences = rows.map(({ conferenceTitle, score, date, teacherName }) => ({
      conferenceTitle,
      score,
      date,
      teacherName,
    }));

    const payload = { trainer: trainerId, year, name, fatherName, department, trainingYear, conferences };

    try {
      const res = await fetch("http://localhost:5000/api/conference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ فرم با موفقیت ذخیره شد");
           // ریست کردن فیلدها و جدول
      setYear("");
      setName("");
      setFatherName("");
      setDepartment("");
      setTrainingYear("");
      setRows([
        { id: 1, conferenceTitle: "", score: "", date: "", teacherName: "" },
        { id: 2, conferenceTitle: "", score: "", date: "", teacherName: "" },
        { id: 3, conferenceTitle: "", score: "", date: "", teacherName: "" },
        { id: 4, conferenceTitle: "", score: "", date: "", teacherName: "" },
      ]);
      } else {
        const data = await res.json();
        alert("❌ خطا: " + (data.message || "Unknown error"));
        console.error("Server error:", data);
      }
    } catch (err) {
      console.error(err);
      alert("❌ مشکل در ارتباط با سرور");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">فرم ارزشیابی کنفرانس</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div><label>سال</label><input type="text" value={year} onChange={e => setYear(e.target.value)} className={inputClass} /></div>
        <div><label>اسم</label><input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} /></div>
        <div><label>ولد</label><input type="text" value={fatherName} onChange={e => setFatherName(e.target.value)} className={inputClass} /></div>
        <div><label>دیپارتمنت</label><input type="text" value={department} onChange={e => setDepartment(e.target.value)} className={inputClass} /></div>
        <div><label>سال تریننگ</label><input type="text" value={trainingYear} onChange={e => setTrainingYear(e.target.value)} className={inputClass} /></div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2">شماره</th>
              <th className="border px-2 py-2">موضوع کنفرانس</th>
              <th className="border px-2 py-2">نمره داده شده</th>
              <th className="border px-2 py-2">تاریخ ارائه</th>
              <th className="border px-2 py-2">اسم و امضا استاد</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="border px-2 py-2">{row.id}</td>
                <td className="border px-2 py-2">
                  <input type="text" value={row.conferenceTitle} onChange={e => handleChangeRow(index, "conferenceTitle", e.target.value)} className={inputClass} />
                </td>
                <td className="border px-2 py-2">
                  <input type="number" value={row.score} onChange={e => handleChangeRow(index, "score", e.target.value)} className={inputClass} />
                </td>
                <td className="border px-2 py-2">
                  <input type="date" value={row.date} onChange={e => handleChangeRow(index, "date", e.target.value)} className={inputClass} />
                </td>
                <td className="border px-2 py-2">
                  <input type="text" placeholder="نام استاد / امضا" value={row.teacherName} onChange={e => handleChangeRow(index, "teacherName", e.target.value)} className={inputClass} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          ذخیره فرم
        </button>
      </div>
    </div>
  );
}
