import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vacancy {
  id: number;
  name: string;
  count: number;
  date: string;
}

export default function VacantPosts() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newVacancy, setNewVacancy] = useState({
    name: "",
    count: 1,
    date: "",
  });

  // افزودن بست جدید
  const handleAddVacancy = () => {
    const newItem: Vacancy = {
      id: Date.now(),
      name: newVacancy.name,
      count: newVacancy.count,
      date: newVacancy.date,
    };
    setVacancies((prev) => [...prev, newItem]);
    setNewVacancy({ name: "", count: 1, date: "" });
    setOpenDialog(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="p-6 mt-4 space-y-4">
          {/* دکمه افزودن بست */}
          <div className="flex justify-start mb-4">
            <Button onClick={() => setOpenDialog(true)}>افزودن بست جدید</Button>
          </div>

          {/* جدول نمایش بست‌ها */}
          <div className="overflow-x-auto rounded-lg shadow border border-slate-200">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-right">شماره</th>
                  <th className="px-4 py-3 text-right">نام بست</th>
                  <th className="px-4 py-3 text-right">تعداد</th>
                  <th className="px-4 py-3 text-right">تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody>
                {vacancies.length > 0 ? (
                  vacancies.map((v, index) => (
                    <tr
                      key={v.id}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      } hover:bg-slate-100 transition`}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{v.name}</td>
                      <td className="px-4 py-3">{v.count}</td>
                      <td className="px-4 py-3">{v.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-6">
                      هیچ بست ثبت نشده است
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* مودال افزودن بست */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن بست جدید</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>نام بست</Label>
              <Input
                value={newVacancy.name}
                onChange={(e) =>
                  setNewVacancy({ ...newVacancy, name: e.target.value })
                }
                placeholder="مثلاً استاد، کارشناس IT"
              />
            </div>

            <div>
              <Label>تعداد بست</Label>
              <Input
                type="number"
                value={newVacancy.count}
                onChange={(e) =>
                  setNewVacancy({
                    ...newVacancy,
                    count: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>تاریخ ثبت</Label>
              <Input
                type="date"
                value={newVacancy.date}
                onChange={(e) =>
                  setNewVacancy({ ...newVacancy, date: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button onClick={handleAddVacancy}>ثبت بست</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
