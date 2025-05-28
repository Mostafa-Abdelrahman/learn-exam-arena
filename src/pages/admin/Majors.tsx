import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import MajorService from "@/services/major.service";
import { Loader2, Search, Plus, Edit, Trash2 } from "lucide-react";

const AdminMajors = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: majors, isLoading } = useQuery({
    queryKey: ["admin-majors"],
    queryFn: async () => {
      try {
        const response = await MajorService.getAllMajors();
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch majors",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const filteredMajors = majors?.filter(major =>
    major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (major.description && major.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Manage Majors</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search majors..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Major
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Academic Majors</CardTitle>
          <CardDescription>
            Manage all academic majors in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="w-full relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Major Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Doctors</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMajors.map((major) => (
                    <TableRow key={major.id}>
                      <TableCell className="font-medium">{major.name}</TableCell>
                      <TableCell>{major.description || "No description"}</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMajors;
