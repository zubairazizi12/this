import React, { useState } from "react";

interface MonographEvaluation {
  section: string;
  percentage: string;
  score: string;
  teacherName: string;
}

export default function MonographEvaluationFormC() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [field, setField] = useState("");
  const [trainingYear, setTrainingYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [date, setDate] = useState("");

  const [chef, setChef] = useState("");
  const [departmentHead, setDepartmentHead] = useState("");
  const [hospitalHead, setHospitalHead] = useState("");

  // بخش‌های ثابت فرم + سه بخش جدید
  const sections = [
    "نمره کنفرانسهای طول سال",
    "نمره امتحان نهایی عملی و تقرری",
    "نمره تست های چهار ماهه",
    "نمره case presentation",
    "نمره سیکل",
    "مجموع نمرات",
    "نتیجه نهایی",
  ];

  const [evaluations, setEvaluations] = useState<MonographEvaluation[]>(
    sections.map((s) => ({
      section: s,
      percentage: "",
      score: "",
      teacherName: "",
    }))
  );

  const handleEvalChange = (
    index: number,
    fieldName: keyof MonographEvaluation,
    value: string
  ) => {
    const updated = [...evaluations];
    (updated[index] as any)[fieldName] = value;
    setEvaluations(updated);
  };

  const inputClass = "border rounded px-2 py-2 w-full text-center";

  const handleSubmit = async () => {
    const payload = {
      name,
      lastName,
      fatherName,
      idNumber,
      field,
      trainingYear,
      startYear,
      date,
      chef,
      departmentHead,
      hospitalHead,
      evaluations,
    };

    try {
      const res = await fetch("http://localhost:5000/api/monograph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("فرم با موفقیت ارسال شد ✅");
        // ریست فرم
        setName(""); setLastName(""); setFatherName(""); setIdNumber("");
        setField(""); setTrainingYear(""); setStartYear(""); setDate("");
        setChef(""); setDepartmentHead(""); setHospitalHead("");
        setEvaluations(
          sections.map((s) => ({
            section: s,
            percentage: "",
            score: "",
            teacherName: "",
          }))
        );
      } else alert("❌ خطا در ارسال فرم");
    } catch (err) {
      console.error(err);
      alert("❌ مشکل در برقراری ارتباط با سرور");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-6">
        فرم ارزیابی مونوگراف
      </h2>

      {/* کل فرم در یک گرید یکنواخت */}
      <div className="grid grid-cols-4 gap-4">
        {/* اطلاعات فردی */}
        <input className={inputClass} placeholder="اسم" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={inputClass} placeholder="تخلص" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input className={inputClass} placeholder="ولد" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
        <input className={inputClass} placeholder="نمبر تذکره" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />

        <input className={inputClass} placeholder="رشته" value={field} onChange={(e) => setField(e.target.value)} />
        <input className={inputClass} placeholder="سال تریننگ" value={trainingYear} onChange={(e) => setTrainingYear(e.target.value)} />
        <input className={inputClass} placeholder="سال شمول" value={startYear} onChange={(e) => setStartYear(e.target.value)} />
        <input className={inputClass} placeholder="تاریخ" value={date} onChange={(e) => setDate(e.target.value)} />

        {/* ارزیابی بخش‌ها */}
        {evaluations.map((ev, i) => (
          <React.Fragment key={i}>
            <div className={inputClass}>{ev.section}</div>
            <input
              className={inputClass}
              placeholder="فیصدی"
              value={ev.percentage}
              onChange={(e) => handleEvalChange(i, "percentage", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="نمره داده شده"
              value={ev.score}
              onChange={(e) => handleEvalChange(i, "score", e.target.value)}
            />
            <input
              className={inputClass}
              placeholder="نام استاد"
              value={ev.teacherName}
              onChange={(e) => handleEvalChange(i, "teacherName", e.target.value)}
            />
          </React.Fragment>
        ))}

        {/* فیلدهای اضافی */}
        <input className={inputClass} placeholder="شف" value={chef} onChange={(e) => setChef(e.target.value)} />
        <input className={inputClass} placeholder="آمر پروگرام تریننگ" value={departmentHead} onChange={(e) => setDepartmentHead(e.target.value)} />
        <input className={inputClass} placeholder="ریس شفاخانه" value={hospitalHead} onChange={(e) => setHospitalHead(e.target.value)} />
        <div></div> {/* تکمیل ردیف */}
      </div>

      <div className="text-center mt-6">
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
