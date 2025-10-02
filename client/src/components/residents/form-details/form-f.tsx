// FormFViewDynamicFinal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const months = Array.from({ length: 12 }, (_, i) => i + 1);

interface MonthScore {
  month: number;
  value: number | null;
}

interface Activity {
  id: string;
  title: string;
  percent: number;
  months?: MonthScore[];
}

interface Section {
  name: string;
  activities: Activity[];
}

interface FormFDataFromAPI {
  studentName: string;
  fatherName: string;
  year: string;
  scores: Record<string, Record<number, number>>; // actId -> month -> value
}

interface FormFViewDynamicProps {
  studentName: string;
}

// Template ثابت بخش‌ها و فعالیت‌ها
const sectionsTemplate: Section[] = [
  {
    name: "آغاز فعالیت (10%)",
    activities: [
      { id: "uniform", title: "یونیفورم", percent: 6 },
      { id: "coworkers", title: "برخورد با همکاران", percent: 2 },
      { id: "patients", title: "برخورد با مریض", percent: 2 },
    ],
  },
  {
    name: "شیوه اخذ مشاهده (9%)",
    activities: [
      { id: "cc", title: "شهرت مریض", percent: 2 },
      { id: "pi", title: "معاینه فزیکی", percent: 2 },
      { id: "postHistory", title: "تجویز معاینات لابراتواری روتین", percent: 2 },
      { id: "diagnosis", title: "تجویز معاینات وصفی و ضمیموی", percent: 3 },
    ],
  },
  {
    name: "انجام مشوره طبی بموقع (6%)",
    activities: [{ id: "consult", title: "انجام مشوره طبی بموقع", percent: 6 }],
  },
  {
    name: "سعی در بلند بردن سطح دانش علمی و مسلکی (27%)",
    activities: [
      { id: "morning", title: "اشتراک فعال در راپو صبحانه", percent: 6 },
      { id: "visits", title: "اشتراک فعال در ویزت‌ها", percent: 6 },
      { id: "conferences", title: "اشتراک فعال در کنفرانس‌ها", percent: 12 },
      { id: "license", title: "تقویه یکی از لیسانس‌های معتبر خارجی", percent: 1 },
      { id: "computer", title: "قدرت استفاده از کمپیوتر و انترنت", percent: 1 },
      { id: "press", title: "استفاده از نشرات مطبوع", percent: 1 },
    ],
  },
  {
    name: "دسپلین (24%)",
    activities: [
      { id: "attendance", title: "حاضر بودن", percent: 6 },
      { id: "obedience", title: "اطاعت از اوامر معقول آمرمافوق", percent: 6 },
      { id: "rules", title: "مراعات مقرره و لوایح تریننگ", percent: 6 },
      { id: "duty", title: "اشتراک در نوکریوالی", percent: 6 },
    ],
  },
  {
    name: "خصوصیات فردی (24%)",
    activities: [
      { id: "expression", title: "افاده بیان", percent: 2 },
      { id: "initiative", title: "ابتکار سالم", percent: 2 },
      { id: "leadership", title: "تصمیم و رهبری", percent: 2 },
      { id: "honesty", title: "راستکاری و همکاری", percent: 2 },
      { id: "resources", title: "استفاده معقول از منابع", percent: 4 },
      { id: "responsibility", title: "مسٔولیت‌پذیری", percent: 2 },
      { id: "evaluation", title: "تحلیل و ارزیابی", percent: 2 },
      { id: "feedback", title: "انتقاد و پیشنهاد سازنده", percent: 2 },
      { id: "individual", title: "رسیدگی به وضع فردی", percent: 2 },
      { id: "social", title: "رابطه اجتماعی", percent: 2 },
      { id: "position", title: "استفاده بجا از موقف کاری", percent: 2 },
    ],
  },
];

export default function FormFViewDynamicFinal({ studentName }: FormFViewDynamicProps) {
  const [sections, setSections] = useState<Section[]>(sectionsTemplate);
  const [studentInfo, setStudentInfo] = useState({
    studentName: "",
    fatherName: "",
    year: "",
  });

 useEffect(() => {
  const fetchData = async () => {
    try {
      if (!studentName) return; // اطمینان از اینکه نام ترینی مشخص است

      const res = await axios.get<FormFDataFromAPI>(
        `/api/checklists/student/${encodeURIComponent(studentName)}`
      );

      const data = res.data;
      console.log(JSON.stringify(data, null, 2));

      console.log("دیتای دریافتی:", data); // بررسی دیتای واقعی

      setStudentInfo({
        studentName: data.studentName,
        fatherName: data.fatherName,
        year: data.year,
      });

      const updatedSections = sectionsTemplate.map((section) => ({
        ...section,
        activities: section.activities.map((act) => ({
          ...act,
          months: months.map((m) => ({
            month: m,
            value: data.scores?.[act.id]?.[m] ?? null,
          })),
        })),
      }));

      setSections(updatedSections);
    } catch (err) {
      console.error("خطا در دریافت داده‌ها:", err);
    }
  };

  fetchData();
}, [studentName]); // وابسته به نام ترینی


  const calculateTotal = (activity: Activity) =>
    (activity.months || []).reduce((sum, m) => sum + (m.value ?? 0), 0);

  const calculateSectionTotal = (section: Section) =>
    section.activities.reduce((sum, act) => sum + calculateTotal(act), 0);

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-100 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        نمایش چک لیست کاری و ارزیابی ماهوار ترینی‌ها (Form F)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 border rounded-lg bg-white">
          <strong>نام ترینی:</strong> {studentInfo.studentName}
        </div>
        <div className="p-3 border rounded-lg bg-white">
          <strong>ولد:</strong> {studentInfo.fatherName}
        </div>
        <div className="p-3 border rounded-lg bg-white">
          <strong>سال آموزشی:</strong> {studentInfo.year}
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.name} className="mb-10 w-full">
          <h2 className="text-lg font-semibold mb-2">{section.name}</h2>
          <table className="w-full border text-center text-sm bg-white rounded-lg shadow-sm table-fixed">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">فعالیت</th>
                <th className="p-2 border">فیصدی</th>
                {months.map((m) => (
                  <th key={m} className="p-2 border">{m}</th>
                ))}
                <th className="p-2 border">مجموعه نمرات</th>
              </tr>
            </thead>
            <tbody>
              {section.activities.map((act) => (
                <tr key={act.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{act.title}</td>
                  <td className="p-2 border">{act.percent}%</td>
                  {months.map((_, idx) => (
                    <td
                      key={idx}
                      className={`p-2 border ${
                        act.months?.[idx]?.value == null ? "bg-gray-50" : ""
                      }`}
                    >
                      {act.months?.[idx]?.value ?? ""}
                    </td>
                  ))}
                  <td className="p-2 border font-bold">{calculateTotal(act)}</td>
                </tr>
              ))}
              {/* جمع کل بخش */}
              <tr className="bg-gray-100 font-bold">
                <td className="p-2 border" colSpan={2}>
                  جمع کل بخش
                </td>
                {months.map((_, idx) => (
                  <td key={idx} className="p-2 border">
                    {section.activities.reduce(
                      (sum, act) => sum + (act.months?.[idx]?.value ?? 0),
                      0
                    )}
                  </td>
                ))}
                <td className="p-2 border">{calculateSectionTotal(section)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
