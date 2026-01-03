import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Building, Briefcase, Calendar } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const { updateEmployee } = useData();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editing form
  const [phone, setPhone] = useState((user as any)?.phone || "");
  const [address, setAddress] = useState((user as any)?.address || "");

  if (!user) return null;

  // Cast user to Employee type for easier access (in real app, use proper type guards)
  const employee = user as any;

  const handleSave = () => {
    updateEmployee(user.id, { phone, address });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg"></div>
        <div className="absolute -bottom-10 left-8 flex items-end gap-6">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback className="text-4xl bg-secondary text-secondary-foreground">{employee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mb-2">
            <h1 className="text-2xl font-bold font-heading text-background drop-shadow-md pb-1">{employee.name}</h1>
            <Badge className="bg-background/90 text-foreground hover:bg-background">{employee.position}</Badge>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
           {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="shadow-lg">Edit Contact Info</Button>
           ) : (
            <div className="flex gap-2">
              <Button onClick={() => setIsEditing(false)} variant="secondary">Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
           )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-4">
        <Card className="md:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details and contact info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input value={employee.email} disabled className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone
                </Label>
                <Input 
                  value={isEditing ? phone : employee.phone} 
                  onChange={e => setPhone(e.target.value)}
                  disabled={!isEditing} 
                  className={!isEditing ? "bg-secondary/50 border-transparent shadow-none" : ""} 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Address
                </Label>
                <Input 
                  value={isEditing ? address : employee.address} 
                   onChange={e => setAddress(e.target.value)}
                  disabled={!isEditing} 
                  className={!isEditing ? "bg-secondary/50 border-transparent shadow-none" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm h-fit">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Building className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Employee ID</p>
                <p className="font-medium">{employee.employeeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Join Date</p>
                <p className="font-medium">{employee.joinDate}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-1">Employment Status</p>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 w-full justify-center py-1">Active Full-Time</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
