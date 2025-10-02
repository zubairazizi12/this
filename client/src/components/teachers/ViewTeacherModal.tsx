import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Teacher } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ViewTeacherModalProps {
  teacher: Teacher | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewTeacherModal({ teacher, open, onClose }: ViewTeacherModalProps) {
  if (!teacher) return null;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "نامشخص";
    try {
      return new Date(date).toLocaleDateString("fa-AF");
    } catch {
      return "نامشخص";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-300">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4 rtl:space-x-reverse">
            <Avatar className="h-14 w-14">
              <AvatarImage src={teacher.profileImageUrl || ""} alt={teacher.name} />
              <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xl font-semibold">{teacher.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <InfoItem label="نام" value={teacher.name} />

          <InfoItem label="نام پدر" value={teacher.fatherName} />
          <InfoItem label="نام پدر کلان" value={teacher.grandfatherName} />
          <InfoItem label="رتبه علمی" value={teacher.academicRank} />
          <InfoItem label="تاریخ اخذ رتبه" value={formatDate(teacher.rankAchievementDate)} />
          <InfoItem label="تاریخ تقرری مربی" value={formatDate(teacher.trainerAppointmentDate)} />
          <InfoItem label="جنسیت" value={teacher.gender} />
          <InfoItem label="ولایت" value={teacher.province} />
          <InfoItem label="مضمون" value={teacher.subject} />
          <InfoItem label="وظیفه / موقف" value={teacher.position} />
          <InfoItem label="شفاخانه" value={teacher.hospital} />
          <InfoItem label="تاریخ تولد" value={formatDate(teacher.dateOfBirth)} />
          <InfoItem label="نمبر تذکره" value={teacher.idNumber} />
          <InfoItem label="تاریخ شروع وظیفه" value={formatDate(teacher.dutyStartDate)} />
          <InfoItem label="شماره تماس" value={teacher.contactInfo} />
          <InfoItem label="نمبر واتساپ" value={teacher.whatsappNumber} />
          <InfoItem label="ایمیل آدرس" value={teacher.emailAddress} />
          <InfoItem label="کود پوست" value={teacher.postCode} />
          <InfoItem label="نوع تقرری" value={teacher.appointmentType} />
          <InfoItem label="دیپارتمنت" value={teacher.department} />
          <InfoItem label="تجربه کاری" value={`${teacher.experience} سال`} />
          <InfoItem
            label="وضعیت"
            value={
              <Badge
                className={
                  teacher.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {teacher.status === "active" ? "برحال" : "منفک"}
              </Badge>
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white">
            پرینت / PDF
          </Button >
            <Button onClick={onClose} variant="outline" className="bg-red-600 hover:bg-blue-700 text-white">
    بستن
  </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-slate-800 dark:text-slate-200">{value || "نامشخص"}</p>
    </div>
  );
}
