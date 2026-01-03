import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Employee, LeaveRequest, AttendanceRecord } from "@/lib/types";
import { mockEmployees, mockAttendance, mockLeaves } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, role: "admin" | "employee") => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking local storage for session
    const storedUser = localStorage.getItem("dayflow_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: "admin" | "employee") => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      let foundUser: User | undefined;
      
      if (role === 'admin') {
        // Hardcoded admin for demo
        if (email === 'admin@dayflow.com') {
          foundUser = {
            id: "admin-1",
            name: "System Admin",
            email: "admin@dayflow.com",
            role: "admin",
            employeeId: "ADM001"
          };
        }
      } else {
        foundUser = mockEmployees.find(e => e.email === email);
      }

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("dayflow_user", JSON.stringify(foundUser));
        toast({
          title: "Welcome back!",
          description: `Logged in as ${foundUser.name}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials. Try admin@dayflow.com (Admin) or sarah@dayflow.com (Employee)",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dayflow_user");
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
