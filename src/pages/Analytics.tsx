import CampusSidebar from "@/components/CampusSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AnalyticsOverview from "@/components/AnalyticsOverview";
import CampusInsights from "@/components/CampusInsights";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const proxyData = [
  { name: "Genuine", value: 342 },
  { name: "Proxy Attempts", value: 8 },
];

const COLORS = ["hsl(160 84% 39%)", "hsl(0 72% 51%)"];

const trendData = [
  { day: "Mon", rate: 82 },
  { day: "Tue", rate: 87 },
  { day: "Wed", rate: 79 },
  { day: "Thu", rate: 91 },
  { day: "Fri", rate: 85 },
];

const departmentStats = [
  { dept: "Computer Science", rate: 88, students: 120, proxies: 3 },
  { dept: "Electronics", rate: 82, students: 95, proxies: 2 },
  { dept: "Mechanical", rate: 76, students: 110, proxies: 5 },
  { dept: "Physics", rate: 91, students: 60, proxies: 0 },
];

const Analytics = () => {
  return (
    <div className="flex min-h-screen">
      <CampusSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardHeader />
        <Badge variant="outline" className="mb-4 text-xs text-muted-foreground border-border">
          Analytics & Insights
        </Badge>

        <AnalyticsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6 mb-6">
          {/* Weekly Trend */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-foreground font-semibold mb-1">Weekly Attendance Trend</h3>
            <p className="text-muted-foreground text-xs mb-4">This week's daily attendance rate</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 5% 16%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(150 5% 55%)", fontSize: 11 }} axisLine={false} />
                <YAxis tick={{ fill: "hsl(150 5% 55%)", fontSize: 11 }} axisLine={false} domain={[70, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(150 5% 9%)", border: "1px solid hsl(150 5% 16%)", borderRadius: 8, color: "#fff" }} />
                <Line type="monotone" dataKey="rate" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ fill: "hsl(160 84% 39%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Proxy vs Genuine */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-foreground font-semibold mb-1">Attendance Authenticity</h3>
            <p className="text-muted-foreground text-xs mb-4">Genuine vs proxy attempts ratio</p>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={proxyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {proxyData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(150 5% 9%)", border: "1px solid hsl(150 5% 16%)", borderRadius: 8, color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Department Table */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h3 className="text-foreground font-semibold mb-4">Department-wise Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-muted-foreground font-normal py-3">Department</th>
                <th className="text-left text-muted-foreground font-normal py-3">Students</th>
                <th className="text-left text-muted-foreground font-normal py-3">Attendance Rate</th>
                <th className="text-left text-muted-foreground font-normal py-3">Proxy Alerts</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((d) => (
                <tr key={d.dept} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-foreground font-medium">{d.dept}</td>
                  <td className="py-3 text-muted-foreground">{d.students}</td>
                  <td className="py-3">
                    <span className={d.rate >= 85 ? "text-primary" : d.rate >= 75 ? "text-warning" : "text-destructive"}>
                      {d.rate}%
                    </span>
                  </td>
                  <td className="py-3">
                    {d.proxies > 0 ? <span className="text-destructive">{d.proxies}</span> : <span className="text-muted-foreground">0</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CampusInsights />
      </main>
    </div>
  );
};

export default Analytics;
