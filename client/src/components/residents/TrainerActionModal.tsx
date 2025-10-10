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
import { Label } from "@/components/ui/label";
import { X, Save, Trash2, Upload, FileText, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface TrainerActionModalProps {
  trainerId: string;
  trainerName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FileInfo {
  filename: string;
  originalName: string;
  path: string;
  size: number;
}

interface TrainerAction {
  _id: string;
  trainer: string;
  description: string;
  files: FileInfo[];
  createdAt: string;
  updatedAt: string;
}

export default function TrainerActionModal({
  trainerId,
  trainerName,
  isOpen,
  onClose,
}: TrainerActionModalProps) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/trainer-actions", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("خطا در ثبت اکشن");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-actions", trainerId] });
      setDescription("");
      setSelectedFiles([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      alert("لطفاً توضیحات را وارد کنید");
      return;
    }

    const formData = new FormData();
    formData.append("trainerId", trainerId);
    formData.append("description", description.trim());
    
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    createActionMutation.mutate(formData);
  };

  const handleDelete = (actionId: string) => {
    if (confirm("آیا از حذف این اکشن اطمینان دارید؟")) {
      deleteActionMutation.mutate(actionId);
    }
  };

  const handleDownload = (filename: string, originalName: string) => {
    const link = document.createElement("a");
    link.href = `/api/trainer-actions/download/${filename}`;
    link.download = originalName;
    link.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
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
          {user?.role === "admin" && (
            <div className="border rounded-lg p-4 bg-slate-50">
              <h3 className="text-lg font-semibold mb-4">ثبت اکشن جدید</h3>

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

              <div className="mb-4">
                <Label htmlFor="files" className="mb-2 block">
                  آپلود فایل‌ها (حداکثر 10 فایل)
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-hospital-green-500 transition-colors">
                  <input
                    type="file"
                    id="files"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="files"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      کلیک کنید یا فایل‌ها را بکشید و رها کنید
                    </span>
                    <span className="text-xs text-slate-400">
                      حداکثر حجم هر فایل: 10MB
                    </span>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-slate-600">
                      فایل‌های انتخاب شده:
                    </p>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-white border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-slate-400">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createActionMutation.isPending}
                className="w-full bg-hospital-green-600 hover:bg-hospital-green-700"
              >
                <Save className="h-4 w-4 ml-2" />
                {createActionMutation.isPending ? "در حال ثبت..." : "ثبت اکشن"}
              </Button>
            </div>
          )}

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
                      {user?.role === "admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(action._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {action.files && action.files.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-semibold text-slate-600 mb-2">
                          فایل‌های پیوست شده:
                        </p>
                        <div className="space-y-2">
                          {action.files.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-slate-500" />
                                <span className="text-sm">{file.originalName}</span>
                                <span className="text-xs text-slate-400">
                                  ({formatFileSize(file.size)})
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(file.filename, file.originalName)}
                                className="text-hospital-green-600 hover:text-hospital-green-700"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
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
