import { Settings, Folder, Tag, BookOpen, MessageSquare, Layers, Briefcase, ExternalLink, LogOut } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";

interface AdminSidebarProps {
  activeTab: string;
  unreadCount: number;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  onBackToPortfolio?: () => void;
}

export default function AdminSidebar({
  activeTab,
  unreadCount,
  onTabChange,
  onLogout,
  onBackToPortfolio,
}: AdminSidebarProps) {
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
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col z-40 border-r bg-background transition-colors duration-300">
      {/* Brand lockup */}
      <div className="p-8 border-b">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center font-extrabold text-sm bg-primary text-primary-foreground border border-primary flex-shrink-0">
            SM
          </div>
          <div className="leading-none">
            <h1 className="text-sm font-extrabold uppercase tracking-[0.1em] text-foreground">Obsidian</h1>
            <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground mt-1">Admin Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <p className="px-8 text-[9px] font-bold tracking-[0.3em] uppercase text-muted-foreground mb-4">
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
                "group relative w-full px-8 py-4 text-left font-bold text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 transition-colors duration-150 cursor-pointer",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
              )}
            >
              {/* Lit-from-within active edge */}
              {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
              <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              <span className="truncate flex-1">{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <Badge
                  variant="destructive"
                  className="flex-shrink-0 min-w-[20px] h-5 px-1.5 justify-center"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="border-t">
        {onBackToPortfolio && (
          <button
            onClick={onBackToPortfolio}
            className="w-full px-8 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span>View Site</span>
          </button>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full px-8 py-3.5 border-t text-left text-[11px] font-bold uppercase tracking-[0.15em] flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        )}
        <p className="px-8 py-4 border-t text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Changes publish instantly
        </p>
      </div>
    </aside>
  );
}
