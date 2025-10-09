// components/forms/FormDDetails.tsx
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useTrainer } from "../../../context/TrainerContext"; // ← مثلاً
import { useRef } from "react";

interface FormDDetailsProps {
  residentId: string;
  onClose: () => void;
}

export default function FormDDetails({residentId, onClose }: FormDDetailsProps) {
  const { trainerId } = useTrainer();
  const printRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["conferenceForms", trainerId],
    queryFn: async () => {
      if (!trainerId) return [];
      const res = await fetch(`/api/conference?trainerId=${trainerId}`);
      return res.json();
    },
    enabled: !!trainerId,
  });

  if (!trainerId) return <div>Trainer ID خالی است.</div>;
  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.length) return <div>فرمی پیدا نشد.</div>;

  const form = data[0];

  const exportExcel = () => {
    const wsData: any[] = [];

    // مشخصات فردی
    wsData.push(["نام", form.name]);
    wsData.push(["پدر", form.fatherName]);
    wsData.push(["دیپارتمنت", form.department]);
    wsData.push(["سال آموزش", form.trainingYear]);
    wsData.push([]);

    // جدول کنفرانس
    wsData.push(["شماره", "موضوع کنفرانس", "نمره داده شده", "تاریخ ارائه", "اسم و امضا استاد", "ملاحظات"]);
    form.conferences.forEach((c: any, idx: number) => {
      wsData.push([idx + 1, c.conferenceTitle, c.score, c.date, c.teacherName, ""]);
    });
    wsData.push([]);

    // ردیف پایانی امضاها
    wsData.push(["رئیس دیپارتمنت", "آمر برنامه تریننگ", "رئیس شفاخانه"]);
    wsData.push([form.departmentHead || "", form.programHead || "", form.hospitalHead || ""]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "FormD");
    XLSX.writeFile(wb, `FormD_${form.name}_${form.fatherName}.xlsx`);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // برای بازگشت به حالت اولیه صفحه
    }
  };

  return (
    <div className="p-4">
      <div ref={printRef}>
        <h3 className="text-lg font-bold mb-2">فرم D – {form.name} {form.fatherName}</h3>

        <table className="table-auto border-collapse border border-slate-300 text-sm w-full mb-4">
          <tbody>
            <tr><td className="border px-2 py-1 font-semibold">نام</td><td className="border px-2 py-1">{form.name}</td></tr>
            <tr><td className="border px-2 py-1 font-semibold">پدر</td><td className="border px-2 py-1">{form.fatherName}</td></tr>
            <tr><td className="border px-2 py-1 font-semibold">دیپارتمنت</td><td className="border px-2 py-1">{form.department}</td></tr>
            <tr><td className="border px-2 py-1 font-semibold">سال آموزش</td><td className="border px-2 py-1">{form.trainingYear}</td></tr>
          </tbody>
        </table>

        <table className="table-auto border-collapse border border-slate-300 text-sm w-full mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">شماره</th>
              <th className="border px-2 py-1">موضوع کنفرانس</th>
              <th className="border px-2 py-1">نمره داده شده</th>
              <th className="border px-2 py-1">تاریخ ارائه</th>
              <th className="border px-2 py-1">اسم و امضا استاد</th>
              <th className="border px-2 py-1">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {form.conferences.map((c: any, idx: number) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{idx + 1}</td>
                <td className="border px-2 py-1">{c.conferenceTitle}</td>
                <td className="border px-2 py-1">{c.score}</td>
                <td className="border px-2 py-1">{c.date}</td>
                <td className="border px-2 py-1">{c.teacherName}</td>
                <td className="border px-2 py-1"></td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="table-auto border-collapse border border-slate-300 text-sm w-full mb-4">
          <tbody>
            <tr>
              <td className="border px-2 py-1 font-semibold">رئیس دیپارتمنت</td>
              <td className="border px-2 py-1 font-semibold">آمر برنامه تریننگ</td>
              <td className="border px-2 py-1 font-semibold">رئیس شفاخانه</td>
            </tr>
            <tr>
              <td className="border px-2 py-1">{form.departmentHead || ""}</td>
              <td className="border px-2 py-1">{form.programHead || ""}</td>
              <td className="border px-2 py-1">{form.hospitalHead || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-x-2 mt-4">
        <button onClick={handlePrint} className="bg-blue-500 text-white px-3 py-1 rounded">چاپ PDF</button>
        <button onClick={exportExcel} className="bg-green-500 text-white px-3 py-1 rounded">چاپ Excel</button>
        <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded">بستن</button>
      </div>
    </div>
  );
}
