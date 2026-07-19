import { Settings, Folder, Tag, BookOpen, MessageSquare, Layers, Briefcase } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface AdminSidebarProps {
  activeTab: string;
  unreadCount: number;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  onBackToPortfolio?: () => void;
}

export default function AdminSidebar({ activeTab, unreadCount, onTabChange }: AdminSidebarProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const navItems = [
    { id: "settings", label: "Settings & Stats", icon: Settings },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "services", label: "Services & Skills", icon: Layers },
    { id: "process", label: "Process & Philosophy", icon: BookOpen },
    { id: "experiences", label: "History & Socials", icon: Briefcase },
    { id: "messages", label: "Inbox", icon: MessageSquare, badge: unreadCount },
  ];

  return (
    <div className="lg:col-span-3">
      <nav className={`border overflow-hidden transition-colors sticky top-24 flex flex-wrap lg:flex-col ${
        isLight ? "bg-white border-black/10" : "bg-[#111111] border-white/10"
      }`}>
        <p className={`hidden lg:block px-5 pt-5 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] font-mono ${
          isLight ? "text-gray-400" : "text-gray-500"
        }`}>
          Manage
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex-1 min-w-[150px] lg:w-full px-5 py-3.5 text-left font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all duration-150 cursor-pointer ${
                isActive
                  ? (isLight ? "bg-black text-white" : "bg-white text-black")
                  : (isLight ? "text-gray-500 hover:text-black hover:bg-zinc-50" : "text-gray-400 hover:text-white hover:bg-zinc-900")
              }`}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className={`hidden lg:block absolute left-0 top-0 bottom-0 w-1 ${
                  isLight ? "bg-white/30" : "bg-black/20"
                }`} />
              )}
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate flex-1">{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className={`flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-mono font-bold ${
                  isActive
                    ? (isLight ? "bg-white text-black" : "bg-black text-white")
                    : "bg-red-500 text-white"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
        <div className={`hidden lg:block px-5 py-4 mt-2 border-t border-dashed text-[9px] font-mono uppercase tracking-widest ${
          isLight ? "border-black/10 text-gray-400" : "border-white/10 text-gray-500"
        }`}>
          Changes publish instantly
        </div>
      </nav>
    </div>
  );
}
