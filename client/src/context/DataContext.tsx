import { createContext, useContext, useState, ReactNode } from "react";
import { Employee, AttendanceRecord, LeaveRequest, mockEmployees, mockAttendance, mockLeaves } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface DataContextType {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  
  // Actions
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  
  clockIn: (employeeId: string) => void;
  clockOut: (employeeId: string) => void;
  
  requestLeave: (request: Omit<LeaveRequest, "id" | "status" | "appliedOn">) => void;
  updateLeaveStatus: (id: string, status: "approved" | "rejected", comment?: string) => void;
  
  getEmployeeAttendance: (employeeId: string) => AttendanceRecord[];
  getEmployeeLeaves: (employeeId: string) => LeaveRequest[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(mockLeaves);
  const { toast } = useToast();

  const addEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
    toast({ title: "Employee Added", description: `${employee.name} has been added.` });
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...data } : emp));
    toast({ title: "Profile Updated", description: "Changes have been saved." });
  };

  const clockIn = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(a => a.employeeId === employeeId && a.date === today);
    
    if (existing) {
      toast({ variant: "destructive", title: "Already Checked In", description: "You have already clocked in today." });
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      date: today,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "present"
    };

    setAttendance([newRecord, ...attendance]);
    toast({ title: "Clocked In", description: `You clocked in at ${newRecord.checkIn}` });
  };

  const clockOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const record = attendance.find(a => a.employeeId === employeeId && a.date === today);

    if (!record) {
      toast({ variant: "destructive", title: "Error", description: "You need to clock in first." });
      return;
    }

    if (record.checkOut) {
      toast({ variant: "destructive", title: "Already Checked Out", description: "You have already clocked out." });
      return;
    }

    const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Simple calculation for mock hours (assuming checkIn is HH:MM)
    // In a real app, use date-fns difference
    const updatedRecord = { ...record, checkOut: checkOutTime, hoursWorked: 8 }; // Mock 8 hours for now

    setAttendance(attendance.map(a => a.id === record.id ? updatedRecord : a));
    toast({ title: "Clocked Out", description: `You clocked out at ${checkOutTime}` });
  };

  const requestLeave = (request: Omit<LeaveRequest, "id" | "status" | "appliedOn">) => {
    const newLeave: LeaveRequest = {
      ...request,
      id: `leave-${Date.now()}`,
      status: "pending",
      appliedOn: new Date().toISOString().split('T')[0]
    };
    setLeaves([newLeave, ...leaves]);
    toast({ title: "Leave Requested", description: "Your manager will review it shortly." });
  };

  const updateLeaveStatus = (id: string, status: "approved" | "rejected", comment?: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status, adminComment: comment } : l));
    toast({ 
      title: `Leave ${status === 'approved' ? 'Approved' : 'Rejected'}`, 
      description: `Request status has been updated.` 
    });
  };

  const getEmployeeAttendance = (employeeId: string) => {
    return attendance.filter(a => a.employeeId === employeeId).sort((a, b) => b.date.localeCompare(a.date));
  };

  const getEmployeeLeaves = (employeeId: string) => {
    return leaves.filter(l => l.employeeId === employeeId).sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
  };

  return (
    <DataContext.Provider value={{
      employees, attendance, leaves,
      addEmployee, updateEmployee,
      clockIn, clockOut,
      requestLeave, updateLeaveStatus,
      getEmployeeAttendance, getEmployeeLeaves
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
