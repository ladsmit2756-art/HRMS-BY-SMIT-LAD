import { Switch, Route, Redirect } from "wouter";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import Login from "@/pages/auth/Login";
import EmployeeDashboard from "@/pages/dashboard/EmployeeDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import Profile from "@/pages/profile/Profile";
import Attendance from "@/pages/attendance/Attendance";
import Leaves from "@/pages/leaves/Leaves";
import Payroll from "@/pages/payroll/Payroll";
import EmployeeList from "@/pages/admin/EmployeeList";
import NotFound from "@/pages/not-found";

function PrivateRoute({ component: Component, role }: { component: React.ComponentType, role?: string }) {
  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Employee Routes */}
      <Route path="/dashboard">
        {() => <PrivateRoute component={EmployeeDashboard} />}
      </Route>
      <Route path="/profile">
        {() => <PrivateRoute component={Profile} />}
      </Route>
      <Route path="/attendance">
        {() => <PrivateRoute component={Attendance} />}
      </Route>
      <Route path="/leaves">
        {() => <PrivateRoute component={Leaves} />}
      </Route>
      <Route path="/payroll">
        {() => <PrivateRoute component={Payroll} />}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        {() => <PrivateRoute component={AdminDashboard} />}
      </Route>
      <Route path="/admin/employees">
        {() => <PrivateRoute component={EmployeeList} />}
      </Route>
      <Route path="/admin/attendance">
        {() => <PrivateRoute component={Attendance} />} 
      </Route>
      <Route path="/admin/leaves">
        {() => <PrivateRoute component={Leaves} />} 
      </Route>
      <Route path="/admin/payroll">
        {() => <PrivateRoute component={Payroll} />} 
      </Route>

      {/* Root redirect */}
      <Route path="/">
        <Redirect to="/login" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router />
        <Toaster />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
