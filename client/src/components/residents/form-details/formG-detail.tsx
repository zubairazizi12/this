import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface FormGDetailsProps {
  residentId: string;
  onClose: () => void;
}

export default function FormGDetails({ residentId, onClose }: FormGDetailsProps) {
  // گرفتن اطلاعات فرم G از API
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/evaluationFormG"],
    queryFn: () =>
      fetch(`/api/evaluationFormG`).then((r) => r.json()),
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.length) return <div>فرم پیدا نشد.</div>;

  const form = data[0]; // اولین فرم را برای نمایش بگیرید

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`فرم G – ${form.name} ${form.fatherName}`, 14, 20);

    autoTable(doc as any, {
      startY: 30,
      head: [["فیلد", "مقدار"]],
      body: [
        ["نام", form.name],
        ["پدر", form.fatherName],
        ["سال", form.year],
        ["سال آموزش", form.trainingYear],
        ["دیپارتمنت", form.department],
        ["امتحان ۱ کتبی", form.exam1Written],
        ["امتحان ۱ عملی", form.exam1Practical],
        ["امتحان ۲ کتبی", form.exam2Written],
        ["امتحان ۲ عملی", form.exam2Practical],
        ["نهایی کتبی", form.finalWritten],
        ["نهایی عملی", form.finalPractical],
        ["مجموع", form.total],
        ["میانگین", form.average],
        ["معلم", form.teacherName],
        ["امضا معلم", form.teacherSigned ? "بله" : "خیر"],
        ["رئیس دیپارتمنت", form.departmentHead],
        ["رئیس برنامه", form.programHead],
        ["رئیس شفاخانه", form.hospitalHead],
      ],
    });

    doc.save(`FormG_${form.name}_${form.fatherName}.pdf`);
  };

  // Export Excel
  const exportExcel = () => {
    const wsData = [
      ["فیلد", "مقدار"],
      ["نام", form.name],
      ["پدر", form.fatherName],
      ["سال", form.year],
      ["سال آموزش", form.trainingYear],
      ["دیپارتمنت", form.department],
      ["امتحان ۱ کتبی", form.exam1Written],
      ["امتحان ۱ عملی", form.exam1Practical],
      ["امتحان ۲ کتبی", form.exam2Written],
      ["امتحان ۲ عملی", form.exam2Practical],
      ["نهایی کتبی", form.finalWritten],
      ["نهایی عملی", form.finalPractical],
      ["مجموع", form.total],
      ["میانگین", form.average],
      ["معلم", form.teacherName],
      ["امضا معلم", form.teacherSigned ? "بله" : "خیر"],
      ["رئیس دیپارتمنت", form.departmentHead],
      ["رئیس برنامه", form.programHead],
      ["رئیس شفاخانه", form.hospitalHead],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "FormG");
    XLSX.writeFile(wb, `FormG_${form.name}_${form.fatherName}.xlsx`);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">
        فرم G – {form.name} {form.fatherName}
      </h3>

      <table className="table-auto border-collapse border border-slate-300 text-sm w-full">
        <tbody>
          <tr><td className="border px-2 py-1 font-semibold">نام</td><td className="border px-2 py-1">{form.name}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">پدر</td><td className="border px-2 py-1">{form.fatherName}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">سال</td><td className="border px-2 py-1">{form.year}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">سال آموزش</td><td className="border px-2 py-1">{form.trainingYear}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">دیپارتمنت</td><td className="border px-2 py-1">{form.department}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امتحان ۱ کتبی</td><td className="border px-2 py-1">{form.exam1Written}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امتحان ۱ عملی</td><td className="border px-2 py-1">{form.exam1Practical}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امتحان ۲ کتبی</td><td className="border px-2 py-1">{form.exam2Written}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امتحان ۲ عملی</td><td className="border px-2 py-1">{form.exam2Practical}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">نهایی کتبی</td><td className="border px-2 py-1">{form.finalWritten}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">نهایی عملی</td><td className="border px-2 py-1">{form.finalPractical}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">مجموع</td><td className="border px-2 py-1">{form.total}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">میانگین</td><td className="border px-2 py-1">{form.average}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">معلم</td><td className="border px-2 py-1">{form.teacherName}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">امضا معلم</td><td className="border px-2 py-1">{form.teacherSigned ? "بله" : "خیر"}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">رئیس دیپارتمنت</td><td className="border px-2 py-1">{form.departmentHead}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">رئیس برنامه</td><td className="border px-2 py-1">{form.programHead}</td></tr>
          <tr><td className="border px-2 py-1 font-semibold">رئیس شفاخانه</td><td className="border px-2 py-1">{form.hospitalHead}</td></tr>
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
