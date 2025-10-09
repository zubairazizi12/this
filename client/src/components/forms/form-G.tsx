import React, { useState } from "react";
import { useTrainer } from "@/context/TrainerContext";

type Row = {
  exam1Written: string;
  exam1Practical: string;
  exam2Written: string;
  exam2Practical: string;
  finalWritten: string;
  finalPractical: string;
  total: string;
  teacherName: string;
};

type RowField = keyof Row;

export default function EvaluationFormG() {
  const { trainerId } = useTrainer();

  // بخش معلومات شخصی
  const [personalInfo, setPersonalInfo] = useState({
    residentName: "",
    fatherName: "",
    trainingYear: "",
    year: "",
    department: "",
  });

  const [rows, setRows] = useState<Row[]>(
    Array.from({ length: 6 }, () => ({
      exam1Written: "",
      exam1Practical: "",
      exam2Written: "",
      exam2Practical: "",
      finalWritten: "",
      finalPractical: "",
      total: "",
      teacherName: "",
    }))
  );

  const inputClass = "border px-2 py-2 w-full text-center";

  const handleChangeRow = (index: number, field: RowField, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;

    // محاسبه مجموع برای ردیف 1 تا 5
    if (index < 5) {
      const total =
        (Number(newRows[index].exam1Written) || 0) +
        (Number(newRows[index].exam1Practical) || 0) +
        (Number(newRows[index].exam2Written) || 0) +
        (Number(newRows[index].exam2Practical) || 0) +
        (Number(newRows[index].finalWritten) || 0) +
        (Number(newRows[index].finalPractical) || 0);
      newRows[index].total = total.toString();
    }

    setRows(newRows);
  };

  const handleChangePersonal = (
    field: keyof typeof personalInfo,
    value: string
  ) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  const handleSubmit = async () => {
    if (!trainerId) {
      alert("خطا: شناسه ترینر موجود نیست!");
      return;
    }

    // محاسبه اوسط ردیف ششم
    const filledRows = rows.slice(0, 5);
    const avg = (field: keyof Row) => {
      const vals = filledRows.map((r) => Number(r[field]) || 0);
      return (vals.reduce((a, b) => a + b, 0) / filledRows.length).toFixed(2);
    };

    const newRows = [...rows];
    newRows[5] = {
      exam1Written: avg("exam1Written"),
      exam1Practical: avg("exam1Practical"),
      exam2Written: avg("exam2Written"),
      exam2Practical: avg("exam2Practical"),
      finalWritten: avg("finalWritten"),
      finalPractical: avg("finalPractical"),
      total: (
        filledRows.reduce((sum, r) => sum + (Number(r.total) || 0), 0) /
        filledRows.length
      ).toFixed(2),
      teacherName: "",
    };

    setRows(newRows);

    try {
      const res = await fetch("http://localhost:5000/api/evaluationFormG", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerId,
          personalInfo,
          scores: newRows,
        }),
      });

      if (!res.ok) throw new Error("خطا در ذخیره فرم");

      alert("فرم با موفقیت ذخیره شد!");
      // ⚡ پاک کردن فیلدها بعد از ذخیره
      setPersonalInfo({
        residentName: "",
        fatherName: "",
        trainingYear: "",
        year: "",
        department: "",
      });
      setRows(
        Array.from({ length: 6 }, () => ({
          exam1Written: "",
          exam1Practical: "",
          exam2Written: "",
          exam2Practical: "",
          finalWritten: "",
          finalPractical: "",
          total: "",
          teacherName: "",
        }))
      );
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره فرم");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-bold text-center mb-4">
        فورم ارزیابی دستیار
      </h2>

      {/* بخش معلومات شخصی */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          type="text"
          placeholder="نام"
          value={personalInfo.residentName}
          onChange={(e) => handleChangePersonal("residentName", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="ولد"
          value={personalInfo.fatherName}
          onChange={(e) => handleChangePersonal("fatherName", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="سال تریننگ"
          value={personalInfo.trainingYear}
          onChange={(e) => handleChangePersonal("trainingYear", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="سال"
          value={personalInfo.year}
          onChange={(e) => handleChangePersonal("year", e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="دیپارتمنت"
          value={personalInfo.department}
          onChange={(e) => handleChangePersonal("department", e.target.value)}
          className={inputClass}
        />
      </div>

      {/* جدول نمرات */}
      <table className="table-auto border-collapse border w-full text-center">
        <thead>
          <tr>
            <th rowSpan={2} className="border px-2 py-4">
              شماره
            </th>
            <th colSpan={2} className="border px-2 py-2">
              امتحان چهار ماه اول
            </th>
            <th colSpan={2} className="border px-2 py-2">
              امتحان چهار ماه دوم
            </th>
            <th colSpan={2} className="border px-2 py-2">
              امتحان نهایی
            </th>
            <th rowSpan={2} className="border px-2 py-4">
              مجموع
            </th>
            <th rowSpan={2} className="border px-2 py-4">
              نام استاد
            </th>
          </tr>
          <tr>
            <th className="border px-2 py-2">تحریری</th>
            <th className="border px-2 py-2">عملی</th>
            <th className="border px-2 py-2">تحریری</th>
            <th className="border px-2 py-2">عملی</th>
            <th className="border px-2 py-2">تحریری</th>
            <th className="border px-2 py-2">عملی</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 5).map((row, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-4">{idx + 1}</td>
              <td>
                <input
                  type="number"
                  value={row.exam1Written}
                  onChange={(e) =>
                    handleChangeRow(idx, "exam1Written", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.exam1Practical}
                  onChange={(e) =>
                    handleChangeRow(idx, "exam1Practical", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.exam2Written}
                  onChange={(e) =>
                    handleChangeRow(idx, "exam2Written", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.exam2Practical}
                  onChange={(e) =>
                    handleChangeRow(idx, "exam2Practical", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.finalWritten}
                  onChange={(e) =>
                    handleChangeRow(idx, "finalWritten", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.finalPractical}
                  onChange={(e) =>
                    handleChangeRow(idx, "finalPractical", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.total}
                  readOnly
                  className={inputClass + " bg-gray-100"}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.teacherName}
                  onChange={(e) =>
                    handleChangeRow(idx, "teacherName", e.target.value)
                  }
                  className={inputClass}
                />
              </td>
            </tr>
          ))}

          {/* ردیف ششم - merge ستون‌ها */}
          <tr>
            <td className="border px-2 py-4">6</td>
            <td colSpan={2}>
              <input
                type="text"
                value={rows[5].exam1Written}
                placeholder="اوسط نمرات"
                onChange={(e) =>
                  handleChangeRow(5, "exam1Written", e.target.value)
                }
                className={inputClass}
              />
            </td>
            <td colSpan={2}>
              <input
                type="text"
                value={rows[5].exam2Written}
                placeholder="اوسط نمرات"
                onChange={(e) =>
                  handleChangeRow(5, "exam2Written", e.target.value)
                }
                className={inputClass}
              />
            </td>
            <td colSpan={2}>
              <input
                type="text"
                value={rows[5].finalWritten}
                placeholder="اوسط نمرات"
                onChange={(e) =>
                  handleChangeRow(5, "finalWritten", e.target.value)
                }
                className={inputClass}
              />
            </td>
            <td>
              <input
                type="text"
                value={rows[5].total}
                placeholder="مجموعه"
                onChange={(e) => handleChangeRow(5, "total", e.target.value)}
                className={inputClass}
              />
            </td>
            <td>
              <input
                type="text"
                value={rows[5].teacherName}
                placeholder=""
                onChange={(e) =>
                  handleChangeRow(5, "teacherName", e.target.value)
                }
                className={inputClass}
              />
            </td>
          </tr>
        </tbody>
      </table>

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
