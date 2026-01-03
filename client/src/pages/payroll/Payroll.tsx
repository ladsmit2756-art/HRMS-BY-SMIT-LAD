import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Payroll() {
  const { user } = useAuth();
  
  if (!user) return null;
  const isAdmin = user.role === 'admin';

  // Mock Payroll Data
  const payrolls = [
    { id: 1, month: "April 2024", basic: 4500, status: "Paid", date: "2024-04-30" },
    { id: 2, month: "March 2024", basic: 4500, status: "Paid", date: "2024-03-31" },
    { id: 3, month: "February 2024", basic: 4500, status: "Paid", date: "2024-02-29" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Manage salary and payslips" : "View your salary slips and payment history"}
          </p>
        </div>
        {isAdmin && (
           <Button className="gap-2 shadow-lg shadow-primary/20">
            Run Payroll
          </Button>
        )}
      </div>

      {!isAdmin && (
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground border-none shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary-foreground/80">Current Salary (Annual)</CardDescription>
              <CardTitle className="text-3xl font-bold">${(user as any).salary.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm opacity-80">Next payout: May 31, 2024</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>{isAdmin ? "Recent Transactions" : "Payslip History"}</CardTitle>
          <CardDescription>
            Download your monthly payslips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((pay) => (
                <TableRow key={pay.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      {pay.month}
                    </div>
                  </TableCell>
                  <TableCell>{pay.date}</TableCell>
                  <TableCell>${(user as any).salary ? Math.round((user as any).salary / 12).toLocaleString() : pay.basic}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {pay.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
