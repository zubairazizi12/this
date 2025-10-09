import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useTrainer } from "../../../context/TrainerContext";

interface FormEDetailsProps {
  residentId: string;
  onClose: () => void;
}

export default function FormEDetails({ residentId, onClose }: FormEDetailsProps) {
  const { trainerId } = useTrainer();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/evaluationFormE", trainerId, residentId],
    queryFn: () =>
      fetch(`/api/evaluationFormE?trainerId=${trainerId}`).then((r) =>
        r.json()
      ),
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.length) return <div>فرم پیدا نشد.</div>;

  const form = data[0];

  const printPDF = () => window.print();

  const exportExcel = () => {
    const wsData: any[] = [
      ["نام", "نام پدر", "سال تریننگ", "تاریخ"],
      [form.residentName, form.fatherName, form.trainingYear, form.date],
      [],
      ["عنوان واقعه", "نمره داده شده", "نام استاد", "ملاحظات"],
      // 👇 همه نمرات را در اکسل می‌ریزیم
      ...form.scores.map((s: any) => [
        form.incidentTitle,
        s.score,
        s.teacherName,
        s.notes || "",
      ]),
      [],
      ["اوسط نمرات", form.averageScore],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "FormE");
    XLSX.writeFile(wb, `FormE_${form.residentName}.xlsx`);
  };

  return (
    <div className="p-4 text-sm">
      <h3 className="text-lg font-bold mb-4 text-center">
        فرم ارزشیابی سالانه دستیار
      </h3>

      {/* بالا */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="border px-2 py-1">نام: {form.residentName}</div>
        <div className="border px-2 py-1">نام پدر: {form.fatherName}</div>
        <div className="border px-2 py-1">سال تریننگ: {form.trainingYear}</div>
        <div className="border px-2 py-1">تاریخ: {form.date}</div>
      </div>

      {/* جدول اصلی */}
      <div className="grid grid-cols-4 gap-0 mb-4 border border-black">
        {/* تیترها */}
        <div className="col-span-1 border-r border-black px-2 py-1 font-bold text-center">
          عنوان واقعه
        </div>
        <div className="border-r border-black px-2 py-1 font-bold text-center">
          نمره داده شده
        </div>
        <div className="border-r border-black px-2 py-1 font-bold text-center">
          نام استاد
        </div>
        <div className="px-2 py-1 font-bold text-center">ملاحظات</div>

        {/* عنوان واقعه (یک ستون عمودی) */}
        <div className="col-span-1 row-span-5 border-r border-black px-2 py-1 h-40 align-top">
          {form.incidentTitle}
        </div>

        {/* ستون نمرات */}
        <div className="border-r border-black px-2 py-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 border-b border-dotted last:border-0 flex items-center"
            >
              {form.scores?.[i]?.score || ""}
            </div>
          ))}
        </div>

        {/* ستون اساتید */}
        <div className="border-r border-black px-2 py-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 border-b border-dotted last:border-0 flex items-center"
            >
              {form.scores?.[i]?.teacherName || ""}
            </div>
          ))}
        </div>

        {/* ستون ملاحظات */}
        <div className="px-2 py-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 border-b border-dotted last:border-0 flex items-center"
            >
              {form.scores?.[i]?.notes || ""}
            </div>
          ))}
        </div>
      </div>

      {/* اوسط نمرات */}
      <div className="border px-2 py-2 mb-6">
        اوسط نمرات: <span className="font-bold">{form.averageScore}</span>
      </div>

      {/* امضاءها */}
      <div className="grid grid-cols-3 gap-4 text-center mt-8">
        <div className="border-t border-black pt-2">رئیس دیپارتمنت</div>
        <div className="border-t border-black pt-2">آمر تریننگ</div>
        <div className="border-t border-black pt-2">رئیس شفاخانه</div>
      </div>

      {/* دکمه‌ها */}
      <div className="mt-6 flex gap-2 print:hidden">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={printPDF}
        >
          چاپ PDF
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={exportExcel}
        >
          چاپ Excel
        </button>
        <button
          className="bg-gray-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </div>
  );
}
