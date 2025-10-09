import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useRef } from "react";
import { useTrainer } from "../../../context/TrainerContext";

interface FormKDetailsProps {
  residentId?: string;
  onClose: () => void;
}

export default function MonographEvaluationDisplay({
  residentId,
  onClose,
}: FormKDetailsProps) {
  const { trainerId } = useTrainer();
  const { data, isLoading } = useQuery<any>({
    queryKey: ["/api/monographEvaluation", trainerId],
    queryFn: () =>
      fetch(`/api/monographEvaluation?trainerId=${trainerId}`).then((r) =>
        r.json()
      ),
    enabled: !!trainerId,
  });

  const printRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data || !data.length) return <div>هیچ فرمی موجود نیست</div>;

  // پیدا کردن فرم بر اساس trainerId یا residentId
  const form = data.find(
    (f: any) => f.trainer === residentId || f.trainer?._id === residentId
  );

  if (!form) return <div>فرم مورد نظر پیدا نشد.</div>;

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const newWin = window.open("", "_blank");
      if (newWin) {
        newWin.document.write(`
          <html>
            <head>
              <title>چاپ فرم مونوگراف</title>
              <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #333; padding: 4px; text-align: center; }
                th { background: #eee; }
                body { font-family: sans-serif; direction: rtl; }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        newWin.document.close();
        newWin.print();
      }
    }
  };

  const exportExcel = () => {
    const wsData: any[] = [
      [
        "بخش",
        "فیصدی",
        "نمره داده شده",
        "اسم استاد",
        "امضا",
        "ویژگی‌ها",
        "مجموع",
        "میانگین",
        "یادداشت‌ها",
      ],
      ...form.evaluations.map((e: any) => [
        e.section,
        e.percentage,
        e.score,
        e.teacherName,
        e.teacherSigned ? "بله" : "خیر",
        e.characteristics,
        e.total,
        e.average,
        e.notes,
      ]),
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "MonographEvaluation");
    XLSX.writeFile(wb, `Monograph_${form.name}_${form.fatherName}.xlsx`);
  };

  return (
    <div className="p-4">
      <div ref={printRef}>
        <h3 className="text-lg font-bold mb-2 text-center">
          فرم ارزیابی مونوگراف – {form.name} {form.fatherName}
        </h3>

        {/* مشخصات دو ردیف */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={form.name}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
          <input
            type="text"
            value={form.lastName}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
          <input
            type="text"
            value={form.fatherName}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
          <input
            type="text"
            value={form.idNumber}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
          <input
            type="text"
            value={form.field}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
          <input
            type="text"
            value={form.trainingYear}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
          <input
            type="text"
            value={form.startYear}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
          <input
            type="text"
            value={form.date}
            readOnly
            className="border px-2 py-1 w-full text-center"
          />
        </div>

        {/* جدول ارزیابی */}
        {/* جدول ارزیابی */}
        <table className="table-auto border-collapse border w-full text-center mb-4">
          <thead>
            <tr>
              <th>بخش</th>
              <th>فیصدی</th>
              <th>نمره داده شده</th>
              <th>اسم استاد</th>
            </tr>
          </thead>
          <tbody>
            {form.evaluations.map((e: any, idx: number) => (
              <tr key={idx}>
                <td>{e.section}</td>
                <td>{e.percentage}</td>
                <td>{e.score}</td>
                <td>{e.teacherName}</td>
                
              </tr>
            ))}

            {/* ردیف مجموع و اوسط */}
            <tr>
              <td  className="border px-2 py-2 font-bold">
                مجموع
              </td>
              <td  className="border px-2 py-2">
                {form.evaluations[0]?.total}
              </td>
              <td  className="border px-2 py-2 font-bold">
                اوسط
              </td>
              <td  className="border px-2 py-2">
                {form.evaluations[0]?.average}
              </td>

            </tr>
            

            {/* ردیف یادداشت‌ها */}
            <tr>
              <td colSpan={6} className="border px-2 py-2 text-right">
                {form.evaluations[0]?.notes}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handlePrint}
        >
          چاپ PDF
        </button>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={exportExcel}
        >
          خروجی Excel
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
