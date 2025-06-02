
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MajorService from "@/services/major.service";
import { Loader2, Search, Plus, Edit, Trash2, School, Users, BookOpen } from "lucide-react";

const AdminMajors = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    status: "active"
  });

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

  const createMajorMutation = useMutation({
    mutationFn: (majorData) => MajorService.createMajor(majorData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-majors"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Major created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create major",
        variant: "destructive",
      });
    },
  });

  const updateMajorMutation = useMutation({
    mutationFn: ({ id, data }) => MajorService.updateMajor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-majors"] });
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Major updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update major",
        variant: "destructive",
      });
    },
  });

  const deleteMajorMutation = useMutation({
    mutationFn: (majorId) => MajorService.deleteMajor(majorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-majors"] });
      toast({
        title: "Success",
        description: "Major deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete major",
        variant: "destructive",
      });
    },
  });

  const filteredMajors = majors?.filter(major =>
    major.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    major.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (major.description && major.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      status: "active"
    });
    setSelectedMajor(null);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createMajorMutation.mutate(formData);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateMajorMutation.mutate({ id: selectedMajor.id, data: formData });
  };

  const handleEdit = (major) => {
    setSelectedMajor(major);
    setFormData({
      name: major.name,
      code: major.code,
      description: major.description || "",
      status: major.status
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (majorId) => {
    if (confirm("Are you sure you want to delete this major?")) {
      deleteMajorMutation.mutate(majorId);
    }
  };

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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Major
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Major</DialogTitle>
                  <DialogDescription>
                    Add a new academic major to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Major Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="code">Major Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMajorMutation.isPending}>
                    {createMajorMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Major
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Majors</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{majors?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Majors</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {majors?.filter(m => m.status === 'active').length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {majors?.reduce((acc, major) => acc + (major.student_count || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
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
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMajors.map((major) => (
                    <TableRow key={major.id}>
                      <TableCell className="font-medium">{major.name}</TableCell>
                      <TableCell>{major.code}</TableCell>
                      <TableCell>{major.description || "No description"}</TableCell>
                      <TableCell>{major.student_count || 0}</TableCell>
                      <TableCell>{major.course_count || 0}</TableCell>
                      <TableCell>
                        <Badge variant={major.status === 'active' ? 'default' : 'secondary'}>
                          {major.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(major)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(major.id)}
                          >
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Major</DialogTitle>
              <DialogDescription>
                Update the major information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Major Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-code">Major Code</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={updateMajorMutation.isPending}>
                {updateMajorMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Major
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMajors;
