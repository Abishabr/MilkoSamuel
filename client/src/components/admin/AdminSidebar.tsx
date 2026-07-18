import { Settings, Folder, Tag, BookOpen, MessageSquare, LogOut, Layers, Briefcase } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface AdminSidebarProps {
  activeTab: string;
  unreadCount: number;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onBackToPortfolio?: () => void;
}

export default function AdminSidebar({ activeTab, unreadCount, onTabChange, onLogout, onBackToPortfolio }: AdminSidebarProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const navItems = [
    { id: "settings", label: "Settings & Stats", icon: Settings },
    { id: "projects", label: "Projects CRUD", icon: Folder },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "services", label: "Services & Skills", icon: Layers },
    { id: "process", label: "Process & Philosophy", icon: BookOpen },
    { id: "experiences", label: "History & Socials", icon: Briefcase },
    { id: "messages", label: `Inbox Messages (${unreadCount})`, icon: MessageSquare },
  ];

  return (
    <div className="lg:col-span-3 space-y-4">
      <div className={`p-6 border transition-colors ${
        isLight ? "bg-white border-black/10 text-black" : "bg-[#111111] border-white/10 text-white"
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-3 h-3 rounded-full bg-green-500 animate-pulse`} />
          <div>
            <p className="text-xs font-extrabold uppercase font-sans">Milko Samuel</p>
            <p className="text-[10px] text-gray-500 font-mono">ADMINISTRATOR</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className={`w-full py-2.5 mt-2 border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isLight
              ? "border-black/10 hover:border-black hover:bg-black/5 text-black"
              : "border-white/10 hover:border-white hover:bg-white/5 text-white"
          }`}
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>

        {onBackToPortfolio && (
          <button
            onClick={onBackToPortfolio}
            className={`w-full py-2.5 mt-2 border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLight
                ? "border-black/10 hover:border-black hover:bg-black/5 text-black"
                : "border-white/10 hover:border-white hover:bg-white/5 text-white"
            }`}
          >
            ← Exit to Portfolio
          </button>
        )}
      </div>

      {/* Nav Items Panel */}
      <nav className={`border flex flex-wrap lg:flex-col overflow-hidden transition-colors ${
        isLight ? "bg-white border-black/10" : "bg-[#111111] border-white/10"
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 min-w-[150px] lg:w-full px-5 py-4 text-left font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all duration-150 ${
                isActive
                  ? (isLight ? "bg-black text-white" : "bg-white text-black")
                  : (isLight ? "text-gray-500 hover:text-black hover:bg-zinc-50" : "text-gray-400 hover:text-white hover:bg-zinc-900")
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
