import { Users, FileDown } from "lucide-react";

const RealtimeFeed = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-foreground font-semibold">Real-time Feed</h3>
        </div>
        <button className="flex items-center gap-1.5 text-muted-foreground text-xs hover:text-foreground transition-colors">
          <FileDown className="h-3.5 w-3.5" />
          Download Attendance Report
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 bg-secondary/50 rounded-lg p-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Present</p>
          <p className="text-foreground font-semibold">0 <span className="text-muted-foreground font-normal">/ 35</span></p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Proxy Alerts</p>
          <p className="text-warning font-semibold">0</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Rate</p>
          <p className="text-primary font-semibold">0%</p>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center py-8 text-muted-foreground">
        <Users className="h-10 w-10 mb-2 opacity-40" />
        <p className="text-sm">No active session</p>
      </div>
    </div>
  );
};

export default RealtimeFeed;
