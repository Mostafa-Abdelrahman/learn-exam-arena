
import { useEffect } from "react";

const DoctorReports = () => {
  useEffect(() => {
    // Load data when component mounts
    console.log("Doctor Reports component mounted");
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Performance Reports</h2>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-muted-foreground text-center py-8">
          The Performance Reports interface will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default DoctorReports;
