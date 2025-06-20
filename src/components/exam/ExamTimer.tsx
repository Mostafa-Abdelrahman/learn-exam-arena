
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ExamTimerProps {
  timeRemaining: number;
}

const ExamTimer = ({ timeRemaining }: ExamTimerProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getVariant = () => {
    if (timeRemaining < 300) return "destructive"; // Last 5 minutes
    if (timeRemaining < 900) return "secondary"; // Last 15 minutes
    return "default";
  };

  return (
    <Badge variant={getVariant()} className="space-x-2">
      <Clock className="h-4 w-4" />
      <span>{formatTime(timeRemaining)}</span>
    </Badge>
  );
};

export default ExamTimer;
