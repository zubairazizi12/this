import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, Award, Presentation, User } from "lucide-react";

const reports = [
  {
    title: "گزارشات ترینری",
    // description: "Comprehensive resident profiles with forms completion status",
    icon: Users,
    color: "bg-hospital-green-100 text-hospital-green-600",
    buttonColor: "bg-hospital-green-600 hover:bg-hospital-green-700",
  },
  {
    title: "گزارشات فورم ها", 
    // description: "Training form completion tracking and analysis",
    icon: FileText,
    color: "bg-blue-100 text-blue-600",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  // {
  //   title: "گزارشات مجازات",
  //   // description: "Actions and incidents tracking across all residents",
  //   icon: AlertTriangle,
  //   color: "bg-red-100 text-red-600",
  //   buttonColor: "bg-red-600 hover:bg-red-700",
  // },
  // {
  //   title: "گزارشات مکافات",
  //   // description: "Achievement and recognition tracking system",
  //   icon: Award,
  //   color: "bg-yellow-100 text-yellow-600",
  //   buttonColor: "bg-yellow-600 hover:bg-yellow-700",
  // },
  {
    title: "گزارشات استادان",
    // description: "Faculty member profiles and supervision tracking",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
];

export default function ReportCards() {
  const handleGenerateReport = (reportType: string) => {
    // TODO: Implement report generation
    console.log(`Generating ${reportType} report`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => {
        const Icon = report.icon;
        return (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg ${report.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
                  {/* <p className="text-sm text-slate-600">{report.description}</p> */}
                </div>
              </div>
              <Button
                onClick={() => handleGenerateReport(report.title)}
                className={`w-full text-white ${report.buttonColor}`}
                data-testid={`button-generate-${report.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
