// components/residents/form-details/formH-detail.tsx
import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface FormHDetailsProps {
  residentId: string;
  onClose: () => void;
}

export default function FormHDetails({ residentId, onClose }: FormHDetailsProps) {
  // گرفتن اطلاعات فرم H از API
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/evaluationFormH"],
    queryFn: () =>
      fetch(`/api/evaluationFormH`).then((r) => r.json()),
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.length) return <div>فرم پیدا نشد.</div>;

  const form = data[0]; // اولین فرم برای نمایش

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`فرم H – ${form.residentName} ${form.fatherName}`, 14, 20);

    autoTable(doc as any, {
      startY: 30,
      head: [["فیلد", "مقدار"]],
      body: [
        ["نام", form.residentName],
        ["پدر", form.fatherName],
        ["سال", form.year],
        ["سال آموزش", form.trainingYear],
        ["دیپارتمنت", form.department],
        ["امتیاز کل", form.totalScore],
        ["میانگین", form.averageScore],
        ["نام مربی", form.instructorName],
        ["امضا مربی", form.instructorSigned ? "بله" : "خیر"],
        ["دیپارتمنت شیفت", form.shiftDepartment],
        ["رئیس برنامه", form.programDirector],
        ["امضا رئیس", form.presidentSigned ? "بله" : "خیر"],
      ],
    });

    doc.save(`FormH_${form.residentName}_${form.fatherName}.pdf`);
  };

  // Export Excel
  const exportExcel = () => {
    const wsData = [
      ["فیلد", "مقدار"],
      ["نام", form.residentName],
      ["پدر", form.fatherName],
      ["سال", form.year],
      ["سال آموزش", form.trainingYear],
      ["دیپارتمنت", form.department],
      ["امتیاز کل", form.totalScore],
      ["میانگین", form.averageScore],
      ["نام مربی", form.instructorName],
      ["امضا مربی", form.instructorSigned ? "بله" : "خیر"],
      ["دیپارتمنت شیفت", form.shiftDepartment],
      ["رئیس برنامه", form.programDirector],
      ["امضا رئیس", form.presidentSigned ? "بله" : "خیر"],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "FormH");
    XLSX.writeFile(wb, `FormH_${form.residentName}_${form.fatherName}.xlsx`);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">
        فرم H – {form.residentName} {form.fatherName}
      </h3>

      <table className="table-auto border-collapse border border-slate-300 text-sm w-full">
        <tbody>
          <tr><td className="border px-2 py-1 font-semibold">نام</td><td className="border px-2 py-1">{form.residentName}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">پدر</td><td className="border px-2 py-1">{form.fatherName}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">سال</td><td className="border px-2 py-1">{form.year}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">سال آموزش</td><td className="border px-2 py-1">{form.trainingYear}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">دیپارتمنت</td><td className="border px-2 py-1">{form.department}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امتیاز کل</td><td className="border px-2 py-1">{form.totalScore}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">میانگین</td><td className="border px-2 py-1">{form.averageScore}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">نام مربی</td><td className="border px-2 py-1">{form.instructorName}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امضا مربی</td><td className="border px-2 py-1">{form.instructorSigned ? "بله" : "خیر"}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">دیپارتمنت شیفت</td><td className="border px-2 py-1">{form.shiftDepartment}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">رئیس برنامه</td><td className="border px-2 py-1">{form.programDirector}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امضا رئیس</td><td className="border px-2 py-1">{form.presidentSigned ? "بله" : "خیر"}</td></tr>
        </tbody>
      </table>

      <div className="mt-4 space-x-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={exportPDF}>چاپ PDF</button>
        <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={exportExcel}>چاپ Excel</button>
        <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={onClose}>بستن</button>
      </div>
    </div>
  );
}
