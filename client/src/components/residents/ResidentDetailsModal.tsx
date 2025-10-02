// TrainerDetailsModal.tsx
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TrainerDetails from "./resident-details"; // اگر کامپوننت مخصوص ترینر دارید اینجا مسیرش را اصلاح کنید

interface TrainerDetailsModalProps {
  trainerId: string; // آیدی ترینر
  isOpen: boolean; // باز یا بسته بودن
  onClose: () => void; // تابع بستن
}

export default function TrainerDetailsModal({
  trainerId,
  isOpen,
  onClose,
}: TrainerDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="
           w-[80%] h-screen max-w-none max-h-none 
    mt-2 mx-auto    /* mt-2 فاصله کم از بالا / mx-auto وسط چین */
    rounded-xl bg-white 
    overflow-y-auto
  "
      >
        <DialogHeader>
          <DialogTitle>جزئیات ترینر</DialogTitle>
        </DialogHeader>

        {/* اینجا همان جزئیات ترینر را لود می‌کنید */}
        <TrainerDetails trainerId={trainerId} onClose={onClose} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            بستن
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
