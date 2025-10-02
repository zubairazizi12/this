import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormDialog({ isOpen, onClose, onSuccess }: UserFormDialogProps) {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // نقش پیش‌فرض
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/users", { firstName, email, role });
      toast({ title: "موفقیت", description: "کاربر جدید ثبت شد" });
      setFirstName("");
      setEmail("");
      setRole("user");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast({ title: "خطا", description: err.message || "ثبت کاربر با خطا مواجه شد", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>ثبت کاربر جدید</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">نام</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">ایمیل</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1">نقش</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="user">کاربر عادی</option>
              <option value="admin">مدیر</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              ثبت کاربر
            </Button>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              لغو
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
