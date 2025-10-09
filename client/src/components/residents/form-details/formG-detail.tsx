import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useTrainer } from "../../../context/TrainerContext";

interface FormGDetailsProps {
  residentId: string;
  onClose: () => void;
}

export default function FormGDetails({ residentId, onClose }: FormGDetailsProps) {
  const { trainerId } = useTrainer();
  const printRef = useRef<HTMLDivElement>(null);

  // استایل نمایش و چاپ — توجه: direction: rtl اضافه شده
  const styles = `
    .form-container { font-family: Tahoma, sans-serif; color: #000; direction: rtl; }
    .info-table, .form-table, .sign-table { border-collapse: collapse; width: 100%; margin-bottom: 18px; table-layout: fixed; }
    .info-table td, .form-table th, .form-table td, .sign-table th, .sign-table td {
      border: 1px solid #222;
      padding: 8px 10px;
      text-align: center;
      vertical-align: middle;
      word-break: break-word;
      font-size: 13px;
    }
    .form-table th { background: #f3f4f6; font-weight: 700; }
    .info-label { font-weight: 700; display:block; margin-bottom:6px; }
    .info-value { font-size: 13px; }
    .signature-cell { height: 56px; } /* فضای امضا در هر ردیف جدول */
    .final-sign td { height: 90px; }
    .title { text-align: center; font-weight: 800; margin: 12px 0 18px; font-size: 16px; }
    /* کمی بزرگ‌تر کردن فاصله ستون ها عملا با padding و width انجام شد */
    @page { size: A4 portrait; margin: 10mm; }
    @media print {
      body { -webkit-print-color-adjust: exact; color-adjust: exact; }
      button { display: none !important; }
    }
  `;

  const { data = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/evaluationFormG", trainerId],
    queryFn: () =>
      fetch(`/api/evaluationFormG/trainer/${trainerId}`).then((r) => r.json()),
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data.length) return <div>هیچ فرمی موجود نیست.</div>;

  const form =
    data.find(
      (f) =>
        f.personalInfo?._id === residentId ||
        f.personalInfo?.residentId === residentId ||
        (f._id === residentId)
    ) || data[0];

  if (!form) return <div>فرم مورد نظر پیدا نشد.</div>;

  const emptySignatures = Array(6).fill("");

  // --- Export Excel ---
  const exportExcel = () => {
    const wsData: any[] = [
      ["مشخصات دستیار"],
      ["نام", form.personalInfo?.residentName || ""],
      ["نام پدر", form.personalInfo?.fatherName || ""],
      ["دیپارتمنت", form.personalInfo?.department || ""],
      ["سال آموزش", form.personalInfo?.trainingYear || ""],
      ["سال", form.personalInfo?.year || ""],
      [],
      [
        "شماره",
        "امتحان چهار ماه اول", "", 
        "امتحان چهار ماه دوم", "",
        "امتحان نهایی", "",
        "مجموع",
        "نام استاد",
        "امضای استاد"
      ],
      [
        "",
        "تحریری", "عملی",
        "تحریری", "عملی",
        "تحریری", "عملی",
        "", "", ""
      ],
      ...((form.scores || []).map((row: any, idx: number) => [
        idx + 1,
        row?.exam1Written ?? "",
        row?.exam1Practical ?? "",
        row?.exam2Written ?? "",
        row?.exam2Practical ?? "",
        row?.finalWritten ?? "",
        row?.finalPractical ?? "",
        row?.total ?? "",
        row?.teacherName ?? "",
        emptySignatures[idx] || ""
      ])),
      [],
      ["شف دیپارتمنت", "آمر پروگرام تریننگ", "ریس شفاخانه"],
      ["", "", ""] // ردیف خالی برای امضا در اکسل
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "FormG");
    XLSX.writeFile(
      wb,
      `FormG_${form.personalInfo?.residentName || "resident"}_${form.personalInfo?.fatherName || ""}.xlsx`
    );
  };

  // --- Print only the form (open new window with the form html + styles) ---
  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) return;

    // inject styles and the innerHTML of printRef
    printWindow.document.write(`
      <html lang="fa" dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>پرینت فرم G</title>
          <style>${styles}</style>
        </head>
        <body>
          <div class="form-container">
            ${printRef.current.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // اجازه بده مرورگر یک لحظه صفحه را رندر کند سپس چاپ
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="form-container">
      <style>{styles}</style>

      <div ref={printRef}>
        <h3 className="title">
          فرم G – {form.personalInfo?.residentName || ""} {form.personalInfo?.fatherName || ""}
        </h3>

        {/* معلومات شخصی - دو ردیف منظم (هر ردیف 3 ستون) */}
        <table className="info-table" aria-label="معلومات دستیار">
          <tbody>
            <tr>
              <td>
                <span className="info-label">نام</span>
                <div className="info-value">{form.personalInfo?.residentName || ""}</div>
              </td>
              <td>
                <span className="info-label">ولد</span>
                <div className="info-value">{form.personalInfo?.fatherName || ""}</div>
              </td>
              <td>
                <span className="info-label">سال تریننگ</span>
                <div className="info-value">{form.personalInfo?.trainingYear || ""}</div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="info-label">سال</span>
                <div className="info-value">{form.personalInfo?.year || ""}</div>
              </td>
              <td>
                <span className="info-label">دیپارتمنت</span>
                <div className="info-value">{form.personalInfo?.department || ""}</div>
              </td>
              <td>
                <span className="info-label">&nbsp;</span>
                <div className="info-value">&nbsp;</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* جدول نمرات */}
        <table className="form-table" aria-label="جدول نمرات">
          <thead>
            <tr>
              <th rowSpan={2} style={{ width: "6%" }}>شماره</th>
              <th colSpan={2} style={{ width: "18%" }}>امتحان چهار ماه اول</th>
              <th colSpan={2} style={{ width: "18%" }}>امتحان چهار ماه دوم</th>
              <th colSpan={2} style={{ width: "18%" }}>امتحان نهایی</th>
              <th rowSpan={2} style={{ width: "10%" }}>مجموع</th>
              <th rowSpan={2} style={{ width: "12%" }}>نام استاد</th>
              <th rowSpan={2} style={{ width: "12%" }}>امضای استاد</th>
            </tr>
            <tr>
              <th style={{ width: "9%" }}>تحریری</th>
              <th style={{ width: "9%" }}>عملی</th>
              <th style={{ width: "9%" }}>تحریری</th>
              <th style={{ width: "9%" }}>عملی</th>
              <th style={{ width: "9%" }}>تحریری</th>
              <th style={{ width: "9%" }}>عملی</th>
            </tr>
          </thead>
          <tbody>
            {(form.scores || []).map((row: any, idx: number) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{row?.exam1Written ?? ""}</td>
                <td>{row?.exam1Practical ?? ""}</td>
                <td>{row?.exam2Written ?? ""}</td>
                <td>{row?.exam2Practical ?? ""}</td>
                <td>{row?.finalWritten ?? ""}</td>
                <td>{row?.finalPractical ?? ""}</td>
                <td>{row?.total ?? ""}</td>
                <td>{row?.teacherName ?? ""}</td>
                <td className="signature-cell">{emptySignatures[idx] ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ردیف نهایی امضاها */}
        <table className="sign-table" aria-label="امضاها">
          <thead>
            <tr>
              <th>شف دیپارتمنت</th>
              <th>آمر پروگرام تریننگ</th>
              <th>ریس شفاخانه</th>
            </tr>
          </thead>
          <tbody>
            <tr className="final-sign">
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* دکمه‌ها (بیرون از بخش پرینت) */}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={exportExcel} style={{ background: "#16a34a", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>
          خروجی Excel
        </button>
        <button onClick={handlePrint} style={{ background: "#2563eb", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>
          چاپ / پرینت
        </button>
        <button onClick={onClose} style={{ background: "#6b7280", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>
          بستن
        </button>
      </div>
    </div>
  );
}

