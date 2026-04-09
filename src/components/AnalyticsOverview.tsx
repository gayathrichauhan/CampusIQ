import { TrendingUp, AlertTriangle, Building2 } from "lucide-react";

const cards = [
  {
    title: "Attendance Rate",
    value: "85%",
    change: "+2.5% from last week",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "Proxy Alerts",
    value: "2",
    change: "-3 from last week",
    positive: true,
    icon: AlertTriangle,
  },
  {
    title: "Room Utilization",
    value: "92%",
    change: "+5% from last week",
    positive: true,
    icon: Building2,
  },
];

const AnalyticsOverview = () => {
  return (
    <div>
      <h2 className="text-foreground font-semibold text-lg mb-4">Analytics Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm">{card.title}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{card.value}</p>
                <p className="text-primary text-xs mt-2">{card.change}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsOverview;
