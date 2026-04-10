import CampusSidebar from "@/components/CampusSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import LiveRoomStatus from "@/components/LiveRoomStatus";
import { Badge } from "@/components/ui/badge";
import { MapPin, Thermometer, Users, Wifi } from "lucide-react";

const roomDetails = [
  { id: "CR-101", name: "Room 301", floor: "3rd Floor", capacity: 60, status: "occupied", temp: "22°C", occupancy: 85, course: "CS-101", faculty: "Dr. Priya Sharma", endsIn: "35 min" },
  { id: "CR-102", name: "Room 302", floor: "3rd Floor", capacity: 40, status: "free", temp: "24°C", occupancy: 0 },
  { id: "CR-103", name: "Lab 1", floor: "2nd Floor", capacity: 30, status: "occupied", temp: "23°C", occupancy: 72, course: "ECE-201", faculty: "Prof. Amit Roy", endsIn: "50 min" },
  { id: "CR-104", name: "Seminar Hall", floor: "1st Floor", capacity: 120, status: "free", temp: "25°C", occupancy: 0 },
  { id: "CR-105", name: "Room 201", floor: "2nd Floor", capacity: 50, status: "free", temp: "23°C", occupancy: 0 },
  { id: "CR-106", name: "Room 401", floor: "4th Floor", capacity: 45, status: "ending_soon", temp: "22°C", occupancy: 91, course: "ME-301", faculty: "Dr. Neha Gupta", endsIn: "12 min" },
];

const statusConfig = {
  occupied: { label: "Occupied", color: "bg-destructive", textColor: "text-destructive" },
  free: { label: "Free", color: "bg-primary", textColor: "text-primary" },
  ending_soon: { label: "Ending Soon", color: "bg-warning", textColor: "text-warning" },
};

const Rooms = () => {
  return (
    <div className="flex min-h-screen">
      <CampusSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardHeader />
        <Badge variant="outline" className="mb-4 text-xs text-muted-foreground border-border">
          Room & Resource Management
        </Badge>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Rooms", value: "6", icon: MapPin },
            { label: "Currently Occupied", value: "3", icon: Users },
            { label: "IoT Sensors Active", value: "24", icon: Wifi },
          ].map((card) => (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{card.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{card.value}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Room Cards */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h2 className="text-foreground font-semibold text-lg mb-4">Room Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomDetails.map((room) => {
              const config = statusConfig[room.status as keyof typeof statusConfig];
              return (
                <div key={room.id} className="bg-secondary rounded-lg p-4 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-foreground font-semibold">{room.name}</span>
                      <p className="text-muted-foreground text-xs">{room.id} • {room.floor}</p>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                  </div>
                  <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> Temp</span>
                      <span className="text-foreground">{room.temp}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Capacity</span>
                      <span className="text-foreground">{room.capacity} seats</span>
                    </div>
                    {room.course && (
                      <>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Course</span>
                          <span className="text-foreground">{room.course}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Faculty</span>
                          <span className="text-foreground">{room.faculty}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Ends in</span>
                          <span className={config.textColor}>{room.endsIn}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <LiveRoomStatus />
      </main>
    </div>
  );
};

export default Rooms;
