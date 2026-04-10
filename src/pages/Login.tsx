import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"faculty" | "student">("faculty");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "faculty") {
      navigate("/");
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">SC</span>
          </div>
          <div>
            <h1 className="text-foreground font-bold text-xl">Smart Campus</h1>
            <p className="text-muted-foreground text-xs">PS-101 | INNOVATHERS</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-foreground font-semibold text-lg mb-1">Sign In</h2>
          <p className="text-muted-foreground text-sm mb-6">Access your campus dashboard</p>

          {/* Role Toggle */}
          <div className="flex bg-secondary rounded-lg p-0.5 mb-6">
            {(["faculty", "student"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 text-sm py-2 rounded-md transition-colors capitalize ${
                  role === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-muted-foreground text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === "faculty" ? "faculty@campus.edu" : "student@campus.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-muted-foreground text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In as {role === "faculty" ? "Faculty" : "Student"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-4">
            Demo: Use any email/password to login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
