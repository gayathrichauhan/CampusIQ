import CampusSidebar from "@/components/CampusSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AttendanceSession from "@/components/AttendanceSession";
import RealtimeFeed from "@/components/RealtimeFeed";
import AnalyticsOverview from "@/components/AnalyticsOverview";
import LiveRoomStatus from "@/components/LiveRoomStatus";
import CampusInsights from "@/components/CampusInsights";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="flex min-h-screen">
      <CampusSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardHeader />

        {/* Faculty badge */}
        <Badge variant="outline" className="mb-4 text-xs text-muted-foreground border-border">
          Viewing as: Faculty
        </Badge>

        {/* Attendance + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <AttendanceSession />
          <RealtimeFeed />
        </div>

        {/* Analytics */}
        <div className="mb-6">
          <AnalyticsOverview />
        </div>

        {/* Live Rooms */}
        <div className="mb-6">
          <LiveRoomStatus />
        </div>

        {/* Insights */}
        <CampusInsights />
      </main>
    </div>
  );
};

export default Index;
