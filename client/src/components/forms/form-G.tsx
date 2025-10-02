import React, { useState } from "react";

export default function EvaluationFormG() {
  const [year, setYear] = useState("");
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [trainingYear, setTrainingYear] = useState("");
  const [department, setDepartment] = useState("");

  const [exam1Written, setExam1Written] = useState("");
  const [exam1Practical, setExam1Practical] = useState("");
  const [exam2Written, setExam2Written] = useState("");
  const [exam2Practical, setExam2Practical] = useState("");
  const [finalWritten, setFinalWritten] = useState("");
  const [finalPractical, setFinalPractical] = useState("");

  const [average, setAverage] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherSigned, setTeacherSigned] = useState(false);
  const [departmentHead, setDepartmentHead] = useState("");
  const [programHead, setProgramHead] = useState("");
  const [hospitalHead, setHospitalHead] = useState("");

  const inputClass = "border rounded px-2 py-2 w-full text-center";

  // محاسبه مجموع
  const total =
    (Number(exam1Written) || 0) +
    (Number(exam1Practical) || 0) +
    (Number(exam2Written) || 0) +
    (Number(exam2Practical) || 0) +
    (Number(finalWritten) || 0) +
    (Number(finalPractical) || 0);

  // تابع ثبت فرم
  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/evaluationFormG", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          name,
          fatherName,
          trainingYear,
          department,
          exam1Written: Number(exam1Written),
          exam1Practical: Number(exam1Practical),
          exam2Written: Number(exam2Written),
          exam2Practical: Number(exam2Practical),
          finalWritten: Number(finalWritten),
          finalPractical: Number(finalPractical),
          total,
          average,
          teacherName,
          teacherSigned,
          departmentHead,
          programHead,
          hospitalHead,
        }),
      });

      if (!res.ok) throw new Error("خطا در ذخیره فرم");

      const data = await res.json();
      console.log("فرم ذخیره شد:", data);
      alert("فرم با موفقیت ذخیره شد!");

      // ریست کردن تمام فیلدها
      setYear("");
      setName("");
      setFatherName("");
      setTrainingYear("");
      setDepartment("");
      setExam1Written("");
      setExam1Practical("");
      setExam2Written("");
      setExam2Practical("");
      setFinalWritten("");
      setFinalPractical("");
      setAverage("");
      setTeacherName("");
      setTeacherSigned(false);
      setDepartmentHead("");
      setProgramHead("");
      setHospitalHead("");
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره فرم");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">
        فرم ارزشیابی دستیار
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
          <label className="block mb-1 font-medium">سال تریننگ</label>
          <input
            type="text"
            placeholder="سال تریننگ"
            value={trainingYear}
            onChange={(e) => setTrainingYear(e.target.value)}
            className={inputClass}
          />
        </div>
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
      </div>

      {/* نمرات */}
      <h3 className="text-lg font-semibold mb-2">نمرات</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">۴ ماه اول تحریری</label>
          <input
            type="number"
            value={exam1Written}
            onChange={(e) => setExam1Written(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">۴ ماه اول عملی</label>
          <input
            type="number"
            value={exam1Practical}
            onChange={(e) => setExam1Practical(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">۴ ماه دوم تحریری</label>
          <input
            type="number"
            value={exam2Written}
            onChange={(e) => setExam2Written(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">۴ ماه دوم عملی</label>
          <input
            type="number"
            value={exam2Practical}
            onChange={(e) => setExam2Practical(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">نهایی تحریری</label>
          <input
            type="number"
            value={finalWritten}
            onChange={(e) => setFinalWritten(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">نهایی عملی</label>
          <input
            type="number"
            value={finalPractical}
            onChange={(e) => setFinalPractical(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* مجموع */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">مجموع نمرات</label>
          <input
            type="number"
            readOnly
            value={total}
            className={inputClass + " bg-gray-100"}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">اوسط نمرات</label>
          <input
            type="text"
            placeholder="اوسط نمرات"
            value={average}
            onChange={(e) => setAverage(e.target.value)}
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
      {/* دکمه ثبت */}
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
