import React, { useState } from "react";

export default function EvaluationFormD() {
  // اطلاعات عمومی
  const [year, setYear] = useState("");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [department, setDepartment] = useState("");
  const [trainingYear, setTrainingYear] = useState("");

  // جزئیات کنفرانس
  const [conferenceTitle, setConferenceTitle] = useState("");
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");

  // استاد
  const [teacherName, setTeacherName] = useState("");
  const [teacherSigned, setTeacherSigned] = useState(false);

  // ملاحظات
  const [notes, setNotes] = useState(false);

  // امضاها
  const [departmentHead, setDepartmentHead] = useState("");
  const [programHead, setProgramHead] = useState("");
  const [hospitalHead, setHospitalHead] = useState("");

  const inputClass = "border rounded px-2 py-2 w-full text-center";
  //// ارسال به سمت بک اند//////
  const handleSubmit = async () => {
    const payload = {
      year,
      name,
      fatherName,
      department,
      trainingYear,
      conferenceTitle,
      score,
      date,
      teacherName,
      teacherSigned,
      notes,
      departmentHead,
      programHead,
      hospitalHead,
    };

    try {
      const res = await fetch("http://localhost:5000/api/conference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("فرم با موفقیت ذخیره شد ✅");
        // ریست فرم
        setYear("");
        setName("");
        setFatherName("");
        setDepartment("");
        setTrainingYear("");
        setConferenceTitle("");
        setScore("");
        setDate("");
        setTeacherName("");
        setTeacherSigned(false);
        setNotes(false);
        setDepartmentHead("");
        setProgramHead("");
        setHospitalHead("");
      } else {
        alert("❌ خطا در ذخیره فرم");
      }
    } catch (err) {
      console.error(err);
      alert("❌ مشکل در ارتباط با سرور");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">
        فرم ارزشیابی کنفرانس
      </h2>

      {/* اطلاعات فردی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">سال</label>
          <input
            type="text"
            placeholder="سال"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">اسم</label>
          <input
            type="text"
            placeholder="اسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">ولد</label>
          <input
            type="text"
            placeholder="ولد"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">دیپارتمنت</label>
          <input
            type="text"
            placeholder="دیپارتمنت"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">سال تریننگ</label>
          <input
            type="text"
            placeholder="سال تریننگ"
            value={trainingYear}
            onChange={(e) => setTrainingYear(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* اطلاعات کنفرانس */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">موضوع کنفرانس</label>
          <input
            type="text"
            placeholder="موضوع کنفرانس"
            value={conferenceTitle}
            onChange={(e) => setConferenceTitle(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">نمره داده شده</label>
          <input
            type="number"
            placeholder="نمره داده شده"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">تاریخ ارائه</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* استاد */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">نام استاد</label>
          <input
            type="text"
            placeholder="نام استاد"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center mt-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={teacherSigned}
              onChange={(e) => setTeacherSigned(e.target.checked)}
            />
            امضای استاد
          </label>
        </div>

        <div className="flex items-center mt-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notes}
              onChange={(e) => setNotes(e.target.checked)}
            />
            ملاحظات
          </label>
        </div>
      </div>

      {/* امضاها */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">شف دیپارتمنت</label>
          <input
            type="text"
            placeholder="شف دیپارتمنت"
            value={departmentHead}
            onChange={(e) => setDepartmentHead(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">آمر پروگرام تریننگ</label>
          <input
            type="text"
            placeholder="آمر پروگرام تریننگ"
            value={programHead}
            onChange={(e) => setProgramHead(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">ریس شفاخانه</label>
          <input
            type="text"
            placeholder="ریس شفاخانه"
            value={hospitalHead}
            onChange={(e) => setHospitalHead(e.target.value)}
            className={inputClass}
          />
        </div>
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
