import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { User } from "@shared/schema";

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingUser?: User | null;
}

export default function UserFormDialog({ isOpen, onClose, onSuccess, editingUser }: UserFormDialogProps) {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFirstName(editingUser.firstName || "");
      setLastName(editingUser.lastName || "");
      setEmail(editingUser.email || "");
      setRole(editingUser.role || "viewer");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("viewer");
    }
  }, [editingUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser._id}`, { firstName, lastName, email, role });
        toast({ title: "موفقیت", description: "کاربر به‌روزرسانی شد" });
      } else {
        await axios.post("/api/users", { firstName, lastName, email, role });
        toast({ title: "موفقیت", description: "کاربر جدید ثبت شد" });
      }
      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("viewer");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast({ 
        title: "خطا", 
        description: err.response?.data?.message || err.message || "عملیات با خطا مواجه شد", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editingUser ? "ویرایش کاربر" : "افزودن کاربر جدید"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">نام</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">نام خانوادگی</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">ایمیل</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">نقش</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-md p-2 bg-white"
              required
            >
              <option value="viewer">بیننده (Viewer)</option>
              <option value="admin">مدیر (Admin)</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              لغو
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ارسال..." : editingUser ? "به‌روزرسانی" : "افزودن کاربر"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
