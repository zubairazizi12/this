// components/forms/FormCDetails.tsx
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import * as XLSX from "xlsx";

interface FormCDetailsProps {
  residentId: string;
  onClose: () => void;
}

export default function FormCDetails({
  residentId,
  onClose,
}: FormCDetailsProps) {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/monograph", residentId, "C"],
    queryFn: () =>
      fetch(`/api/monograph?residentId=${residentId}&type=C`).then((r) =>
        r.json()
      ),
  });

  const printRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.data?.length) return <div>فرم پیدا نشد.</div>;

  const form = data.data[0];

  // چاپ PDF از طریق مرورگر (دقیقاً همان HTML فرم)
  const printForm = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const newWindow = window.open("", "_blank", "width=900,height=600");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>فرم C – ${form.name} ${form.lastName}</title>
              <style>
                body { font-family: Arial, sans-serif; direction: rtl; }
                h3 { text-align: center; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #333; padding: 6px; text-align: right; }
                th { background-color: #f3f3f3; }
              </style>
            </head>
            <body>${printContents}</body>
          </html>
        `);
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
      }
    }
  };

  // خروجی Excel
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    // مشخصات فردی
    const detailsWS = XLSX.utils.json_to_sheet([
      { فیلد: "نام", مقدار: form.name },
      { فیلد: "نام خانوادگی", مقدار: form.lastName },
      { فیلد: "پدر", مقدار: form.fatherName },
      { فیلد: "نمبر تذکره", مقدار: form.idNumber },
      { فیلد: "رشته", مقدار: form.field },
      { فیلد: "سال تریننگ", مقدار: form.trainingYear },
      { فیلد: "سال شمول", مقدار: form.startYear },
      { فیلد: "تاریخ", مقدار: form.date },
      { فیلد: "شف", مقدار: form.chef },
      { فیلد: "آمر پروگرام تریننگ", مقدار: form.departmentHead },
      { فیلد: "ریس شفاخانه", مقدار: form.hospitalHead },
    ]);
    XLSX.utils.book_append_sheet(wb, detailsWS, "مشخصات");

    // ارزیابی‌ها
    if (form.evaluations?.length) {
      const evalWS = XLSX.utils.json_to_sheet(
        form.evaluations.map((ev: any) => ({
          بخش: ev.section,
          فیصدی: ev.percentage,
          نمره: ev.score,
          معلم: ev.teacherName,
        }))
      );
      XLSX.utils.book_append_sheet(wb, evalWS, "ارزیابی‌ها");
    }

    XLSX.writeFile(wb, `FormC_${form.name}_${form.lastName}.xlsx`);
  };

  return (
    <div className="p-4">
      {/* دکمه‌ها */}
      <div className="mb-4 space-x-2">
        <button
          onClick={printForm}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          چاپ PDF
        </button>
        <button
          onClick={exportExcel}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          خروجی Excel
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          بستن
        </button>
      </div>

      {/* فرم کامل داخل ref برای چاپ */}
      <div ref={printRef}>
        <h3 className="text-lg font-bold mb-4 text-center">
          فرم C – {form.name} {form.lastName}
        </h3>

        {/* جدول مشخصات */}
        <table className="min-w-full border border-slate-300 mb-4">
          <tbody>
            <tr>
              <td className="font-semibold px-2 py-1 ">نام</td>
              <td className="px-2 py-1">{form.name}</td>

              <td className="font-semibold px-2 py-1">نام خانوادگی</td>
              <td className="px-2 py-1">{form.lastName}</td>

              <td className="font-semibold px-2 py-1">پدر</td>
              <td className="px-2 py-1">{form.fatherName}</td>

              <td className="font-semibold px-2 py-1">نمبر تذکره</td>
              <td className="px-2 py-1">{form.idNumber}</td>
            </tr>

            <tr>
              <td className="font-semibold px-2 py-1">رشته</td>
              <td className="px-2 py-1">{form.field}</td>

              <td className="font-semibold px-2 py-1">سال تریننگ</td>
              <td className="px-2 py-1">{form.trainingYear}</td>

              <td className="font-semibold px-2 py-1">سال شمول</td>
              <td className="px-2 py-1">{form.startYear}</td>

              <td className="font-semibold px-2 py-1">تاریخ</td>
              <td className="px-2 py-1">{form.date}</td>
            </tr>

            <tr>
              <td className="font-semibold px-2 py-1">شف</td>
              <td className="px-2 py-1">{form.chef}</td>

              <td className="font-semibold px-2 py-1">آمر پروگرام تریننگ</td>
              <td className="px-2 py-1">{form.departmentHead}</td>

              <td className="font-semibold px-2 py-1">ریس شفاخانه</td>
              <td className="px-2 py-1">{form.hospitalHead}</td>

              {/* اگر خواستی جای خالی برای پر کردن بگذاری */}
              <td className="font-semibold px-2 py-1"></td>
              <td className="px-2 py-1"></td>
            </tr>
          </tbody>
        </table>

        {/* جدول ارزیابی‌ها */}
        {form.evaluations?.length > 0 && (
          <table className="min-w-full border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-2 py-1 border">بخش</th>
                <th className="px-2 py-1 border">فیصدی</th>
                <th className="px-2 py-1 border">نمره</th>
                <th className="px-2 py-1 border">معلم</th>
              </tr>
            </thead>
            <tbody>
              {form.evaluations.map((ev: any, idx: number) => (
                <tr key={idx} className="border-b">
                  <td className="px-2 py-1">{ev.section}</td>
                  <td className="px-2 py-1">{ev.percentage}</td>
                  <td className="px-2 py-1">{ev.score}</td>
                  <td className="px-2 py-1">{ev.teacherName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
