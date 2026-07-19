import { Settings, Folder, Tag, BookOpen, MessageSquare, Layers, Briefcase } from "lucide-react";
import { Card } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  unreadCount: number;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  onBackToPortfolio?: () => void;
}

export default function AdminSidebar({ activeTab, unreadCount, onTabChange }: AdminSidebarProps) {
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
      <Card className="overflow-hidden sticky top-24 py-0 gap-0 flex flex-row flex-wrap lg:flex-col">
        <p className="hidden lg:block px-5 pt-5 pb-3 text-[9px] font-bold uppercase tracking-[0.2em] font-mono text-muted-foreground">
          Manage
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex-1 min-w-[150px] lg:w-full px-5 py-3.5 text-left font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent",
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="hidden lg:block absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground/30" />
              )}
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate flex-1">{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <Badge
                  variant={isActive ? "secondary" : "destructive"}
                  className="flex-shrink-0 min-w-[20px] h-5 px-1.5 justify-center text-[10px] font-mono font-bold"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
        <div className="hidden lg:block px-5 py-4 mt-2 border-t border-dashed text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
          Changes publish instantly
        </div>
      </Card>
    </div>
  );
}
