import { Bell, Clock, User } from "lucide-react";

const DashboardHeader = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-foreground text-xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's your campus overview.</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive rounded-full text-[9px] text-destructive-foreground flex items-center justify-center">3</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          {time}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
