import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const trendData = [
  { name: "Week 1", Engineering: 82, Arts: 75, Science: 88 },
  { name: "Week 2", Engineering: 85, Arts: 72, Science: 90 },
  { name: "Week 3", Engineering: 78, Arts: 80, Science: 85 },
  { name: "Week 4", Engineering: 90, Arts: 78, Science: 92 },
  { name: "Week 5", Engineering: 88, Arts: 82, Science: 87 },
];

const heatmapData = [
  { time: "8 AM", "ENG-101": 85, "ARTS-202": 45, "SCI-303": 70, "LAB-104": 90 },
  { time: "10 AM", "ENG-101": 95, "ARTS-202": 80, "SCI-303": 88, "LAB-104": 100 },
  { time: "12 PM", "ENG-101": 60, "ARTS-202": 55, "SCI-303": 45, "LAB-104": 75 },
  { time: "2 PM", "ENG-101": 92, "ARTS-202": 88, "SCI-303": 95, "LAB-104": 85 },
  { time: "4 PM", "ENG-101": 78, "ARTS-202": 72, "SCI-303": 80, "LAB-104": 65 },
  { time: "6 PM", "ENG-101": 40, "ARTS-202": 35, "SCI-303": 50, "LAB-104": 30 },
];

const getHeatColor = (value: number) => {
  if (value >= 90) return "bg-primary";
  if (value >= 70) return "bg-primary/70";
  if (value >= 50) return "bg-primary/40";
  return "bg-primary/20";
};

const CampusInsights = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h2 className="text-foreground font-semibold text-lg mb-1">Campus Insights</h2>
      <p className="text-muted-foreground text-sm mb-6">Attendance trends and room utilization analytics</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div>
          <h3 className="text-foreground font-medium text-sm mb-1">Attendance Trends by Department</h3>
          <p className="text-muted-foreground text-xs mb-4">Average weekly attendance rate (%)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150 5% 16%)" />
              <XAxis dataKey="name" tick={{ fill: "hsl(150 5% 55%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(150 5% 55%)", fontSize: 11 }} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(150 5% 9%)", border: "1px solid hsl(150 5% 16%)", borderRadius: 8, color: "#fff" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Engineering" fill="hsl(160 84% 39%)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Arts" fill="hsl(200 80% 50%)" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Science" fill="hsl(280 70% 55%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap */}
        <div>
          <h3 className="text-foreground font-medium text-sm mb-1">Room Utilization Heatmap</h3>
          <p className="text-muted-foreground text-xs mb-4">Occupancy percentage throughout the day</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left text-muted-foreground font-normal py-2 pr-3">Time</th>
                  {["ENG-101", "ARTS-202", "SCI-303", "LAB-104"].map((room) => (
                    <th key={room} className="text-center text-muted-foreground font-normal py-2 px-2">{room}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.time}>
                    <td className="text-muted-foreground py-1.5 pr-3">{row.time}</td>
                    {["ENG-101", "ARTS-202", "SCI-303", "LAB-104"].map((room) => {
                      const val = row[room as keyof typeof row] as number;
                      return (
                        <td key={room} className="py-1.5 px-2">
                          <div className={`rounded-md py-1.5 text-center text-foreground ${getHeatColor(val)}`}>
                            {val}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
            <span>Low</span>
            <div className="flex gap-1">
              <div className="w-6 h-3 rounded bg-primary/20" />
              <div className="w-6 h-3 rounded bg-primary/40" />
              <div className="w-6 h-3 rounded bg-primary/70" />
              <div className="w-6 h-3 rounded bg-primary" />
            </div>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusInsights;
