import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseBusiness, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"employee" | "admin">("employee");
  const { login, user } = useAuth();
  const [_, setLocation] = useLocation();

  if (user) {
    setLocation(user.role === 'admin' ? '/admin' : '/dashboard');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
  };

  const fillDemoEmployee = () => {
    setEmail("sarah@dayflow.com");
    setPassword("password");
    setRole("employee");
  };

  const fillDemoAdmin = () => {
    setEmail("admin@dayflow.com");
    setPassword("password");
    setRole("admin");
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <BriefcaseBusiness className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Welcome to Dayflow</h1>
          <p className="text-muted-foreground">Sign in to manage your workspace</p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-black/5">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="employee" className="w-full" onValueChange={(v) => setRole(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="employee">Employee</TabsTrigger>
                <TabsTrigger value="admin">Admin / HR</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                     className="bg-background/50"
                  />
                </div>
                
                <Button type="submit" className="w-full h-10 font-medium text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                  Sign In
                </Button>
              </form>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border grid gap-2">
              <p className="text-xs text-muted-foreground text-center mb-2">Demo Accounts (Click to autofill):</p>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={fillDemoEmployee}>
                Fill Employee (Sarah)
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={fillDemoAdmin}>
                Fill Admin (System Admin)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
