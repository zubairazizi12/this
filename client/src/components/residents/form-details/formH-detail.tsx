import { useQuery } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useTrainer } from "../../../context/TrainerContext"; // ← مثلاً
interface TrainingYear {
  year: string;
  totalScore: number | string;
  instructor: string;
}

interface FormHDetailsProps {
  residentId: string;
  onClose: () => void;
}
export default function FormHDetails({
  residentId,
  onClose,
}: FormHDetailsProps) {
  const { trainerId } = useTrainer();

  const { data = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/evaluationFormH", trainerId],
    queryFn: () =>
      fetch(`/api/evaluationFormH?trainerId=${trainerId}`).then((r) =>
        r.json()
      ),
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (!data.length) return <div>هیچ فرمی موجود نیست</div>;

  // مقایسه با همان فیلد trainer
  const form = data.find(
    (f: any) => f.trainer === residentId || f.trainer?._id === residentId
  );

  if (!form) return <div>فرم مورد نظر پیدا نشد.</div>;

  // آرایه کامل چهار سال
  const allYears = ["سال اول", "سال دوم", "سال سوم", "سال چهارم"];
  const trainingYears: TrainingYear[] = allYears.map((y) => {
    const found = (form.trainingYears || []).find(
      (ty: TrainingYear) => ty.year === y
    );
    return found ? found : { year: y, totalScore: "", instructor: "" }; // اگر سال پر نشده بود، خالی قرار بده
  });

  const exportExcel = () => {
    const wsData: any[] = [
      ["مشخصات دستیار"],
      ["نام", form.residentName],
      ["نام پدر", form.fatherName],
      ["دیپارتمنت", form.department],
      [""],
      ["سال ترینی", "مجموع نمرات", "نام استاد", "امضا استاد"],
    ];

    trainingYears.forEach((y) => {
      wsData.push([y.year, y.totalScore, y.instructor, ""]);
    });

    wsData.push(["", "اوسط نمرات", form.averageScore, ""]);
    wsData.push(["", "", "امضای ریاست", ""]);

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "FormH");
    XLSX.writeFile(wb, `FormH_${form.residentName}_${form.fatherName}.xlsx`);
  };

  const printPage = () => {
    window.print();
  };

  return (
    <div className="p-4 print:p-0">
      <h3 className="text-lg font-bold mb-4 text-center">
        فرم H – {form.residentName} {form.fatherName}
      </h3>

      {/* مشخصات */}
      <table className="table-auto border-collapse border border-slate-300 text-sm w-full mb-4">
        <tbody>
          <tr>
            <td className="border px-2 py-1 font-semibold">نام</td>
            <td className="border px-2 py-1">{form.residentName}</td>
            <td className="border px-2 py-1 font-semibold">نام پدر</td>
            <td className="border px-2 py-1">{form.fatherName}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">دیپارتمنت</td>
            <td className="border px-2 py-1">{form.department}</td>
            <td className="border px-2 py-1 font-semibold">شف دپارتمان</td>
            <td className="border px-2 py-1">{form.shiftDepartment}</td>
          </tr>
          <tr>
            <td className="border px-2 py-1 font-semibold">
              آمر برنامه آموزشی
            </td>
            <td className="border px-2 py-1">{form.programDirector}</td>
            <td className="border px-2 py-1 font-semibold">امضای ریاست</td>
            <td className="border px-2 py-1"></td>
          </tr>
        </tbody>
      </table>

      {/* جدول چهار سال ترینی */}
      <table className="table-auto border-collapse border border-slate-300 text-sm w-full">
        <thead>
          <tr>
            <th className="border px-2 py-1">سال ترینی</th>
            <th className="border px-2 py-1">مجموع نمرات</th>
            <th className="border px-2 py-1">نام استاد</th>
            <th className="border px-2 py-1">امضای استاد</th>
          </tr>
        </thead>
        <tbody>
          {trainingYears.map((y, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{y.year}</td>
              <td className="border px-2 py-1">{y.totalScore}</td>
              <td className="border px-2 py-1">{y.instructor}</td>
              <td className="border px-2 py-1"></td>
            </tr>
          ))}
          <tr>
            <td className="border px-2 py-1"></td>
            <td className="border px-2 py-1 font-semibold">اوسط نمرات</td>
            <td className="border px-2 py-1">{form.averageScore}</td>
            <td className="border px-2 py-1"></td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 flex space-x-2">
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={exportExcel}
        >
          چاپ Excel
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={printPage}
        >
          چاپ PDF / پرینت مرورگر
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
