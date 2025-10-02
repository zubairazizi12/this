import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Users, Presentation, FileText, BarChart3, LogOut, Settings, Settings2, Settings2Icon, SettingsIcon, InfoIcon, FormInputIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import setting from "@/pages/setting"; 
import { info } from "console";
import { Form } from "../ui/form";

const navigation = [
  { name: 'ترینری', href: '/residents', icon: Users },
  { name: 'استادان', href: '/teachers', icon: Users },
  { name: 'گزارشات', href: '/reports', icon: BarChart3 },
  { name: 'فورم ها', href: '/forms', icon: FormInputIcon },
  // { name: 'تنظیمات', href: '/setting', icon: SettingsIcon },
  // { name: 'درباره ما', href: '/about', icon: InfoIcon },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-hospital-green-600">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        
        {/* User Info */}
        <div className="px-4 py-4 border-b border-slate-200">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.profileImageUrl || ''} alt="User profile" />
              <AvatarFallback className="bg-hospital-green-100 text-hospital-green-600">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="mr-3">
              <p className="text-sm font-medium text-slate-900" data-testid="text-user-name">
                {user?.firstName || user?.email || 'User'}
              </p>
              <p className="text-xs text-slate-500 capitalize" data-testid="text-user-role">
                {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + '/');
            
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-hospital-green-50 text-hospital-green-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )} data-testid={`link-${item.name.toLowerCase()}`}>
                  <Icon className="ml-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full flex items-center justify-start px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            data-testid="button-logout"
          >
            <LogOut className="ml-3 h-5 w-5" />
            خروج
          </Button>
        </div>
      </div>
    </div>
  );
}































// import { useState } from "react";
// import { Link, useLocation } from "wouter";
// import { cn } from "@/lib/utils";
// import { useAuth } from "@/hooks/useAuth";
// import { Users, BarChart3, FormInputIcon, LogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const navigation = [
//   { name: 'ترینری', href: '/residents', icon: Users },
//   { name: 'استادان', href: '/teachers', icon: Users },
//   { name: 'گزارشات', href: '/reports', icon: BarChart3 },
//   { name: 'فورم ها', href: '/forms', icon: FormInputIcon },
// ];

// export default function Sidebar() {
//   const [location] = useLocation();
//   const { user } = useAuth();
//   const [isOpen, setIsOpen] = useState(true); // 🔹 کنترل باز/بسته بودن سایدبار

//   const handleLogout = () => {
//     window.location.href = "/api/logout";
//   };

//   return (
//     <div
//       className={cn(
//         "fixed inset-y-0 right-0 z-50 bg-white shadow-lg transition-all duration-300",
//         isOpen ? "w-64" : "w-16"
//       )}
//     >
//       <div className="flex flex-col h-full">
//         {/* Toggle Button */}
//         <div className="flex justify-between items-center h-16 px-2 bg-hospital-green-600">
//           {isOpen && <span className="text-white font-semibold">سیستم مدیریت شفاخانه</span>}
//           <Button
//             onClick={() => setIsOpen(!isOpen)}
//             variant="ghost"
//             size="sm"
//             className="text-white"
//           >
//             {isOpen ? '<' : '>'}
//           </Button>
//         </div>

//         {/* User Info */}
//         {isOpen && (
//           <div className="px-4 py-4 border-b border-slate-200">
//             <div className="flex items-center">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src={user?.profileImageUrl || ''} alt="User profile" />
//                 <AvatarFallback className="bg-hospital-green-100 text-hospital-green-600">
//                   {user?.firstName?.[0] || user?.email?.[0] || 'U'}
//                 </AvatarFallback>
//               </Avatar>
//               <div className="mr-3">
//                 <p className="text-sm font-medium text-slate-900">{user?.firstName || user?.email || 'User'}</p>
//                 <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation */}
//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {navigation.map((item) => {
//             const Icon = item.icon;
//             const isActive = location === item.href || location.startsWith(item.href + '/');

//             return (
//               <Link key={item.name} href={item.href}>
//                 <a
//                   className={cn(
//                     "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
//                     isActive
//                       ? "bg-hospital-green-50 text-hospital-green-700"
//                       : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                   )}
//                 >
//                   <Icon className="ml-3 h-5 w-5" />
//                   {isOpen && <span>{item.name}</span>}
//                 </a>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="px-2 py-4 border-t border-slate-200">
//           <Button
//             onClick={handleLogout}
//             variant="ghost"
//             className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//           >
//             <LogOut className="ml-2 h-5 w-5" />
//             {isOpen && <span>خروج</span>}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
