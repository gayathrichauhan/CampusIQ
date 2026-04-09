import { LayoutDashboard, UserCheck, DoorOpen, BarChart3, Settings } from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Attendance", icon: UserCheck },
  { title: "Rooms", icon: DoorOpen },
  { title: "Analytics", icon: BarChart3 },
  { title: "Settings", icon: Settings },
];

const CampusSidebar = () => {
  const [viewAs, setViewAs] = useState<"Faculty" | "Student">("Faculty");

  return (
    <aside className="w-52 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">SC</span>
        </div>
        <div>
          <h1 className="text-sidebar-accent-foreground font-semibold text-sm">Smart Campus</h1>
          <p className="text-muted-foreground text-xs">PS-101</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-4 mt-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">View as</p>
        <div className="flex bg-secondary rounded-lg p-0.5">
          {(["Faculty", "Student"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setViewAs(role)}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
                viewAs === role
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 px-2">
        {navItems.map((item) => (
          <button
            key={item.title}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-muted-foreground text-xs">PS</span>
        </div>
        <div>
          <p className="text-sm text-sidebar-accent-foreground">Dr. Priya Sharma</p>
          <p className="text-xs text-muted-foreground">CS Department</p>
        </div>
      </div>
    </aside>
  );
};

export default CampusSidebar;
