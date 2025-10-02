// components/forms/FormCDetails.tsx
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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

  const tableRef = useRef<HTMLTableElement>(null);

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.data?.length) return <div>فرم پیدا نشد.</div>;

  const form = data.data[0];

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`فرم C – ${form.name} ${form.lastName}`, 14, 20);

    // اطلاعات شخصی
    autoTable(doc as any, {
      startY: 30,
      head: [["فیلد", "مقدار"]],
      body: [
        ["پدر", form.fatherName],
        ["کد", form.idNumber],
        ["سال آموزش", form.trainingYear],
        ["شروع", form.startYear],
        ["تاریخ", form.date],
        ["شف", form.chef],
        ["رئیس دیپارتمنت", form.departmentHead],
        ["رئیس شفاخانه", form.hospitalHead],
      ],
    });

    // ارزیابی‌ها
    if (form.evaluations?.length) {
      autoTable(doc as any, {
        startY: (doc as any).lastAutoTable?.finalY + 10 || 80,
        head: [["بخش", "نمره", "معلم"]],
        body: form.evaluations.map((ev: any) => [
          ev.section,
          ev.score,
          ev.teacherName,
        ]),
      });
    }

    doc.save(`FormC_${form.name}_${form.lastName}.pdf`);
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    // مشخصات
    const detailsWS = XLSX.utils.json_to_sheet([
      { فیلد: "نام", مقدار: form.name },
      { فیلد: "نام خانوادگی", مقدار: form.lastName },
      { فیلد: "پدر", مقدار: form.fatherName },
      { فیلد: "کد", مقدار: form.idNumber },
      { فیلد: "سال آموزش", مقدار: form.trainingYear },
      { فیلد: "شروع", مقدار: form.startYear },
      { فیلد: "تاریخ", مقدار: form.date },
      { فیلد: "شف", مقدار: form.chef },
      { فیلد: "رئیس دیپارتمنت", مقدار: form.departmentHead },
      { فیلد: "رئیس شفاخانه", مقدار: form.hospitalHead },
    ]);
    XLSX.utils.book_append_sheet(wb, detailsWS, "مشخصات");

    // ارزیابی‌ها
    if (form.evaluations?.length) {
      const evalWS = XLSX.utils.json_to_sheet(
        form.evaluations.map((ev: any) => ({
          بخش: ev.section,
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
      <h3 className="text-lg font-bold mb-4">
        فرم C – {form.name} {form.lastName}
      </h3>

      {/* دکمه‌های PDF و Excel */}
      <div className="mb-4 space-x-2">
        <button
          onClick={exportPDF}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          خروجی PDF
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

      {/* جدول مشخصات */}
      <table ref={tableRef} className="min-w-full border border-slate-300 mb-4">
        <tbody>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">پدر</td>
            <td className="px-2 py-1">{form.fatherName}</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">کد</td>
            <td className="px-2 py-1">{form.idNumber}</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">سال آموزش</td>
            <td className="px-2 py-1">{form.trainingYear}</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">شروع</td>
            <td className="px-2 py-1">{form.startYear}</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">تاریخ</td>
            <td className="px-2 py-1">{form.date}</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">شف</td>
            <td className="px-2 py-1">{form.chef}</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">رئیس دیپارتمنت</td>
            <td className="px-2 py-1">{form.departmentHead}</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold px-2 py-1">رئیس شفاخانه</td>
            <td className="px-2 py-1">{form.hospitalHead}</td>
          </tr>
        </tbody>
      </table>

      {/* جدول ارزیابی‌ها */}
      {form.evaluations?.length > 0 && (
        <table className="min-w-full border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-2 py-1 border">بخش</th>
              <th className="px-2 py-1 border">نمره</th>
              <th className="px-2 py-1 border">معلم</th>
            </tr>
          </thead>
          <tbody>
            {form.evaluations.map((ev: any, idx: number) => (
              <tr key={idx} className="border-b">
                <td className="px-2 py-1">{ev.section}</td>
                <td className="px-2 py-1">{ev.score}</td>
                <td className="px-2 py-1">{ev.teacherName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
