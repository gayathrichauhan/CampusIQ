import { DoorOpen, ChevronDown } from "lucide-react";

interface Room {
  id: string;
  status: "in-progress" | "available";
  temperature: string;
  occupancy: number;
  course?: string;
}

const rooms: Room[] = [
  { id: "CR-101", status: "in-progress", temperature: "22°C", occupancy: 85, course: "CS-101" },
  { id: "CR-102", status: "available", temperature: "24°C", occupancy: 0 },
  { id: "CR-103", status: "in-progress", temperature: "23°C", occupancy: 72, course: "ECE-201" },
  { id: "CR-104", status: "available", temperature: "25°C", occupancy: 0 },
  { id: "CR-105", status: "available", temperature: "23°C", occupancy: 0 },
  { id: "CR-106", status: "in-progress", temperature: "22°C", occupancy: 91, course: "ME-301" },
  { id: "CR-107", status: "available", temperature: "24°C", occupancy: 0 },
  { id: "CR-108", status: "in-progress", temperature: "21°C", occupancy: 68, course: "PHY-102" },
];

const LiveRoomStatus = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <DoorOpen className="h-5 w-5 text-primary" />
          <h2 className="text-foreground font-semibold text-lg">Live Room Status</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live
          </span>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            View All <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mb-5">Real-time IoT monitoring of campus classrooms</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {rooms.map((room) => {
          const isActive = room.status === "in-progress";
          return (
            <div
              key={room.id}
              className={`rounded-lg p-4 border ${
                isActive ? "bg-secondary border-warning/30" : "bg-secondary border-primary/20"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-foreground font-semibold text-sm">{room.id}</span>
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-warning" : "bg-primary"}`} />
              </div>
              <p className={`text-xs mb-3 ${isActive ? "text-warning" : "text-primary"}`}>
                {isActive ? "Class in Progress" : "Available for Study"}
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Temperature</span>
                  <span className="text-foreground">{room.temperature}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Occupancy</span>
                  <span className="text-foreground">{room.occupancy}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${isActive ? "bg-warning" : "bg-primary"}`}
                    style={{ width: `${room.occupancy}%` }}
                  />
                </div>
                {room.course && (
                  <p className="text-muted-foreground">Course: {room.course}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveRoomStatus;
