
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ExamService from "@/services/exam.service";
import { Calendar, Clock, MapPin, Bell, Plus } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";

const StudentSchedule = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: upcomingExams, isLoading: isLoadingExams } = useQuery({
    queryKey: ["upcoming-exams"],
    queryFn: async () => {
      try {
        const response = await ExamService.getUpcomingExams();
        return response.data;
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch upcoming exams",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getExamsForDate = (date: Date) => {
    return upcomingExams?.filter(exam => 
      isSameDay(parseISO(exam.exam_date), date)
    ) || [];
  };

  const handleSetReminder = (examId: string) => {
    toast({
      title: "Reminder Set",
      description: "You'll be notified before the exam starts.",
    });
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">My Schedule</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            This Week
          </Button>
        </div>
      </div>

      {/* Week View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Week of {format(weekStart, 'MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-7">
            {weekDays.map((day, index) => {
              const dayExams = getExamsForDate(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div 
                  key={index}
                  className={`p-3 border rounded-lg ${
                    isToday ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="text-center mb-2">
                    <p className="text-sm font-medium">
                      {format(day, 'EEE')}
                    </p>
                    <p className={`text-lg ${isToday ? 'font-bold text-primary' : ''}`}>
                      {format(day, 'd')}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    {dayExams.map((exam) => (
                      <div 
                        key={exam.id}
                        className="p-2 bg-muted rounded text-xs"
                      >
                        <p className="font-medium truncate">{exam.name}</p>
                        <p className="text-muted-foreground">
                          {exam.course?.code}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Exams List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Upcoming Exams
          </CardTitle>
          <CardDescription>Your scheduled exams for the coming weeks</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingExams ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingExams && upcomingExams.length > 0 ? (
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{exam.name}</h4>
                      <Badge variant="outline">{exam.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(exam.exam_date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{exam.course?.name} ({exam.course?.code})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Badge variant={
                      new Date(exam.exam_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ? "destructive" 
                        : "secondary"
                    }>
                      {new Date(exam.exam_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        ? "This Week"
                        : "Upcoming"
                      }
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSetReminder(exam.id)}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Remind Me
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4" />
              <p>No upcoming exams scheduled</p>
              <p className="text-sm">Check back later for new exam schedules</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Study Schedule Recommendations</CardTitle>
          <CardDescription>Suggested study plan based on your upcoming exams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingExams?.slice(0, 3).map((exam, index) => {
              const daysUntil = Math.ceil((new Date(exam.exam_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {daysUntil > 0 ? `${daysUntil} days to prepare` : 'Exam today!'}
                    </p>
                  </div>
                  <Badge variant={daysUntil <= 3 ? "destructive" : daysUntil <= 7 ? "secondary" : "outline"}>
                    {daysUntil <= 3 ? "High Priority" : daysUntil <= 7 ? "Medium Priority" : "Low Priority"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSchedule;
