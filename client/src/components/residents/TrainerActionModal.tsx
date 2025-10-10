import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, Save, Trash2 } from "lucide-react";

interface TrainerActionModalProps {
  trainerId: string;
  trainerName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface TrainerAction {
  _id: string;
  trainer: string;
  description: string;
  selectedForms: string[];
  createdAt: string;
  updatedAt: string;
}

const FORM_TYPES = [
  { type: "J", name: "Initial Assessment" },
  { type: "F", name: "Mid-Training Evaluation" },
  { type: "D", name: "Clinical Skills" },
  { type: "I", name: "Research Progress" },
  { type: "G", name: "Communication Skills" },
  { type: "E", name: "Ethics & Professionalism" },
  { type: "C", name: "Case Presentation" },
  { type: "H", name: "Hands-on Procedure" },
  { type: "K", name: "Final Competency" },
];

export default function TrainerActionModal({
  trainerId,
  trainerName,
  isOpen,
  onClose,
}: TrainerActionModalProps) {
  const [description, setDescription] = useState("");
  const [selectedForms, setSelectedForms] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: actions = [], isLoading } = useQuery<TrainerAction[]>({
    queryKey: ["trainer-actions", trainerId],
    queryFn: async () => {
      const res = await fetch(`/api/trainer-actions/${trainerId}`);
      if (!res.ok) throw new Error("خطا در دریافت اکشن‌ها");
      return res.json();
    },
    enabled: isOpen && !!trainerId,
  });

  const createActionMutation = useMutation({
    mutationFn: async (data: {
      trainerId: string;
      description: string;
      selectedForms: string[];
    }) => {
      const res = await fetch("/api/trainer-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("خطا در ثبت اکشن");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-actions", trainerId] });
      setDescription("");
      setSelectedForms([]);
    },
  });

  const deleteActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      const res = await fetch(`/api/trainer-actions/${actionId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("خطا در حذف اکشن");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-actions", trainerId] });
    },
  });

  const handleFormToggle = (formType: string) => {
    setSelectedForms((prev) =>
      prev.includes(formType)
        ? prev.filter((f) => f !== formType)
        : [...prev, formType]
    );
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert("لطفاً توضیحات را وارد کنید");
      return;
    }

    createActionMutation.mutate({
      trainerId,
      description: description.trim(),
      selectedForms,
    });
  };

  const handleDelete = (actionId: string) => {
    if (confirm("آیا از حذف این اکشن اطمینان دارید؟")) {
      deleteActionMutation.mutate(actionId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            اکشن‌های ترینری: {trainerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* بخش ثبت اکشن جدید */}
          <div className="border rounded-lg p-4 bg-slate-50">
            <h3 className="text-lg font-semibold mb-4">ثبت اکشن جدید</h3>

            {/* توضیحات */}
            <div className="mb-4">
              <Label htmlFor="description" className="mb-2 block">
                توضیحات
              </Label>
              <Textarea
                id="description"
                placeholder="توضیحات اکشن را وارد کنید..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* انتخاب فرم‌ها */}
            <div className="mb-4">
              <Label className="mb-3 block">انتخاب فرم‌ها</Label>
              <div className="grid grid-cols-3 gap-3">
                {FORM_TYPES.map((form) => (
                  <div key={form.type} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={`form-${form.type}`}
                      checked={selectedForms.includes(form.type)}
                      onCheckedChange={() => handleFormToggle(form.type)}
                    />
                    <Label
                      htmlFor={`form-${form.type}`}
                      className="text-sm cursor-pointer"
                    >
                      فرم {form.type} - {form.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* دکمه ثبت */}
            <Button
              onClick={handleSubmit}
              disabled={createActionMutation.isPending}
              className="w-full bg-hospital-green-600 hover:bg-hospital-green-700"
            >
              <Save className="h-4 w-4 ml-2" />
              {createActionMutation.isPending ? "در حال ثبت..." : "ثبت اکشن"}
            </Button>
          </div>

          {/* لیست اکشن‌های ثبت شده */}
          <div>
            <h3 className="text-lg font-semibold mb-4">اکشن‌های ثبت شده</h3>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hospital-green-500 mx-auto"></div>
              </div>
            ) : actions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                هیچ اکشنی ثبت نشده است
              </div>
            ) : (
              <div className="space-y-4">
                {actions.map((action) => (
                  <div
                    key={action._id}
                    className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 mb-2">
                          تاریخ:{" "}
                          {new Date(action.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                        <p className="text-base">{action.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(action._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* نمایش فرم‌های انتخاب شده */}
                    {action.selectedForms && action.selectedForms.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-semibold text-slate-600 mb-2">
                          فرم‌های انتخاب شده:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {action.selectedForms.map((formType) => {
                            const form = FORM_TYPES.find((f) => f.type === formType);
                            return (
                              <span
                                key={formType}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-hospital-green-100 text-hospital-green-800"
                              >
                                فرم {formType}
                                {form && ` - ${form.name}`}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
