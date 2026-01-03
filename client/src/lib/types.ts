export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  employeeId: string;
  avatar?: string;
}

export interface Employee extends User {
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: "present" | "absent" | "half-day" | "leave";
  hoursWorked?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: "paid" | "sick" | "unpaid";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  adminComment?: string;
  appliedOn: string;
}

// Mock Data
export const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    employeeId: "EMP001",
    name: "Sarah Johnson",
    email: "sarah@dayflow.com",
    role: "employee",
    department: "Engineering",
    position: "Frontend Developer",
    joinDate: "2024-01-15",
    salary: 85000,
    phone: "+1 (555) 123-4567",
    address: "123 Tech Blvd, San Francisco, CA",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "emp-2",
    employeeId: "EMP002",
    name: "Michael Chen",
    email: "michael@dayflow.com",
    role: "employee",
    department: "Product",
    position: "Product Manager",
    joinDate: "2023-11-01",
    salary: 95000,
    phone: "+1 (555) 987-6543",
    address: "456 Market St, San Francisco, CA",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "emp-3",
    employeeId: "EMP003",
    name: "Jessica Davis",
    email: "jessica@dayflow.com",
    role: "employee",
    department: "Design",
    position: "UI/UX Designer",
    joinDate: "2024-03-10",
    salary: 78000,
    phone: "+1 (555) 456-7890",
    address: "789 Art Ave, Oakland, CA",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150"
  },
  {
    id: "emp-4",
    employeeId: "EMP004",
    name: "David Wilson",
    email: "david@dayflow.com",
    role: "employee",
    department: "Engineering",
    position: "Backend Developer",
    joinDate: "2023-08-20",
    salary: 92000,
    phone: "+1 (555) 222-3333",
    address: "321 Code Ln, San Jose, CA",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150"
  }
];

export const mockAttendance: AttendanceRecord[] = [
  // Today's records
  { id: "att-1", employeeId: "emp-1", date: new Date().toISOString().split('T')[0], checkIn: "09:00", status: "present" },
  { id: "att-2", employeeId: "emp-2", date: new Date().toISOString().split('T')[0], checkIn: "08:45", checkOut: "17:30", status: "present", hoursWorked: 8.75 },
  // Past records
  { id: "att-3", employeeId: "emp-1", date: "2024-05-20", checkIn: "09:05", checkOut: "18:00", status: "present", hoursWorked: 8.9 },
  { id: "att-4", employeeId: "emp-1", date: "2024-05-19", checkIn: "09:00", checkOut: "17:00", status: "present", hoursWorked: 8 },
  { id: "att-5", employeeId: "emp-2", date: "2024-05-20", checkIn: "08:30", checkOut: "17:30", status: "present", hoursWorked: 9 },
  { id: "att-6", employeeId: "emp-3", date: new Date().toISOString().split('T')[0], checkIn: "", status: "leave" },
];

export const mockLeaves: LeaveRequest[] = [
  {
    id: "leave-1",
    employeeId: "emp-1",
    type: "paid",
    startDate: "2024-06-01",
    endDate: "2024-06-05",
    reason: "Family Vacation",
    status: "pending",
    appliedOn: "2024-05-21"
  },
  {
    id: "leave-2",
    employeeId: "emp-3",
    type: "sick",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: "Flu",
    status: "approved",
    adminComment: "Get well soon!",
    appliedOn: "2024-05-20"
  },
  {
    id: "leave-3",
    employeeId: "emp-2",
    type: "unpaid",
    startDate: "2024-05-15",
    endDate: "2024-05-15",
    reason: "Personal Appointment",
    status: "rejected",
    adminComment: "Urgent meeting scheduled",
    appliedOn: "2024-05-10"
  }
];
