// FormFViewDynamicFinal.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const months = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

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
  percent: number;
  activities: Activity[];
}

interface FormFDataFromAPI {
  studentName: string;
  fatherName: string;
  year: string;
  scores: Record<string, Record<number, number>>;
}

interface FormFViewDynamicProps {
  studentName: string;
}

const sectionsTemplate: Section[] = [
  {
    name: "آغاز فعالیت",
    percent: 10,
    activities: [
      { id: "uniform", title: "یونیفورم", percent: 6 },
      { id: "coworkers", title: "برخورد با همکاران", percent: 2 },
      { id: "patients", title: "برخورد با مریض", percent: 2 },
    ],
  },
  {
    name: "شیوه اخذ مشاهده",
    percent: 9,
    activities: [
      { id: "cc", title: "شهرت مریض", percent: 2 },
      { id: "pi", title: "معاینه فزیکی", percent: 2 },
      { id: "postHistory", title: "تجویز معاینات لابراتواری روتین", percent: 2 },
      { id: "diagnosis", title: "تجویز معاینات وصفی و ضمیموی", percent: 3 },
    ],
  },
  {
    name: "انجام مشوره طبی بموقع",
    percent: 6,
    activities: [
      { id: "consult", title: "انجام مشوره طبی بموقع", percent: 6 }
    ],
  },
  {
    name: "سعی در بلند بردن سطح دانش علمی و مسلکی",
    percent: 27,
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
    name: "دسپلین",
    percent: 24,
    activities: [
      { id: "attendance", title: "حاضر بودن", percent: 6 },
      { id: "obedience", title: "اطاعت از اوامر معقول آمرمافوق", percent: 6 },
      { id: "rules", title: "مراعات مقرره و لوایح تریننگ", percent: 6 },
      { id: "duty", title: "اشتراک در نوکریوالی", percent: 6 },
    ],
  },
  {
    name: "خصوصیات فردی",
    percent: 24,
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

// تابع کمکی برای نمایش مقدار - جایگزینی صفر با خانه خالی
const displayValue = (value: number | null): string => {
  return value === null || value === 0 ? "" : value.toString();
};

// تابع کمکی برای محاسبه جمع - فقط مقادیر غیرصفر و غیرنال
const calculateSum = (values: (number | null)[]): number => {
  return values.reduce((sum, val) => sum + (val || 0), 0);
};

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
        if (!studentName) return;

        const res = await axios.get<FormFDataFromAPI>(
          `/api/checklists/student/${encodeURIComponent(studentName)}`
        );

        const data = res.data;

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
  }, [studentName]);

  const calculateActivityTotal = (activity: Activity) =>
    calculateSum((activity.months || []).map(m => m.value));

  const calculateSectionTotal = (section: Section) =>
    calculateSum(section.activities.map(act => calculateActivityTotal(act)));

  const calculateMonthTotal = (monthIndex: number) =>
    calculateSum(sections.map(section => 
      calculateSum(section.activities.map(act => 
        act.months?.[monthIndex]?.value || 0
      ))
    ));

  const calculateGrandTotal = () =>
    calculateSum(sections.map(section => calculateSectionTotal(section)));

  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const monthTotals = months.map((_, monthIndex) => 
      calculateMonthTotal(monthIndex)
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <title>Form F - ${studentInfo.studentName}</title>
        <style>
          body { 
            font-family: 'Tahoma', 'Arial', sans-serif; 
            margin: 10px;
            line-height: 1;
            font-size: 11px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 10px;
          }
          .header h1 {
            font-size: 14px;
            margin: 0;
            font-weight: bold;
          }
          .header h2 {
            font-size: 12px;
            margin: 2px 0;
            font-weight: bold;
          }
          .student-info {
            text-align: center;
            margin-bottom: 10px;
            font-size: 11px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
            font-size: 9px;
            border: 1px solid #000;
          }
          th, td {
            border: 1px solid #000;
            padding: 3px 2px;
            text-align: center;
            height: 18px;
          }
          .main-section {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          .sub-activity {
            background-color: #ffffff;
          }
          .empty-cell {
            border: none;
            background-color: transparent;
          }
          .signatures {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }
          .signature-box {
            text-align: center;
            width: 45%;
          }
          @media print {
            body { margin: 8px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>( F ) فورم:</h1>
          <h2>حکالست کاری و ارزیابی ماموال نزینی های ساخانه</h2>
        </div>

        <div class="student-info">
          <span><strong>اسم:</strong> ${studentInfo.studentName}</span>
          <span style="margin: 0 15px;"><strong>ولد:</strong> ${studentInfo.fatherName}</span>
          <span><strong>سال تربننگ:</strong> ${studentInfo.year}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>محفظات</th>
              <th>جمع‌ها برآن</th>
              ${months.map(m => `<th>${m}</th>`).join('')}
              <th>قیمت‌ها برآن</th>
            </tr>
          </thead>
          <tbody>
            ${sections.map(section => `
              <!-- بخش اصلی -->
              <tr class="main-section">
                <td>${section.percent}%</td>
                <td>${calculateSectionTotal(section)}</td>
                ${months.map((_, idx) => {
                  const monthSum = section.activities.reduce((sum, act) => {
                    const value = act.months?.[idx]?.value;
                    return sum + (value || 0);
                  }, 0);
                  return `<td>${monthSum > 0 ? monthSum : ''}</td>`;
                }).join('')}
                <td>${section.name}</td>
              </tr>
              <!-- فعالیت‌های فرعی -->
              ${section.activities.map((activity, index) => `
                <tr class="sub-activity">
                  <td class="empty-cell"></td>
                  <td>${calculateActivityTotal(activity) > 0 ? calculateActivityTotal(activity) : ''}</td>
                  ${activity.months?.map(month => 
                    `<td>${displayValue(month.value)}</td>`
                  ).join('')}
                  <td>${activity.title} ${activity.percent}%</td>
                </tr>
              `).join('')}
            `).join('')}

            <!-- جمع کل -->
            <tr class="main-section" style="background-color: #e0e0e0;">
              <td>100%</td>
              <td>${calculateGrandTotal()}</td>
              ${monthTotals.map(total => 
                `<td>${total > 0 ? total : ''}</td>`
              ).join('')}
              <td>مجموع کل</td>
            </tr>
          </tbody>
        </table>

        <div class="signatures">
          <div class="signature-box">
            <strong>رئيس شناخته</strong><br>
            ________________
          </div>
          <div class="signature-box">
            <strong>امريروگرام تربننگ</strong><br>
            ________________
          </div>
        </div>

        <div style="text-align: center; margin-top: 5px; font-size: 10px;">
          <strong>ترينزمربوطه</strong>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const downloadExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    csvContent += "( F ) فورم:\\n";
    csvContent += "حکالست کاری و ارزیابی ماموال نزینی های ساخانه\\n";
    csvContent += `اسم: ${studentInfo.studentName},ولد: ${studentInfo.fatherName},سال تربننگ: ${studentInfo.year}\\n\\n`;

    csvContent += "محفظات,جمع‌ها برآن,";
    csvContent += months.join(",");
    csvContent += ",قیمت‌ها برآن\\n";

    sections.forEach(section => {
      // بخش اصلی
      let sectionRow = `${section.percent}%,${calculateSectionTotal(section)},`;
      months.forEach((_, idx) => {
        const monthSum = section.activities.reduce((sum, act) => {
          const value = act.months?.[idx]?.value;
          return sum + (value || 0);
        }, 0);
        sectionRow += `${monthSum > 0 ? monthSum : ''},`;
      });
      sectionRow += `${section.name}\\n`;
      csvContent += sectionRow;

      // فعالیت‌های فرعی
      section.activities.forEach(activity => {
        let activityRow = `,${calculateActivityTotal(activity) > 0 ? calculateActivityTotal(activity) : ''},`;
        activity.months?.forEach(month => {
          activityRow += `${displayValue(month.value)},`;
        });
        activityRow += `${activity.title} ${activity.percent}%\\n`;
        csvContent += activityRow;
      });
    });

    // جمع کل
    let grandTotalRow = "100%,";
    grandTotalRow += `${calculateGrandTotal()},`;
    months.forEach((_, idx) => {
      const monthTotal = calculateMonthTotal(idx);
      grandTotalRow += `${monthTotal > 0 ? monthTotal : ''},`;
    });
    grandTotalRow += "مجموع کل\\n";
    csvContent += grandTotalRow;

    csvContent += "\\nرئيس شناخته,امريروگرام تربننگ\\n";
    csvContent += "ترينزمربوطه\\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FormF_${studentInfo.studentName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-gray-100 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center">
          نمایش چک لیست کاری و ارزیابی ماهوار ترینی‌ها (Form F)
        </h1>
        
        <div className="flex gap-2 no-print">
          <button
            onClick={downloadPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
          >
            دانلود PDF
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
          >
            دانلود Excel
          </button>
        </div>
      </div>

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

      {/* نمایش با ساختار درختی */}
      <div className="mb-8">
        <table className="w-full border border-gray-300 text-sm bg-white">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300">بخش اصلی</th>
              <th className="p-2 border border-gray-300">فیصدی بخش</th>
              <th className="p-2 border border-gray-300">فعالیت‌های فرعی</th>
              <th className="p-2 border border-gray-300">فیصدی فعالیت</th>
              {months.map((m) => (
                <th key={m} className="p-2 border border-gray-300">{m}</th>
              ))}
              <th className="p-2 border border-gray-300">مجموع فعالیت</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                <tr className="bg-gray-100 font-bold">
                  <td className="p-2 border border-gray-300" rowSpan={section.activities.length + 1}>
                    {section.name}
                  </td>
                  <td className="p-2 border border-gray-300" rowSpan={section.activities.length + 1}>
                    {section.percent}%
                  </td>
                  <td className="p-2 border border-gray-300" colSpan={months.length + 3}>
                    جمع بخش: {calculateSectionTotal(section) > 0 ? calculateSectionTotal(section) : ""}
                  </td>
                </tr>
                {section.activities.map((activity, activityIndex) => (
                  <tr key={activityIndex} className="hover:bg-gray-50">
                    <td className="p-2 border border-gray-300">{activity.title}</td>
                    <td className="p-2 border border-gray-300">{activity.percent}%</td>
                    {months.map((monthNum) => {
                      const monthData = activity.months?.find(m => m.month === monthNum);
                      return (
                        <td
                          key={monthNum}
                          className="p-2 border border-gray-300 text-center"
                        >
                          {displayValue(monthData?.value ?? null)}
                        </td>
                      );
                    })}
                    <td className="p-2 border border-gray-300 font-bold">
                      {calculateActivityTotal(activity) > 0 ? calculateActivityTotal(activity) : ""}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}