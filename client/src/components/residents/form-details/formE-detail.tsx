// components/residents/form-details/formE-detail.tsx
import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface FormEDetailsProps {
  residentId: string;
  onClose: () => void;
}

export default function FormEDetails({
  residentId,
  onClose,
}: FormEDetailsProps) {
  // گرفتن اطلاعات فرم E از API
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/evaluationFormE"],
    queryFn: () => fetch(`/api/evaluationFormE`).then((r) => r.json()),
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.length) return <div>فرم پیدا نشد.</div>;

  const form = data[0]; // اولین فرم را بگیر

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`فرم E – ${form.name} ${form.fatherName}`, 14, 20);

    autoTable(doc as any, {
      startY: 30,
      head: [["فیلد", "مقدار"]],
      body: [
        ["نام", form.name],
        ["پدر", form.fatherName],
        ["سال", form.year],
        ["سال آموزش", form.trainingYear],
        ["عنوان حادثه", form.incidentTitle],
        ["تاریخ", form.date],
        ["امتیاز", form.score],
        ["میانگین امتیاز", form.averageScore],
        ["معلم", form.teacherName],
        ["امضا معلم", form.teacherSigned ? "بله" : "خیر"],
        ["یادداشت", form.notes ? "بله" : "خیر"],
        ["رئیس دیپارتمنت", form.departmentHead],
        ["رئیس برنامه", form.programHead],
        ["رئیس شفاخانه", form.hospitalHead],
      ],
    });

    doc.save(`FormE_${form.name}_${form.fatherName}.pdf`);
  };

  // Export Excel
  const exportExcel = () => {
    const wsData = [
      ["فیلد", "مقدار"],
      ["نام", form.name],
      ["پدر", form.fatherName],
      ["سال", form.year],
      ["سال آموزش", form.trainingYear],
      ["عنوان حادثه", form.incidentTitle],
      ["تاریخ", form.date],
      ["امتیاز", form.score],
      ["میانگین امتیاز", form.averageScore],
      ["معلم", form.teacherName],
      ["امضا معلم", form.teacherSigned ? "بله" : "خیر"],
      ["یادداشت", form.notes ? "بله" : "خیر"],
      ["رئیس دیپارتمنت", form.departmentHead],
      ["رئیس برنامه", form.programHead],
      ["رئیس شفاخانه", form.hospitalHead],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "FormE");
    XLSX.writeFile(wb, `FormE_${form.name}_${form.fatherName}.xlsx`);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">
        فرم E – {form.name} {form.fatherName}
      </h3>

      <table className="table-auto border-collapse border border-slate-300 text-sm w-full">
        <tbody>
          <tr>
            <td className="border px-2 py-1 font-semibold">نام</td>
            <td className="border px-2 py-1">{form.name}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">پدر</td>
            <td className="border px-2 py-1">{form.fatherName}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">سال</td>
            <td className="border px-2 py-1">{form.year}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">سال آموزش</td>
            <td className="border px-2 py-1">{form.trainingYear}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">عنوان حادثه</td>
            <td className="border px-2 py-1">{form.incidentTitle}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">تاریخ</td>
            <td className="border px-2 py-1">{form.date}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">امتیاز</td>
            <td className="border px-2 py-1">{form.score}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">میانگین امتیاز</td>
            <td className="border px-2 py-1">{form.averageScore}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">معلم</td>
            <td className="border px-2 py-1">{form.teacherName}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">امضا معلم</td>
            <td className="border px-2 py-1">
              {form.teacherSigned ? "بله" : "خیر"}
            </td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">یادداشت</td>
            <td className="border px-2 py-1">{form.notes ? "بله" : "خیر"}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">رئیس دیپارتمنت</td>
            <td className="border px-2 py-1">{form.departmentHead}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">رئیس برنامه</td>
            <td className="border px-2 py-1">{form.programHead}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">رئیس شفاخانه</td>
            <td className="border px-2 py-1">{form.hospitalHead}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 space-x-2">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={exportPDF}
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
