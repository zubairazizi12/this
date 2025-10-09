import React, { useState } from "react";
import { useTrainer } from "@/context/TrainerContext";

interface MonographEvaluation {
  section: string;
  percentage: string;
  score: string;
  teacherName: string;
  teacherSigned: boolean;
  characteristics: string;
  total: string;
  average: string;
  notes: string;
}

export default function MonographEvaluationForm() {
  const { trainerId } = useTrainer();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [field, setField] = useState("");
  const [trainingYear, setTrainingYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [date, setDate] = useState("");

  const inputClass = "border px-2 py-1 text-center w-full";

  const [evaluations, setEvaluations] = useState<MonographEvaluation[]>([
    { section: "شیوه تحریر و ترتیب مونوگراف", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
    { section: "حاکمیت و شیوه ارائه موضوع", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
    { section: "ارائه جواب به سوالات راجع به موضوع", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
    { section: "دفاع از موضوع تحقیق", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
    { section: "ارائه جوابات به سوالات افاقی", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
    { section: "کرکترستیک", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" }
  ]);

  const handleEvalChange = (index: number, field: keyof MonographEvaluation, value: string | boolean) => {
    const updated = [...evaluations];
    (updated[index] as any)[field] = value;
    setEvaluations(updated);
  };

  const handleSubmit = async () => {
    if (!trainerId) {
      alert("Trainer ID خالی است.");
      return;
    }

    const payload = {
      trainer: trainerId,
      name,
      lastName,
      fatherName,
      idNumber,
      field,
      trainingYear,
      startYear,
      date,
      evaluations,
    };

    try {
      const res = await fetch("http://localhost:5000/api/monographEvaluation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        alert("خطا در ذخیره فرم، کنسول را بررسی کنید");
        return;
      }

      alert("فرم با موفقیت ذخیره شد!");
      // ریست فرم
      setName(""); setLastName(""); setFatherName(""); setIdNumber(""); setField(""); setTrainingYear(""); setStartYear(""); setDate("");
      setEvaluations([
        { section: "شیوه تحریر و ترتیب مونوگراف", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
        { section: "حاکمیت و شیوه ارائه موضوع", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
        { section: "ارائه جواب به سوالات راجع به موضوع", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
        { section: "دفاع از موضوع تحقیق", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
        { section: "ارائه جوابات به سوالات افاقی", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" },
        { section: "کرکترستیک", percentage: "", score: "", teacherName: "", teacherSigned: false, characteristics: "", total: "", average: "", notes: "" }
      ]);
    } catch (err) {
      console.error(err);
      alert("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">فرم ارزیابی مونوگراف</h2>

      {/* مشخصات فردی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input type="text" placeholder="اسم" value={name} onChange={(e)=>setName(e.target.value)} className={inputClass}/>
        <input type="text" placeholder="تخلص" value={lastName} onChange={(e)=>setLastName(e.target.value)} className={inputClass}/>
        <input type="text" placeholder="ولد" value={fatherName} onChange={(e)=>setFatherName(e.target.value)} className={inputClass}/>
        <input type="text" placeholder="نمبر تذکره" value={idNumber} onChange={(e)=>setIdNumber(e.target.value)} className={inputClass}/>
        <input type="text" placeholder="رشته" value={field} onChange={(e)=>setField(e.target.value)} className={inputClass}/>
        <input type="text" placeholder="سال تریننگ" value={trainingYear} onChange={(e)=>setTrainingYear(e.target.value)} className={inputClass}/>
        <input type="text" placeholder="سال شمول" value={startYear} onChange={(e)=>setStartYear(e.target.value)} className={inputClass}/>
        <input type="text" placeholder="تاریخ" value={date} onChange={(e)=>setDate(e.target.value)} className={inputClass}/>
      </div>

      {/* جدول ارزیابی */}
      <table className="table-auto border-collapse border w-full text-center mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-2">بخش‌ها</th>
            <th className="border px-2 py-2">فیصدی</th>
            <th className="border px-2 py-2">نمره داده شده</th>
            <th className="border px-2 py-2">اسم استاد</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evalItem, idx)=>(
            <tr key={idx}>
              <td className="border px-2 py-2">{evalItem.section}</td>
              <td className="border px-2 py-2"><input className={inputClass} value={evalItem.percentage} onChange={e=>handleEvalChange(idx, "percentage", e.target.value)} /></td>
              <td className="border px-2 py-2"><input className={inputClass} value={evalItem.score} onChange={e=>handleEvalChange(idx, "score", e.target.value)} /></td>
              <td className="border px-2 py-2"><input className={inputClass} value={evalItem.teacherName} onChange={e=>handleEvalChange(idx, "teacherName", e.target.value)} /></td>
            </tr>
          ))}
          <tr>
            <td className="border px-2 py-2">مجموع نمرات</td>
            <td className="border px-2 py-2"><input className={inputClass} value={evaluations[0].total} onChange={e=>handleEvalChange(0, "total", e.target.value)} /></td>
            <td className="border px-2 py-2">اوسط</td>
            <td className="border px-2 py-2"><input className={inputClass} value={evaluations[0].average} onChange={e=>handleEvalChange(0, "average", e.target.value)} /></td>
          </tr>
        </tbody>
      </table>

      <div className="mb-4">
        <label className="block mb-1 font-medium">ملاحظات / نظر هیئت اداری</label>
        <textarea className="border w-full p-2 rounded" rows={4} value={evaluations[0].notes} onChange={e=>handleEvalChange(0, "notes", e.target.value)} />
      </div>

      <div className="text-center">
        <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition">
          ذخیره فرم
        </button>
      </div>
    </div>
  );
}
