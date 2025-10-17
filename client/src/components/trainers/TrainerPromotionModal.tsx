import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface TrainerPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerId: string;
  trainerName: string;
  currentYear: string;
  onSuccess: () => void;
}

export function TrainerPromotionModal({
  isOpen,
  onClose,
  trainerId,
  trainerName,
  currentYear,
  onSuccess,
}: TrainerPromotionModalProps) {
  const { toast } = useToast();
  const [newCalendarYear, setNewCalendarYear] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePromote = async () => {
    if (!newCalendarYear) {
      toast({
        title: "خطا",
        description: "لطفاً سال تقویمی جدید را وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`/api/trainer-academic-years/trainer/${trainerId}/promote`, {
        newCalendarYear,
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
        description: error.response?.data?.message || "خطا در ارتقای ترینر",
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
          <DialogTitle>ارتقای صنف برای {trainerName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              سال تحصیلی فعلی: <span className="font-semibold">{currentYear}</span>
            </p>
          </div>

          <div>
            <Label>سال تقویمی جدید *</Label>
            <Input
              value={newCalendarYear}
              onChange={(e) => setNewCalendarYear(e.target.value)}
              placeholder="مثلاً: 1404"
              required
            />
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ با ارتقا، این ترینر به سال تحصیلی بعدی منتقل می‌شود و فورم‌های جدید برای سال جدید ثبت خواهد شد.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              لغو
            </Button>
            <Button onClick={handlePromote} disabled={loading}>
              {loading ? "در حال ارتقا..." : "ارتقا"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
