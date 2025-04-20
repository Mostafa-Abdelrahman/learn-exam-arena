
import { useEffect } from "react";

const DoctorSettings = () => {
  useEffect(() => {
    // Load data when component mounts
    console.log("Doctor Settings component mounted");
  }, []);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <p className="text-muted-foreground text-center py-8">
          The Settings interface will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default DoctorSettings;
