import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Lecture {
  _id: string;
  date: string;
  subject: string;
  startTime: string;
  endTime: string;
  room: string;
  notes: string;
  files: string[];
}

interface TrainerLecturesModalProps {
  trainerId: string;
  trainerName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrainerLecturesModal({
  trainerId,
  trainerName,
  isOpen,
  onClose,
}: TrainerLecturesModalProps) {
  const { data: lectures = [], isLoading } = useQuery<Lecture[]>({
    queryKey: ["/api/lectures", trainerId],
    queryFn: async () => {
      const res = await fetch(`/api/lectures?teacherId=${trainerId}`);
      if (!res.ok) throw new Error("Failed to fetch lectures");
      return res.json();
    },
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            لکچرهای {trainerName}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-slate-600">در حال بارگذاری...</p>
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              هیچ لکچری ثبت نشده است
            </div>
          ) : (
            <div className="space-y-3">
              {lectures.map((lecture) => (
                <div
                  key={lecture._id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-600">تاریخ:</span>
                      <p className="text-slate-800">
                        {format(new Date(lecture.date), "yyyy-MM-dd")}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-600">مضمون:</span>
                      <p className="text-slate-800">{lecture.subject}</p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-600">ساعت:</span>
                      <p className="text-slate-800">
                        {lecture.startTime} - {lecture.endTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-600">صنف/تالار:</span>
                      <p className="text-slate-800">{lecture.room}</p>
                    </div>
                    {lecture.notes && (
                      <div className="md:col-span-2">
                        <span className="text-sm font-semibold text-slate-600">توضیحات:</span>
                        <p className="text-slate-800">{lecture.notes}</p>
                      </div>
                    )}
                    {lecture.files && lecture.files.length > 0 && (
                      <div className="md:col-span-2">
                        <span className="text-sm font-semibold text-slate-600">فایل‌ها:</span>
                        <ul className="list-disc list-inside text-slate-800">
                          {lecture.files.map((file, idx) => (
                            <li key={idx}>{file}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
