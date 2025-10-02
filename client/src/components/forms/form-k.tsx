import React, { useState } from "react";

interface MonographEvaluation {
  section: string;
  writingStyle: string;
  presentation: string;
  answersToQuestions: string;
  defense: string;
  answersToAdditional: string;
  percentage: string;
  score: string;
  teacherName: string;
  teacherSigned: boolean;
  characteristics: string;
  total: string;
  average: string;
}

export default function MonographEvaluationForm() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [field, setField] = useState("");
  const [trainingYear, setTrainingYear] = useState("");
  const [startYear, setStartYear] = useState("");
  const [date, setDate] = useState("");

  const [evaluations, setEvaluations] = useState<MonographEvaluation[]>([
    {
      section: "",
      writingStyle: "",
      presentation: "",
      answersToQuestions: "",
      defense: "",
      answersToAdditional: "",
      percentage: "",
      score: "",
      teacherName: "",
      teacherSigned: false,
      characteristics: "",
      total: "",
      average: "",
    },
  ]);

  const handleEvalChange = (
    index: number,
    fieldName: keyof MonographEvaluation,
    value: string | boolean
  ) => {
    const updated = [...evaluations];
    (updated[index] as any)[fieldName] = value;
    setEvaluations(updated);
  };

  // const handleSubmit = async () => {
  //   try {
  //     const res = await fetch("http://localhost:5000//api/monographEvaluation", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         studentId: "665dfb4c1d53c33f74123456", // 👈
  //         name,
  //         lastName,
  //         fatherName,
  //         idNumber,
  //         field,
  //         trainingYear,
  //         startYear,
  //         date,
  //         evaluations,
  //       }),
        
  //     });
  //     if (!res.ok) throw new Error("خطا در ذخیره فرم");
  //     const data = await res.json();
  //     console.log("فرم ذخیره شد:", data);
  //     alert("فرم با موفقیت ذخیره شد!");

  //     // ریست کردن همه فیلدها
  //     setName("");
  //     setLastName("");
  //     setFatherName("");
  //     setIdNumber("");
  //     setField("");
  //     setTrainingYear("");
  //     setStartYear("");
  //     setDate("");
  //     setEvaluations([
  //       {
  //         section: "",
  //         writingStyle: "",
  //         presentation: "",
  //         answersToQuestions: "",
  //         defense: "",
  //         answersToAdditional: "",
  //         percentage: "",
  //         score: "",
  //         teacherName: "",
  //         teacherSigned: false,
  //         characteristics: "",
  //         total: "",
  //         average: "",
  //       },
  //     ]);
  //   } catch (err) {
  //     console.error(err);
  //     alert("خطا در ذخیره فرم");
  //   }
  // };
  ///////////////////////////////
const handleSubmit = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/monographEvaluation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId: "64dfe0123456789abcdef012", // آیدی واقعی یا حذفش اگر ندارید
        name,
        lastName,
        fatherName,
        idNumber,
        field,
        trainingYear,
        startYear,
        date,
        evaluations,
      }),
    });

    // فقط یک‌بار بدنه را بخوان
    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    if (!res.ok) {
      console.error("server returned error:", text);
      alert("خطا در ذخیره فرم — سرور پاسخ خطا داد. کنسول را بررسی کن.");
      return;
    }

    // اگر content-type JSON است، parse کن
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? JSON.parse(text)
      : text;

    console.log("فرم ذخیره شد:", data);
    alert("فرم با موفقیت ذخیره شد!");

    // ریست کردن همه فیلدها
    setName("");
    setLastName("");
    setFatherName("");
    setIdNumber("");
    setField("");
    setTrainingYear("");
    setStartYear("");
    setDate("");
    setEvaluations([
      {
        section: "",
        writingStyle: "",
        presentation: "",
        answersToQuestions: "",
        defense: "",
        answersToAdditional: "",
        percentage: "",
        score: "",
        teacherName: "",
        teacherSigned: false,
        characteristics: "",
        total: "",
        average: "",
      },
    ]);
  } catch (err) {
    console.error("fetch error:", err);
    alert("خطا در ذخیره فرم");
  }
};

  // استایل مشترک برای همه input ها
  const inputClass = "border rounded px-2 py-2 w-full text-center";

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">
        فرم ارزیابی مونوگراف
      </h2>

      {/* اطلاعات فردی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          <label className="block mb-1 font-medium">تخلص</label>
          <input
            type="text"
            placeholder="تخلص"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">نمبر تذکره</label>
          <input
            type="text"
            placeholder="نمبر تذکره"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">رشته</label>
          <input
            type="text"
            placeholder="رشته"
            value={field}
            onChange={(e) => setField(e.target.value)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium">سال شمول</label>
          <input
            type="text"
            placeholder="سال شمول"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">تاریخ</label>
          <input
            type="text"
            placeholder="تاریخ"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* ارزیابی مونوگراف */}
      <h3 className="text-lg font-semibold mb-2">ارزیابی مونوگراف</h3>
      {evaluations.map((evalItem, i) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 border p-4 rounded-lg"
        >
          <div>
            <label className="block mb-1 font-medium">بخش</label>
            <select
              value={evalItem.section}
              onChange={(e) => handleEvalChange(i, "section", e.target.value)}
              className={inputClass}
            >
              <option value="">انتخاب کنید</option>
              <option value="روش تحقیق">روش تحقیق</option>
              <option value="شیوه تحریر و ترتیب مونوگراف">
                شیوه تحریر و ترتیب مونوگراف
              </option>
              <option value="حاکمیت و شیوه ارائه موضوع">
                حاکمیت و شیوه ارائه موضوع
              </option>
              <option value="ارائه جواب به سوالات راجع به موضوع">
                ارائه جواب به سوالات راجع به موضوع
              </option>
              <option value="دفاع از موضوع تحقیق">دفاع از موضوع تحقیق</option>
              <option value="ارائه جوابات به سوالات افاقی">
                ارائه جوابات به سوالات افاقی
              </option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">فیصدی</label>
            <input
              type="text"
              placeholder="فیصدی"
              value={evalItem.percentage}
              onChange={(e) =>
                handleEvalChange(i, "percentage", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">نمره داده شده</label>
            <input
              type="text"
              placeholder="نمره داده شده"
              value={evalItem.score}
              onChange={(e) => handleEvalChange(i, "score", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">نام استاد</label>
            <input
              type="text"
              placeholder="نام استاد"
              value={evalItem.teacherName}
              onChange={(e) =>
                handleEvalChange(i, "teacherName", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div className="flex items-center mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={evalItem.teacherSigned}
                onChange={(e) =>
                  handleEvalChange(i, "teacherSigned", e.target.checked)
                }
              />
              امضای استاد
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">کرکترستیک</label>
            <input
              type="text"
              placeholder="کرکترستیک"
              value={evalItem.characteristics}
              onChange={(e) =>
                handleEvalChange(i, "characteristics", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">مجموع نمرات</label>
            <input
              type="text"
              placeholder="مجموع نمرات"
              value={evalItem.total}
              onChange={(e) => handleEvalChange(i, "total", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">اوسط</label>
            <input
              type="text"
              placeholder="اوسط"
              value={evalItem.average}
              onChange={(e) => handleEvalChange(i, "average", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      ))}

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
