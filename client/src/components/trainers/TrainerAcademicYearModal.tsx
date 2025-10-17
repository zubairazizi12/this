import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface TrainerAcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerId: string;
  trainerName: string;
  onSuccess: () => void;
}

export function TrainerAcademicYearModal({
  isOpen,
  onClose,
  trainerId,
  trainerName,
  onSuccess,
}: TrainerAcademicYearModalProps) {
  const { toast } = useToast();
  const [academicYear, setAcademicYear] = useState("");
  const [calendarYear, setCalendarYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/trainer-academic-years", {
        trainerId,
        academicYear,
        calendarYear,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      toast({
        title: "موفق",
        description: response.data.message,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "خطا",
        description: error.response?.data?.message || "خطا در ثبت سال تحصیلی",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>ثبت سال تحصیلی برای {trainerName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>سال تحصیلی *</Label>
            <Select value={academicYear} onValueChange={setAcademicYear} required>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="سال اول">سال اول</SelectItem>
                <SelectItem value="سال دوم">سال دوم</SelectItem>
                <SelectItem value="سال سوم">سال سوم</SelectItem>
                <SelectItem value="سال چهارم">سال چهارم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>سال تقویمی *</Label>
            <Input
              value={calendarYear}
              onChange={(e) => setCalendarYear(e.target.value)}
              placeholder="مثلاً: 1403"
              required
            />
          </div>

          <div>
            <Label>تاریخ شروع (اختیاری)</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label>تاریخ پایان (اختیاری)</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              لغو
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ثبت..." : "ثبت"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
