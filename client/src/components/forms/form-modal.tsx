// FormModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import type { Form } from "@shared/schema";

// Import your custom form components
import EvaluationFormHStyled from "@/components/forms/form-H";
import EvaluationFormE from "@/components/forms/Form-E";
import EvaluationFormD from "@/components/forms/form-D";
import MonographEvaluationForm from "@/components/forms/form-k";
import EvaluationFormG from "@/components/forms/form-G";
import MonographEvaluationFormC from "@/components/forms/form-c";
import TeacherActivityForm from "@/components/forms/formJ";
import ChecklistForm from "@/components/forms/formF";
import RotationForm from "@/components/forms/formI";
interface FormModalProps {
  form: Form;
  onClose: () => void;
}

const FORM_TITLES: Record<string, string> = {
  J: "Initial Assessment & Orientation",
  F: "Mid-Training Evaluation",
  D: "Clinical Skills Assessment",
  I: "Research & Academic Progress",
  G: "Communication Skills Review",
  E: "Ethics & Professionalism",
  C: "Case Presentation Evaluation",
  H: "Hands-on Procedure Assessment",
  K: "Final Competency Evaluation",
};

import { useTrainer } from "@/context/TrainerContext";

export default function FormModal({ form, onClose }: FormModalProps) {
  if (!form) return null; // ← اینجا اضافه کنید
  const { user } = useAuth();
  const { trainerId } = useTrainer(); // 👈 اینجا trainerId گرفتیم
  const [formData, setFormData] = useState((form.formData as any) || {});

  const isReadOnly = user?.role !== "admin";
  const formTitle = FORM_TITLES[form.formType] || "Form Details";

  const handleSave = () => {
    // TODO: Implement form save functionality
    console.log("Saving form:", formData);
    onClose();
  };

  const renderFormContent = () => {
    switch (form.formType) {
      case "J":
        return <TeacherActivityForm />;
      case "F":
        return <ChecklistForm />;
      case "I":
        return <RotationForm />;
      case "H":
        return <EvaluationFormHStyled />;
      case "E":
        return <EvaluationFormE />;
      case "D":
        return <EvaluationFormD />;
      case "K":
        return <MonographEvaluationForm />;
      case "G":
        return <EvaluationFormG />;
      case "C":
        return <MonographEvaluationFormC />;
      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assessmentDate">Assessment Date</Label>
                <Input
                  id="assessmentDate"
                  type="date"
                  value={formData.assessmentDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, assessmentDate: e.target.value })
                  }
                  readOnly={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="supervisor">Supervisor</Label>
                <Select
                  value={formData.supervisorId || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, supervisorId: value })
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dr. Michael Chen</SelectItem>
                    <SelectItem value="2">Dr. Emily Rodriguez</SelectItem>
                    <SelectItem value="3">Dr. Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="rating">Overall Rating</Label>
              <Select
                value={formData.rating || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, rating: value })
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="satisfactory">Satisfactory</SelectItem>
                  <SelectItem value="needs-improvement">
                    Needs Improvement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="strengths">Strengths</Label>
              <Textarea
                id="strengths"
                placeholder="Describe the resident's strengths..."
                value={formData.strengths || ""}
                onChange={(e) =>
                  setFormData({ ...formData, strengths: e.target.value })
                }
                readOnly={isReadOnly}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="areasForImprovement">Areas for Improvement</Label>
              <Textarea
                id="areasForImprovement"
                placeholder="Describe areas that need improvement..."
                value={formData.areasForImprovement || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    areasForImprovement: e.target.value,
                  })
                }
                readOnly={isReadOnly}
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Form {form.formType} - {formTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">{renderFormContent()}</div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-200 mt-6 space-x-3">
          <Button variant="outline" onClick={onClose}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button
              onClick={handleSave}
              className="bg-hospital-green-600 hover:bg-hospital-green-700"
            >
              Save Changes
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
